require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// ====================== KONFIGURACJA BAZY ======================
const fs = require("fs");
const dbFile = "mydb.sqlite";

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, "");
  console.log(
    "Utworzono nowy plik bazy danych SQLite, poniważ plik nie istniał"
  );
}

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error("Błąd połączenia z bazą SQLite:", err);
    process.exit(1);
  }
  console.log("Połączono z bazą SQLite.");

  // Tabela "users" (bez admina)
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      caloriesGoal INTEGER NOT NULL DEFAULT '2000'
    )
  `,
    (err) => {
      if (err) {
        console.error("Błąd tworzenia tabeli users:", err);
      } else {
        console.log('Tabela "users" gotowa (lub już istniała).');
      }
    }
  );

  // Tabela "mealsHistory"
  db.run(
    `
    CREATE TABLE IF NOT EXISTS mealsHistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userID INTEGER NOT NULL,
      date TEXT NOT NULL,
      mealName TEXT NOT NULL,
      productName TEXT NOT NULL,
      grams REAL NOT NULL,
      calories REAL DEFAULT 0,
      proteins REAL DEFAULT 0,
      carbs REAL DEFAULT 0,
      fats REAL DEFAULT 0
    )
  `,
    (err) => {
      if (err) {
        console.error("Błąd tworzenia tabeli mealsHistory:", err);
      } else {
        console.log('Tabela "mealsHistory" gotowa (lub już istniała).');
      }
    }
  );

  // utworzenie tabeli produktów
  db.run(
    `
    CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            calories_per_100g REAL NOT NULL,
            protein_per_100g REAL NOT NULL,
            fat_per_100g REAL NOT NULL,
            carbs_per_100g REAL NOT NULL,
            average_weight_per_item_g REAL NULL
    )
    `,
    (err) => {
      if (err) {
        console.error("Błąd tworzenia tabeli products:", err);
      } else {
        console.log(
          'Tabela "products" została zainicjowana (lub już istniała).'
        );

        // Wczytanie danych z pliku JSON
        const productsData = JSON.parse(
          fs.readFileSync("./setupData/products.json", "utf-8")
        );

        // Sprawdzenie, czy tabela products jest pusta
        db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
          if (err) {
            console.error("Błąd sprawdzania tabeli products:", err);
            return;
          }

          if (row.count === 0) {
            console.log("Tabela 'products' jest pusta. Wstawianie danych...");

            const insertStmt = db.prepare(`
                INSERT INTO products (name, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g, average_weight_per_item_g)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            db.serialize(() => {
              productsData.forEach((product, index) => {
                insertStmt.run(
                  product.name,
                  product.calories_per_100g,
                  product.protein_per_100g,
                  product.fat_per_100g,
                  product.carbs_per_100g,
                  product.average_weight_per_item_g || null,
                  (err) => {
                    if (err) {
                      console.error(
                        `Błąd wstawiania produktu ${product.name}:`,
                        err
                      );
                    } else if (index === productsData.length - 1) {
                      console.log(
                        "Dane zostały pomyślnie dodane do tabeli 'products'."
                      );
                    }
                  }
                );
              });

              insertStmt.finalize();
            });
          } else {
            console.log(
              "Tabela 'products' już zawiera dane. Pominięto wstawianie."
            );
          }
        });
      }
    }
  );
});

// ================== TABLICA NA REFRESH TOKENY (tylko demo) ==================
let refreshTokens = [];

// ================== FUNKCJE POMOCNICZE (JWT) ===================
function generateAccessToken(userId) {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Brak ACCESS_TOKEN_SECRET w pliku .env");
  }
  // Rola na sztywno user – usuwamy z payload
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(userId) {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Brak REFRESH_TOKEN_SECRET w pliku .env");
  }
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

// Middleware: sprawdzanie poprawności tokenu
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // np. "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Brak tokenu" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: "Token niepoprawny lub wygasł" });
    }
    // userData = { userId, iat, exp }
    req.user = userData;
    next();
  });
}

// ======================== ENDPOINTY UŻYTKOWNICY ========================

// Rejestracja
app.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // Rola nie jest przekazywana – zawsze 'user'

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Wszystkie pola są wymagane" });
  }

  // Sprawdź czy istnieje już użytkownik o podanym email
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Błąd odczytu z bazy" });
    }
    if (row) {
      return res
        .status(400)
        .json({ message: "Użytkownik o tym email już istnieje" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Zapisujemy w bazie (kolumna "role" zawsze 'user')
      db.run(
        `
        INSERT INTO users (firstName, lastName, email, password, role)
        VALUES (?, ?, ?, ?, 'user')
      `,
        [firstName, lastName, email, hashedPassword],
        function (insertErr) {
          if (insertErr) {
            console.error(insertErr);
            return res.status(500).json({ message: "Błąd zapisu do bazy" });
          }
          return res
            .status(201)
            .json({ message: "Użytkownik zarejestrowany pomyślnie" });
        }
      );
    } catch (hashErr) {
      console.error(hashErr);
      return res.status(500).json({ message: "Błąd przy hashowaniu hasła" });
    }
  });
});

// Logowanie
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Brak danych logowania (email, password)" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Błąd odczytu z bazy" });
    }
    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(401)
          .json({ message: "Nieprawidłowy email lub hasło" });
      }

      // Generowanie tokenów (bez roli)
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      refreshTokens.push(refreshToken);

      // Zwracamy także userId
      return res.json({
        message: "Zalogowano pomyślnie",
        userId: user.id,
        accessToken,
        refreshToken,
      });
    } catch (compareErr) {
      console.error(compareErr);
      return res.status(500).json({ message: "Błąd w trakcie logowania" });
    }
  });
});

// Odświeżanie tokenu
app.post("/token", (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(401).json({ message: "Brak tokenu odświeżającego" });
  if (!refreshTokens.includes(token))
    return res.status(403).json({ message: "Niepoprawny refresh token" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Refresh token wygasł lub jest niepoprawny" });
    // decoded = { userId, iat, exp }
    const newAccessToken = generateAccessToken(decoded.userId);
    return res.json({ accessToken: newAccessToken });
  });
});

// Wylogowanie
app.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  return res.json({ message: "Wylogowano pomyślnie" });
});

// Endpoint: profil użytkownika
app.get("/profile", authenticateToken, (req, res) => {
  // req.user = { userId, iat, exp }
  db.get(
    "SELECT id, firstName, lastName, email, caloriesGoal FROM users WHERE id = ?",
    [req.user.userId],
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Błąd zapytania" });
      }
      if (!user) {
        return res.status(404).json({ message: "Nie znaleziono użytkownika" });
      }
      res.json({ profile: user });
    }
  );
});

// ======================== ENDPOINTY POSIŁKÓW ========================

/**
 * GET /api/meals
 * Zwraca listę posiłków wg filtrów (userID, date, mealName).
 * Wywoływane z frontu np. axios.get('/api/meals', { params: { userID, date, mealName }})
 */
app.get("/api/meals", authenticateToken, (req, res) => {
  const { userID, date, mealName } = req.query;
  // Walidacja minimalna
  if (!userID || !date || !mealName) {
    return res
      .status(400)
      .json({ message: "Brak wymaganych parametrów: userID, date, mealName" });
  }

  // Upewniamy się, że user może pobrać TYLKO swoje dane
  if (parseInt(userID) !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "Brak uprawnień do przeglądania cudzych posiłków" });
  }

  const sql = `
    SELECT * 
    FROM mealsHistory
    WHERE userID = ? AND date LIKE ? AND mealName = ?
    ORDER BY id DESC
  `;
  // "date LIKE ?" pozwala nam złapać dzień, jeśli date jest w formacie YYYY-MM-DD (lub
  // możesz użyć = jeśli data jest zapisana w bazie w tym samym formacie).

  db.all(sql, [userID, `${date}%`, mealName], (err, rows) => {
    if (err) {
      console.error("Błąd pobierania posiłków:", err);
      return res
        .status(500)
        .json({ message: "Błąd podczas pobierania posiłków" });
    }
    res.json(rows);
  });
});

/**
 * POST /api/meals
 * Dodaje nowy posiłek. W body np.:
 * {
 *   "userID": 1,
 *   "date": "2025-01-29T10:00:00.000Z",
 *   "mealName": "Śniadanie",
 *   "productName": "Bułka",
 *   "grams": 100,
 *   "calories": "250.00",
 *   "proteins": "8.00",
 *   "carbs": "40.00",
 *   "fats": "2.00"
 * }
 */
app.post("/api/meals", authenticateToken, (req, res) => {
  const {
    userID,
    date,
    mealName,
    productName,
    grams,
    calories,
    proteins,
    carbs,
    fats,
  } = req.body;

  // Upewnijmy się, że userID = req.user.userId
  if (userID !== req.user.userId) {
    return res.status(403).json({
      message: "Brak uprawnień do dodawania posiłków innym użytkownikom",
    });
  }

  // W bazie możemy zapisać date np. jako YYYY-MM-DD (wytnij z toISOString) albo oryginalny string
  // Dla prostoty weźmy substring(0,10) z daty
  const dateOnly = date.substring(0, 10);

  const sql = `
    INSERT INTO mealsHistory 
    (userID, date, mealName, productName, grams, calories, proteins, carbs, fats)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [
      userID,
      dateOnly,
      mealName,
      productName,
      grams,
      calories,
      proteins,
      carbs,
      fats,
    ],
    function (err) {
      if (err) {
        console.error("Błąd dodawania posiłku:", err);
        return res
          .status(500)
          .json({ message: "Błąd podczas dodawania posiłku" });
      }
      return res.status(201).json({
        message: "Posiłek dodany pomyślnie",
        mealID: this.lastID,
      });
    }
  );
});

/**
 * DELETE /api/meals/:id
 * Usuwa posiłek o danym id (o ile należy do zalogowanego użytkownika).
 */
app.delete("/api/meals/:id", authenticateToken, (req, res) => {
  const mealId = req.params.id;

  // Najpierw pobieramy rekord, by sprawdzić, czy user ma do niego dostęp
  db.get(
    "SELECT userID FROM mealsHistory WHERE id = ?",
    [mealId],
    (err, row) => {
      if (err) {
        console.error("Błąd wyszukiwania posiłku:", err);
        return res
          .status(500)
          .json({ message: "Błąd bazy przy usuwaniu posiłku" });
      }
      if (!row) {
        return res
          .status(404)
          .json({ message: "Nie znaleziono posiłku o podanym ID" });
      }
      if (row.userID !== req.user.userId) {
        return res
          .status(403)
          .json({ message: "Brak uprawnień do usuwania cudzego posiłku" });
      }

      // Skoro userID się zgadza, to usuwamy:
      db.run(
        "DELETE FROM mealsHistory WHERE id = ?",
        [mealId],
        function (deleteErr) {
          if (deleteErr) {
            console.error("Błąd usuwania posiłku:", deleteErr);
            return res
              .status(500)
              .json({ message: "Błąd bazy przy usuwaniu posiłku" });
          }
          return res.json({ message: "Posiłek usunięty pomyślnie" });
        }
      );
    }
  );
});

// ======================== ENDPOINTY PRODUKTÓW ========================

/**
 * GET /api/products
 * Zwraca pełną listę produktów żywieniowych wraz z makro żywieniowymi.
 * Wywoływane z frontu np. axios.get('/api/products')
 */
app.get("/api/products", authenticateToken, (req, res) => {
  const sql = `
    SELECT * 
    FROM products
    ORDER BY id DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error("Błąd pobierania posiłków:", err);
      return res
        .status(500)
        .json({ message: "Błąd podczas pobierania posiłków" });
    }
    res.json(rows);
  });
});

// =========================== Aktualizacja celu kalorycznego ===========================
app.put("/api/users/calories-goal", authenticateToken, (req, res) => {
  const { caloriesGoal } = req.body;

  if (!caloriesGoal || isNaN(caloriesGoal)) {
    return res
      .status(400)
      .json({ message: "Niepoprawna wartość celu kalorycznego" });
  }

  const sql = `
    UPDATE users 
    SET caloriesGoal = ? 
    WHERE id = ?
  `;

  db.run(sql, [caloriesGoal, req.user.userId], function (err) {
    if (err) {
      console.error("Błąd aktualizacji celu kalorycznego:", err);
      return res
        .status(500)
        .json({ message: "Błąd podczas aktualizacji celu" });
    }

    return res.json({ message: "Cel kaloryczny zapisany pomyślnie" });
  });
});

// ====================== START SERWERA ======================
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});

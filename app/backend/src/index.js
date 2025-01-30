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

const db = new sqlite3.Database(dbFile, async (err) => {
  if (err) {
    console.error("Błąd połączenia z bazą SQLite:", err);
    process.exit(1);
  }
  console.log("Połączono z bazą SQLite.");

  const RESET_USERS = true; // <= zmien na false, jeżeli nie chcesz resetować użytkowników
  if (RESET_USERS) {
    // Resetowanie tabeli users
    db.serialize(() => {
      db.run("DELETE FROM users", (err) => {
        if (err) {
          console.error("Błąd czyszczenia tabeli users:", err);
        } else {
          console.log("Tabela users została wyczyszczona.");
          db.run("DELETE FROM sqlite_sequence WHERE name='users'", (err) => {
            if (err) {
              console.error("Błąd resetowania ID users:", err);
            } else {
              console.log("Autoinkrementacja ID users zresetowana.");
            }
          });
        }
      });
    });

    // Tworzenie tabeli "users"
    db.run(
      `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    caloriesGoal INTEGER NOT NULL DEFAULT 2000
  )
  `,
      async (err) => {
        if (err) {
          console.error("Błąd tworzenia tabeli users:", err);
          return;
        }
        console.log('Tabela "users" została utworzona.');

        // Wczytanie danych z pliku JSON
        const usersData = JSON.parse(
          fs.readFileSync("./setupData/users.json", "utf-8")
        );

        // Sprawdzenie, czy tabela jest pusta
        db.get("SELECT COUNT(*) AS count FROM users", async (err, row) => {
          if (err) {
            console.error("Błąd sprawdzania tabeli users:", err);
            return;
          }

          if (row.count === 0) {
            console.log("Tabela 'users' jest pusta. Wstawianie danych...");

            const insertStmt = db.prepare(`
          INSERT INTO users (firstName, lastName, email, password, role, caloriesGoal)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

            try {
              // Hashowanie haseł dla wszystkich użytkowników
              const hashedUsersData = await Promise.all(
                usersData.map(async (user) => ({
                  ...user,
                  password: await bcrypt.hash(user.password, 10), // Hashowanie hasła
                }))
              );

              db.serialize(() => {
                hashedUsersData.forEach((user, index) => {
                  insertStmt.run(
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.password, // Teraz już zahashowane hasło
                    user.role || "user",
                    user.caloriesGoal || 2000,
                    (err) => {
                      if (err) {
                        console.error(
                          `Błąd wstawiania użytkownika ${user.email}:`,
                          err
                        );
                      }

                      // Jeśli to ostatni użytkownik, pobierz wszystkie rekordy
                      if (index === hashedUsersData.length - 1) {
                        insertStmt.finalize(() => {
                          console.log(
                            "Dane zostały pomyślnie dodane do tabeli 'users'."
                          );

                          // Pobierz wszystkie rekordy z tabeli "users"
                          db.all("SELECT * FROM users", [], (err, rows) => {
                            if (err) {
                              console.error("Błąd zapytania:", err.message);
                            } else {
                              console.log("Dane z tabeli users:", rows);
                            }
                          });
                        });
                      }
                    }
                  );
                });
              });
            } catch (hashErr) {
              console.error("Błąd hashowania haseł:", hashErr);
            }
          } else {
            console.log(
              "Tabela 'users' już zawiera dane. Pominięto wstawianie."
            );

            // Pobierz dane od razu, jeśli tabela nie była pusta
            db.all("SELECT * FROM users", [], (err, rows) => {
              if (err) {
                console.error("Błąd zapytania:", err.message);
              } else {
                console.log("Dane z tabeli users:", rows);
              }
            });
          }
        });
      }
    );
  } else {
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
          console.log(
            'Tabela "users" już istniała (lub właśnie została zainicjowana jako pusta).'
          );
        }
      }
    );

    // Pobierz wszystkie rekordy z tabeli "users"
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        console.error("Błąd zapytania:", err.message);
      } else {
        console.log("Dane z tabeli users:", rows);
      }
    });
  }

  // try {
  //   // Dodajemy Admina
  //   const hashedPassword = await bcrypt.hash('qwerty123', 10); // password
  //   db.run(
  //       `
  //       DELETE FROM users WHERE email = 'qwerty@123.pl';
  //     `
  //   );
  //   db.run(
  //       `
  //       INSERT INTO users (firstName, lastName, email, password, role)
  //       VALUES (?, ?, ?, ?, 'admin')
  //     `, ["abc", "abc", "qwerty@123.pl", hashedPassword]
  //   );
  // } catch (hashErr) {
  //   console.error(hashErr);
  // }

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

  // utworzenie tabeli przepisów
  db.run(
    `
  CREATE TABLE IF NOT EXISTS recipes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT NOT NULL,
          preparation TEXT NOT NULL,
          grams REAL NOT NULL,
          calories REAL NOT NULL,
          proteins REAL NOT NULL,
          carbohydrates REAL NOT NULL,
          fats REAL NOT NULL,
          userID INTEGER NULL,
          FOREIGN KEY (userID)
              REFERENCES users (id) 
  )
  `,
    (err) => {
      if (err) {
        console.error("Błąd tworzenia tabeli recipes:", err);
      } else {
        console.log(
          'Tabela "recipes" została zainicjowana (lub już istniała).'
        );

        // Wczytanie danych z pliku JSON
        const recipesData = JSON.parse(
          fs.readFileSync("./setupData/recipes.json", "utf-8")
        );

        // Sprawdzenie, czy tabela recipes jest pusta
        db.get("SELECT COUNT(*) AS count FROM recipes", (err, row) => {
          if (err) {
            console.error("Błąd sprawdzania tabeli recipes:", err);
            return;
          }

          if (row.count === 0) {
            console.log("Tabela 'recipes' jest pusta. Wstawianie danych...");

            const insertStmt = db.prepare(`
              INSERT INTO recipes (description, preparation, grams, calories, proteins, carbohydrates, fats, userID)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);

            db.serialize(() => {
              recipesData.forEach((recipe, index) => {
                insertStmt.run(
                  recipe.description,
                  recipe.preparation,
                  recipe.grams,
                  recipe.calories,
                  recipe.proteins,
                  recipe.carbohydrates,
                  recipe.fats,
                  recipe.userID || null,
                  (err) => {
                    if (err) {
                      console.error(
                        `Błąd wstawiania produktu ${recipe.name}:`,
                        err
                      );
                    } else if (index === recipesData.length - 1) {
                      console.log(
                        "Dane zostały pomyślnie dodane do tabeli 'recipes'."
                      );
                    }
                  }
                );
              });

              insertStmt.finalize();
            });
          } else {
            console.log(
              "Tabela 'recipes' już zawiera dane. Pominięto wstawianie."
            );
          }
        });
      }
    }
  );

  // utworzenie tabeli recipesIngredients
  db.run(
    `
  CREATE TABLE IF NOT EXISTS recipesIngredients (
          recipeID INTEGER,
          productID INTEGER,
          grams REAL NOT NULL,
          PRIMARY KEY (recipeID, productID),
          FOREIGN KEY (recipeID)
              REFERENCES recipes (id),
          FOREIGN KEY (productID)
              REFERENCES products (id) 
  )
  `,
    (err) => {
      if (err) {
        console.error("Błąd tworzenia tabeli recipesIngredients:", err);
      } else {
        console.log(
          'Tabela "recipesIngredients" została zainicjowana (lub już istniała).'
        );

        // Wczytanie danych z pliku JSON
        const recipesIngredientsData = JSON.parse(
          fs.readFileSync("./setupData/recipesIngredients.json", "utf-8")
        );

        // Sprawdzenie, czy recipesIngredients jest pusta
        db.get(
          "SELECT COUNT(*) AS count FROM recipesIngredients",
          (err, row) => {
            if (err) {
              console.error("Błąd sprawdzania tabeli recipesIngredients:", err);
              return;
            }

            if (row.count === 0) {
              console.log(
                "Tabela 'recipesIngredients' jest pusta. Wstawianie danych..."
              );

              const insertStmt = db.prepare(`
              INSERT INTO recipesIngredients (recipeID, productID, grams)
              VALUES (?, ?, ?)
          `);

              db.serialize(() => {
                recipesIngredientsData.forEach((recipesIngredient, index) => {
                  insertStmt.run(
                    recipesIngredient.recipeID,
                    recipesIngredient.productID,
                    recipesIngredient.grams,
                    (err) => {
                      if (err) {
                        console.error(
                          `Błąd wstawiania składniku przepisu ${recipesIngredient}:`,
                          err
                        );
                      } else if (index === recipesIngredientsData.length - 1) {
                        console.log(
                          "Dane zostały pomyślnie dodane do tabeli 'recipesIngredients'."
                        );
                      }
                    }
                  );
                });

                insertStmt.finalize();
              });
            } else {
              console.log(
                "Tabela 'recipesIngredients' już zawiera dane. Pominięto wstawianie."
              );
            }
          }
        );
      }
    }
  );

  // utworzenie tabeli recipesOpinions
  db.run(
    `
  CREATE TABLE IF NOT EXISTS recipesOpinions (
          recipeID INTEGER,
          userID INTEGER,
          opinion TEXT NOT NULL,
          PRIMARY KEY (recipeID, userID),
          FOREIGN KEY (recipeID)
              REFERENCES recipes (id),
          FOREIGN KEY (userID)
              REFERENCES users (id) 
  )
  `,
    (err) => {
      if (err) {
        console.error("Błąd tworzenia tabeli recipesOpinions:", err);
      } else {
        console.log(
          'Tabela "recipesOpinions" została zainicjowana (lub już istniała).'
        );

        // Wczytanie danych z pliku JSON
        const recipesOpinionsData = JSON.parse(
          fs.readFileSync("./setupData/recipesOpinions.json", "utf-8")
        );

        // Sprawdzenie, czy recipesOpinions jest pusta
        db.get("SELECT COUNT(*) AS count FROM recipesOpinions", (err, row) => {
          if (err) {
            console.error("Błąd sprawdzania tabeli recipesOpinions:", err);
            return;
          }

          if (row.count === 0) {
            console.log(
              "Tabela 'recipesOpinions' jest pusta. Wstawianie danych..."
            );

            const insertStmt = db.prepare(`
              INSERT INTO recipesOpinions (recipeID, userID, opinion)
              VALUES (?, ?, ?)
          `);

            db.serialize(() => {
              recipesOpinionsData.forEach((recipesOpinion, index) => {
                insertStmt.run(
                  recipesOpinion.recipeID,
                  recipesOpinion.userID,
                  recipesOpinion.opinion,
                  (err) => {
                    if (err) {
                      console.error(
                        `Błąd wstawiania opinii o przepisie ${recipesOpinion}:`,
                        err
                      );
                    } else if (index === recipesOpinionsData.length - 1) {
                      console.log(
                        "Dane zostały pomyślnie dodane do tabeli 'recipesOpinions'."
                      );
                    }
                  }
                );
              });

              insertStmt.finalize();
            });
          } else {
            console.log(
              "Tabela 'recipesOpinions' już zawiera dane. Pominięto wstawianie."
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
const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

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

      // Zwracamy także rolę
      return res.json({
        message: "Zalogowano pomyślnie",
        userId: user.id,
        accessToken,
        refreshToken,
        role: user.role, // Dodaj pole z rolą
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

// Dodaj nowy middleware do sprawdzania roli
const verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user.role !== "admin") return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Użyj middleware dla endpointów admina
app.get("/admin/data", verifyAdmin, (req, res) => {
  // Logika specyficzna dla admina
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

// ======================== ENDPOINTY PRZEPISÓW ========================

/**
 * GET /api/recipes
 * Zwraca listę przepisów wg filtrów (userID).
 * Wywoływane z frontu np. axios.get('/api/recipes', { params: { userID }})
 */
app.get("/api/recipes", authenticateToken, (req, res) => {
  const { userID } = req.query;

  // Walidacja minimalna
  if (!userID) {
    return res
      .status(400)
      .json({ message: "Brak wymaganego parametru: userID" });
  }

  // Upewniamy się, że user może pobrać TYLKO swoje dane
  if (parseInt(userID) !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "Brak uprawnień do przeglądania cudzych przepisów" });
  }

  const sql = `
    SELECT * 
    FROM recipes
    WHERE userID = ?
    ORDER BY id DESC
  `;

  db.all(sql, [userID], (err, rows) => {
    if (err) {
      console.error("Błąd pobierania przepisów:", err);
      return res
        .status(500)
        .json({ message: "Błąd podczas pobierania przepisów" });
    }
    res.json(rows);
  });
});

/**
 * GET /recipes/:id_użytkownika
 * Zwraca wszystkie przepisy stworzone przez użytkownika.
 */
app.get("/recipes/:id_użytkownika", authenticateToken, (req, res) => {
  const { id_użytkownika } = req.params;

  // Upewniamy się, że użytkownik może pobrać TYLKO swoje przepisy
  if (parseInt(id_użytkownika) !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "Brak uprawnień do przeglądania cudzych przepisów" });
  }

  const sql = `
    SELECT * 
    FROM recipes
    WHERE userID = ?
    ORDER BY id DESC
  `;

  db.all(sql, [id_użytkownika], (err, rows) => {
    if (err) {
      console.error("Błąd pobierania przepisów:", err);
      return res
        .status(500)
        .json({ message: "Błąd podczas pobierania przepisów" });
    }
    res.json(rows);
  });
});

/**
 * GET /recipes
 * Zwraca wspólne przepisy (bez przypisanego userID).
 */
app.get("/recipes", authenticateToken, (req, res) => {
  const sql = `
    SELECT * 
    FROM recipes
    WHERE userID IS NULL
    ORDER BY id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Błąd pobierania wspólnych przepisów:", err);
      return res
        .status(500)
        .json({ message: "Błąd podczas pobierania wspólnych przepisów" });
    }
    res.json(rows);
  });
});

/**
 * POST /api/recipes
 * Dodaje nowy przepis. W body np.:
 * {
 *   "description": "Przepis na sałatkę",
 *   "preparation": "Wymieszaj składniki...",
 *   "grams": 500,
 *   "calories": 300,
 *   "proteins": 20,
 *   "carbohydrates": 30,
 *   "fats": 10,
 *   "userID": 1
 * }
 */
app.post("/api/recipes", authenticateToken, (req, res) => {
  const {
    description,
    preparation,
    grams,
    calories,
    proteins,
    carbohydrates,
    fats,
    userID,
  } = req.body;

  // Upewnijmy się, że userID = req.user.userId
  if (userID !== req.user.userId) {
    return res.status(403).json({
      message: "Brak uprawnień do dodawania przepisów innym użytkownikom",
    });
  }

  const sql = `
    INSERT INTO recipes 
    (description, preparation, grams, calories, proteins, carbohydrates, fats, userID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      description,
      preparation,
      grams,
      calories,
      proteins,
      carbohydrates,
      fats,
      userID,
    ],
    function (err) {
      if (err) {
        console.error("Błąd dodawania przepisu:", err);
        return res
          .status(500)
          .json({ message: "Błąd podczas dodawania przepisu" });
      }
      return res.status(201).json({
        message: "Przepis dodany pomyślnie",
        recipeID: this.lastID,
      });
    }
  );
});

/**
 * DELETE /api/recipes/:id
 * Usuwa przepis o danym id (o ile należy do zalogowanego użytkownika).
 */
app.delete("/api/recipes/:id", authenticateToken, (req, res) => {
  const recipeId = req.params.id;

  // Najpierw pobieramy rekord, by sprawdzić, czy user ma do niego dostęp
  db.get("SELECT userID FROM recipes WHERE id = ?", [recipeId], (err, row) => {
    if (err) {
      console.error("Błąd wyszukiwania przepisu:", err);
      return res
        .status(500)
        .json({ message: "Błąd bazy przy usuwaniu przepisu" });
    }
    if (!row) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono przepisu o podanym ID" });
    }
    if (row.userID !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Brak uprawnień do usuwania cudzego przepisu" });
    }

    // Skoro userID się zgadza, to usuwamy:
    db.run(
      "DELETE FROM recipes WHERE id = ?",
      [recipeId],
      function (deleteErr) {
        if (deleteErr) {
          console.error("Błąd usuwania przepisu:", deleteErr);
          return res
            .status(500)
            .json({ message: "Błąd bazy przy usuwaniu przepisu" });
        }
        return res.json({ message: "Przepis usunięty pomyślnie" });
      }
    );
  });
});

// ====================== SKŁADNIKI PRZEPISÓW ======================

/**
 * POST /api/recipes/:id_przepisu/:id_produktu
 * Dodaje składnik do przepisu. W body np.:
 * {
 *   "grams": 100
 * }
 */
app.post(
  "/api/recipes/:id_przepisu/:id_produktu",
  authenticateToken,
  (req, res) => {
    const { id_przepisu, id_produktu } = req.params;
    const { grams } = req.body;

    // Sprawdź, czy przepis należy do zalogowanego użytkownika
    db.get(
      "SELECT userID FROM recipes WHERE id = ?",
      [id_przepisu],
      (err, row) => {
        if (err) {
          console.error("Błąd wyszukiwania przepisu:", err);
          return res
            .status(500)
            .json({ message: "Błąd bazy przy dodawaniu składnika" });
        }
        if (!row) {
          return res
            .status(404)
            .json({ message: "Nie znaleziono przepisu o podanym ID" });
        }
        if (row.userID !== req.user.userId) {
          return res.status(403).json({
            message: "Brak uprawnień do modyfikowania cudzego przepisu",
          });
        }

        // Dodaj składnik
        const sql = `
      INSERT INTO recipesIngredients 
      (recipeID, productID, grams)
      VALUES (?, ?, ?)
    `;

        db.run(sql, [id_przepisu, id_produktu, grams], function (err) {
          if (err) {
            console.error("Błąd dodawania składnika:", err);
            return res
              .status(500)
              .json({ message: "Błąd podczas dodawania składnika" });
          }
          return res.status(201).json({ message: "Składnik dodany pomyślnie" });
        });
      }
    );
  }
);

/**
 * DELETE /api/recipes/:id_przepisu/:id_produktu
 * Usuwa składnik z przepisu.
 */
app.delete(
  "/api/recipes/:id_przepisu/:id_produktu",
  authenticateToken,
  (req, res) => {
    const { id_przepisu, id_produktu } = req.params;

    // Sprawdź, czy przepis należy do zalogowanego użytkownika
    db.get(
      "SELECT userID FROM recipes WHERE id = ?",
      [id_przepisu],
      (err, row) => {
        if (err) {
          console.error("Błąd wyszukiwania przepisu:", err);
          return res
            .status(500)
            .json({ message: "Błąd bazy przy usuwaniu składnika" });
        }
        if (!row) {
          return res
            .status(404)
            .json({ message: "Nie znaleziono przepisu o podanym ID" });
        }
        if (row.userID !== req.user.userId) {
          return res.status(403).json({
            message: "Brak uprawnień do modyfikowania cudzego przepisu",
          });
        }

        // Usuń składnik
        db.run(
          "DELETE FROM recipesIngredients WHERE recipeID = ? AND productID = ?",
          [id_przepisu, id_produktu],
          function (deleteErr) {
            if (deleteErr) {
              console.error("Błąd usuwania składnika:", deleteErr);
              return res
                .status(500)
                .json({ message: "Błąd bazy przy usuwaniu składnika" });
            }
            return res.json({ message: "Składnik usunięty pomyślnie" });
          }
        );
      }
    );
  }
);

// ====================== OPINIE O PRZEPISACH ======================

/**
 * GET /recipe/opinions/:id_przepisu
 * Zwraca wszystkie opinie dla przepisu.
 */
app.get("/recipe/opinions/:id_przepisu", authenticateToken, (req, res) => {
  const { id_przepisu } = req.params;

  // Sprawdź, czy przepis istnieje
  db.get("SELECT id FROM recipes WHERE id = ?", [id_przepisu], (err, row) => {
    if (err) {
      console.error("Błąd wyszukiwania przepisu:", err);
      return res
        .status(500)
        .json({ message: "Błąd bazy przy pobieraniu opinii" });
    }
    if (!row) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono przepisu o podanym ID" });
    }

    // Pobierz opinie
    const sql = `
      SELECT * 
      FROM recipesOpinions
      WHERE recipeID = ?
      ORDER BY recipeID DESC
    `;

    db.all(sql, [id_przepisu], (err, rows) => {
      if (err) {
        console.error("Błąd pobierania opinii:", err);
        return res
          .status(500)
          .json({ message: "Błąd podczas pobierania opinii" });
      }
      res.json(rows);
    });
  });
});

/**
 * POST /recipe/opinions/:id_przepisu
 * Dodaje opinię do przepisu. W body np.:
 * {
 *   "opinion": "Bardzo smaczne!"
 * }
 */
app.post("/recipe/opinions/:id_przepisu", authenticateToken, (req, res) => {
  const { id_przepisu } = req.params;
  const { opinion } = req.body;
  const userID = req.user.userId;

  // Sprawdź, czy przepis istnieje
  db.get("SELECT id FROM recipes WHERE id = ?", [id_przepisu], (err, row) => {
    if (err) {
      console.error("Błąd wyszukiwania przepisu:", err);
      return res
        .status(500)
        .json({ message: "Błąd bazy przy dodawaniu opinii" });
    }
    if (!row) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono przepisu o podanym ID" });
    }

    // Dodaj opinię
    const sql = `
      INSERT INTO recipesOpinions 
      (recipeID, userID, opinion)
      VALUES (?, ?, ?)
    `;

    db.run(sql, [id_przepisu, userID, opinion], function (err) {
      if (err) {
        console.error("Błąd dodawania opinii:", err);
        return res
          .status(500)
          .json({ message: "Błąd podczas dodawania opinii" });
      }
      return res.status(201).json({ message: "Opinia dodana pomyślnie" });
    });
  });
});

// ======================= ADMIN PAGE ==================================

// PUT - Aktualizacja opinii
app.put("/recipe/opinions/:id_opinii", authenticateToken, (req, res) => {
  const { id_opinii } = req.params;
  const { opinion } = req.body;

  db.run(
    "UPDATE recipesOpinions SET opinion = ? WHERE id = ?",
    [opinion, id_opinii],
    function (err) {
      if (err) {
        console.error("Błąd aktualizacji opinii:", err);
        return res.status(500).json({ message: "Błąd aktualizacji opinii" });
      }
      res.json({ message: "Opinia zaktualizowana pomyślnie" });
    }
  );
});

// DELETE - Usuwanie opinii
app.delete("/recipe/opinions/:id_opinii", authenticateToken, (req, res) => {
  const { id_opinii } = req.params;

  db.run(
    "DELETE FROM recipesOpinions WHERE id = ?",
    [id_opinii],
    function (err) {
      if (err) {
        console.error("Błąd usuwania opinii:", err);
        return res.status(500).json({ message: "Błąd usuwania opinii" });
      }
      res.json({ message: "Opinia usunięta pomyślnie" });
    }
  );
});

// ====================== START SERWERA ======================
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});

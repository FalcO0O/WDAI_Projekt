require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// ====================== KONFIGURACJA BAZY ======================
const db = new sqlite3.Database('mydb.sqlite', (err) => {
    if (err) {
        console.error('Błąd połączenia z bazą SQLite:', err);
        process.exit(1);
    }
    console.log('Połączono z bazą SQLite.');

    // Tworzymy tabelę users, jeśli jeszcze nie istnieje
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `, (err) => {
        if (err) {
            console.error('Błąd tworzenia tabeli users:', err);
        } else {
            console.log('Tabela users gotowa (lub już istniała).');
        }
    });
});

// ================== TABLICA NA REFRESH TOKENY ==================
let refreshTokens = [];

// ================== FUNKCJE POMOCNICZE (JWT) ===================
function generateAccessToken(userId, role) {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('Brak ACCESS_TOKEN_SECRET w pliku .env');
    }
    return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(userId, role) {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('Brak REFRESH_TOKEN_SECRET w pliku .env');
    }
    return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

// Middleware: sprawdzanie poprawności tokenu
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // np. "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Brak tokenu' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
        if (err) return res.status(403).json({ message: 'Token niepoprawny lub wygasł' });
        // userData = { userId, role, iat, exp }
        req.user = userData;
        next();
    });
}

// Middleware: autoryzacja tylko dla admina
function authorizeAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Brak uprawnień (ADMIN)' });
}

// ======================== ENDPOINTY ========================

// Rejestracja
app.post('/register', (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    // Sprawdź czy istnieje już użytkownik o podanym email
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Błąd odczytu z bazy' });
        }
        if (row) {
            return res.status(400).json({ message: 'Użytkownik o tym email już istnieje' });
        }

        // Haszowanie hasła
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            // Wstawiamy rekord do bazy
            db.run(`
        INSERT INTO users (firstName, lastName, email, password, role)
        VALUES (?, ?, ?, ?, ?)
      `,
                [
                    firstName,
                    lastName,
                    email,
                    hashedPassword,
                    role === 'admin' ? 'admin' : 'user'
                ],
                function (insertErr) {
                    if (insertErr) {
                        console.error(insertErr);
                        return res.status(500).json({ message: 'Błąd zapisu do bazy' });
                    }
                    return res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie' });
                });
        } catch (hashErr) {
            console.error(hashErr);
            return res.status(500).json({ message: 'Błąd przy hashowaniu hasła' });
        }
    });
});

// Logowanie
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Brak danych logowania (email, password)' });
    }

    // Szukamy użytkownika w bazie
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Błąd odczytu z bazy' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
        }

        // Sprawdzamy hasło
        try {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
            }

            // Generowanie tokenów
            const accessToken = generateAccessToken(user.id, user.role);
            const refreshToken = generateRefreshToken(user.id, user.role);

            // Dodajemy refreshToken do tablicy (w produkcji raczej do bazy)
            refreshTokens.push(refreshToken);

            return res.json({
                message: 'Zalogowano pomyślnie',
                accessToken,
                refreshToken,
                role: user.role
            });
        } catch (compareErr) {
            console.error(compareErr);
            return res.status(500).json({ message: 'Błąd w trakcie logowania' });
        }
    });
});

// Odświeżanie tokenu
app.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Brak tokenu odświeżającego' });
    if (!refreshTokens.includes(token)) return res.status(403).json({ message: 'Niepoprawny refresh token' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Refresh token wygasł lub jest niepoprawny' });
        // decoded = { userId, role, iat, exp }
        const newAccessToken = generateAccessToken(decoded.userId, decoded.role);
        return res.json({ accessToken: newAccessToken });
    });
});

// Wylogowanie (usunięcie refresh tokenu)
app.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    return res.json({ message: 'Wylogowano pomyślnie' });
});

// Przykładowy endpoint dostępny tylko dla zalogowanych
app.get('/profile', authenticateToken, (req, res) => {
    // req.user = { userId, role, iat, exp }
    db.get('SELECT id, firstName, lastName, email, role FROM users WHERE id = ?', [req.user.userId], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Błąd zapytania' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
        }
        res.json({ profile: user });
    });
});

// Przykładowy endpoint tylko dla admina
app.get('/admin/data', authenticateToken, authorizeAdmin, (req, res) => {
    db.all('SELECT id, firstName, lastName, email, role FROM users', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Błąd zapytania' });
        }
        res.json({ users: rows });
    });
});

// ====================== START SERWERA ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

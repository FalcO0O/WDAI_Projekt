const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Umożliwienie komunikacji z frontem działającym na porcie 3000

const mealsHistoryPath = path.resolve(
  __dirname,
  "src/MealsDB/MealsHistory.json"
);

// Trasa do dodawania nowego rekordu posiłku
app.post("/api/meals", (req, res) => {
  const newRecord = req.body;

  // Logowanie przychodzących danych dla debugowania
  console.log("Otrzymano dane:", newRecord);

  fs.readFile(mealsHistoryPath, "utf8", (err, data) => {
    if (err) {
      console.error("Błąd podczas odczytu pliku:", err);
      return res.status(500).json({ error: "Failed to read file" });
    }

    let meals = [];
    try {
      meals = JSON.parse(data);
    } catch (parseError) {
      console.error("Błąd podczas parsowania JSON:", parseError);
    }

    meals.push(newRecord);

    fs.writeFile(
      mealsHistoryPath,
      JSON.stringify(meals, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Błąd podczas zapisu pliku:", writeErr);
          return res.status(500).json({ error: "Failed to write file" });
        }
        res.status(201).json({ message: "Record added successfully" });
      }
    );
  });
});

// Trasa do usuwania rekordu posiłku
app.delete("/api/meals/:userID/:date/:mealName/:productName", (req, res) => {
  const { userID, date, mealName, productName } = req.params;

  fs.readFile(mealsHistoryPath, "utf8", (err, data) => {
    if (err) {
      console.error("Błąd podczas odczytu pliku:", err);
      return res.status(500).json({ error: "Failed to read file" });
    }

    let meals = [];
    try {
      meals = JSON.parse(data);
    } catch (parseError) {
      console.error("Błąd podczas parsowania JSON:", parseError);
      return res.status(500).json({ error: "Failed to parse JSON" });
    }

    // Filtrujemy posiłki, aby usunąć tylko ten, który pasuje do wszystkich parametrów
    const updatedMeals = meals.filter(
      (meal) =>
        !(
          meal.userID == userID &&
          meal.date === date &&
          meal.mealName === mealName &&
          meal.productName === productName
        )
    );

    // Jeśli nie znaleziono rekordu do usunięcia
    if (updatedMeals.length === meals.length) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Zapisz zaktualizowaną listę posiłków
    fs.writeFile(
      mealsHistoryPath,
      JSON.stringify(updatedMeals, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Błąd podczas zapisu pliku:", writeErr);
          return res.status(500).json({ error: "Failed to write file" });
        }
        res.status(200).json({ message: "Record deleted successfully" });
      }
    );
  });
});

const PORT = 5000; //process.env.PORT ||
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

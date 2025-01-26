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

const PORT = 5000; //process.env.PORT ||
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

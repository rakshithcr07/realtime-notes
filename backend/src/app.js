const authRoutes = require("./routes/auth.routes");
const notesRoutes = require("./routes/notes.routes");
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

module.exports = app;
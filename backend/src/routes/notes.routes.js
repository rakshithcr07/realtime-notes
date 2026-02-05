const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { title, content, owner_id } = req.body;

  const note = await pool.query(
    "INSERT INTO notes(title,content,owner_id) VALUES($1,$2,$3) RETURNING *",
    [title, content, owner_id]
  );

  await pool.query(
    "INSERT INTO activity_logs(action,user_id,note_id) VALUES($1,$2,$3)",
    ["create", owner_id, note.rows[0].id]
  );

  res.json(note.rows[0]);
});
router.get("/:userId", async (req, res) => {
  const notes = await pool.query(
    "SELECT * FROM notes WHERE owner_id=$1",
    [req.params.userId]
  );

  res.json(notes.rows);
});

router.put("/:id", async (req, res) => {
  const { title, content } = req.body;

  const note = await pool.query(
    "UPDATE notes SET title=$1, content=$2 WHERE id=$3 RETURNING *",
    [title, content, req.params.id]
  );

  res.json(note.rows[0]);
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM notes WHERE id=$1", [req.params.id]);
  res.send("Deleted");
});

router.get("/search/:q", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE title ILIKE $1 OR content ILIKE $1",
    [`%${req.params.q}%`]
  );

  res.json(result.rows);
});

module.exports = router;
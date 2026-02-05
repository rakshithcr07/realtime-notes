import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = "https://realtime-notes-z8i2.onrender.com";
const socket = io(API);

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadNotes();

    socket.emit("join-note", "1");

    socket.on("note-updated", data => setText(data));
  }, []);

  const loadNotes = async () => {
    const res = await axios.get(`${API}/api/notes/1`);
    setNotes(res.data);
  };

  const createNote = async () => {
    await axios.post(`${API}/api/notes`, {
      title: `Note ${notes.length + 1}`,
      content: "",
      owner_id: 1
    });
    loadNotes();
  };

  const handleChange = e => {
    setText(e.target.value);
    socket.emit("edit-note", { noteId: "1", content: e.target.value });
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        📝 Realtime Notes
      </header>

      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <button style={styles.createBtn} onClick={createNote}>
            + New Note
          </button>

          {notes.map(n => (
            <div key={n.id} style={styles.noteItem}>
              {n.title}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div style={styles.editor}>
          <h3>Live Editor</h3>

          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Start typing..."
            style={styles.textarea}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f4f6f8",
    minHeight: "100vh"
  },
  header: {
    padding: "15px",
    background: "#1f2937",
    color: "white",
    fontSize: "20px",
    textAlign: "center"
  },
  container: {
    display: "flex",
    padding: "20px",
    gap: "20px"
  },
  sidebar: {
    width: "250px",
    background: "white",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  createBtn: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  noteItem: {
    padding: "8px",
    borderBottom: "1px solid #eee"
  },
  editor: {
    flex: 1,
    background: "white",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  textarea: {
    width: "100%",
    height: "300px",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "none"
  }
};

export default App;

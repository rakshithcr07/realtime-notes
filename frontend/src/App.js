import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = "https://realtime-notes-z8i2.onrender.com";
const socket = io(API);




function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    axios.get(`${API}/api/notes/1`).then(res => setNotes(res.data));

    socket.emit("join-note", "1");

    socket.on("note-updated", data => setText(data));
  }, []);

  const createNote = async () => {
    await axios.post(`${API}/api/notes`, {
      title: "New Note",
      content: "",
      owner_id: 1
    });
  };

  const handleChange = e => {
    setText(e.target.value);
    socket.emit("edit-note", { noteId: "1", content: e.target.value });
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={createNote}>Create Note</button>

      <h3>Notes:</h3>
      {notes.map(n => (
        <div key={n.id}>{n.title}</div>
      ))}

      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Type here..."
        style={{ width: "100%", height: 200 }}
      />
    </div>
  );
}

export default App;

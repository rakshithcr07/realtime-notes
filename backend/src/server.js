require("dotenv").config({ path: "./.env" });

const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-note", (noteId) => {
    socket.join(noteId);
  });

  socket.on("edit-note", ({ noteId, content }) => {
    socket.to(noteId).emit("note-updated", content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log("Server running on", PORT);
});
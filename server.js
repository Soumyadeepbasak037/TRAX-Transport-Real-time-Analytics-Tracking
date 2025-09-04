import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());

// // Middleware to modify the request object and attach the io property to it,
// // in order to make it available to all routes. (Optional: move to separate file later)
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// Routes
// import authRoutes from "../e_com_pg/routes/authroutes.js";
// app.use("/api/auth", authRoutes);

import driverHandlers from "./sockets/driverSocket";
import passengerHandlers from "./sockets/passengerSocket";

io.on("connection", (socket) => {
  console.log(`New Connection: ${socket.id}`);

  driverHandlers(io, socket);
  passengerHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

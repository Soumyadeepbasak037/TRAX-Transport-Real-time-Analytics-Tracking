import express from "express";
import cors from "cors";
import fs from "fs";
import https from "https";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import routeManager from "./routes/routesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import driverSocketHandler from "./sockets/driverSocket.js";
import passengerSocketHandler from "./sockets/passengerSocket.js";

const SECRET_KEY = "hehe";

const app = express();

// ✅ Load SSL certs
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// Create HTTPS server
const server = https.createServer(options, app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());
app.use(cors());

// --- Socket auth middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));

    const payload = jwt.verify(token, SECRET_KEY);
    socket.role = payload.role;
    socket.userId = payload.id;
    if (payload.vehicleId != null) {
      socket.vehicleId = payload.vehicleId;
    }
    next();
  } catch (err) {
    next(new Error("Auth failed"));
  }
});

io.on("connection", (socket) => {
  console.log("New socket:", socket.id, "Role:", socket.role);

  if (socket.role === "driver") {
    driverSocketHandler(io, socket);
  }

  if (socket.role === "passenger") {
    passengerSocketHandler(io, socket);
  }
});

app.get("/", (req, res) => {
  res.send("Server running with HTTPS 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/RouteManagement", routeManager);

server.listen(3000, () => {
  console.log("🚀 HTTPS Server listening on https://localhost:3000");
});

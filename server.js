import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import routeManager from "./routes/routesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import driverSocketHandler from "./sockets/driverSocket.js";
import passengerSocketHandler from "./sockets/passengerSocket.js";
const SECRET_KEY = "hehe";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.static("public")); // put your HTML files in ./public
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

// import driverHandler from "./sockets/driverSocket";
// import passengerHandler from "./sockets/passengerSocket";

//io middleware
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
    driverSocketHandler(io, socket); // handles trip start & location updates
  }

  if (socket.role === "passenger") {
    passengerSocketHandler(io, socket); // handles joining vehicle rooms
  }
});

app.get("/", (req, res) => {
  res.send("Server running");
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/RouteManagement", routeManager);

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

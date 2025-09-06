import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const SECRET_KEY = "hehe";

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

// import driverHandler from "./sockets/driverSocket";
// import passengerHandler from "./sockets/passengerSocket";

//io middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("No token"));
    }
    const payload = jwt.verify(token, SECRET_KEY);

    socket.role = payload.role;
    socket.userID = payload.id;
    if (payload.vehicleID != null) {
      socket.vehicleID = payload.vehicleID;
    }
    next();
  } catch (err) {
    next(new Error("Auth failed"));
  }
});

io.on("connection", (socket) => {
  console.log("New socket:", socket.id, "Role:", socket.role);

  if (socket.role === "driver") {
    //    driverHandlers(io, socket);
    socket.join(socket.vehicleId);
    console.log(`Driver ${socket.userId} joined vehicle ${socket.vehicleId}`);
  }

  if (socket.role === "passenger") {
    // get vegicle id that passenger wants to join from frontend while joining
    //    passengerHandlers(io, socket);
    socket.on("joinVehicle", ({ vehicleId }) => {
      //expose api endpoint to get_vehicleID .) querydb -> send ID
      socket.join(vehicleId);
      console.log(`Passenger ${socket.userId} joined vehicle ${vehicleId}`);
    });
  }

  socket.on("driverLocation", ({ lat, lng }) => {
    if (socket.role !== "driver") return;
    io.to(socket.vehicleId).emit("locationUpdate", { lat, lng });
  });
});

app.get("/", (req, res) => {
  res.send("Server running");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

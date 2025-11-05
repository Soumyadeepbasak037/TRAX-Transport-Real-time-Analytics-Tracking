import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import routeManager from "./routes/routesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import essentialRoutes from "./routes/frontendPreRequisiteRoutes.js";
import driverSocketHandler from "./sockets/driverSocket.js";
import passengerSocketHandler from "./sockets/passengerSocket.js";
import suggestionManager from "./routes/suggestionroutes.js";
import dotenv from "dotenv";
dotenv.config();
// console.log(process.env);
const SECRET_KEY = "hehe";

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.static("public"));
app.use(express.json());

// // Middleware to modify the request object and attach the io property to it,
// // in order to make it available to all routes.
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

//add the token generated after login to the socket to identify the role and redirect the socket to use the correct handler ie. if the token.role is passenger use the passengerhandler which only handles the joining of sockets and reveibing data and if the role is driver then use driver handler to open new socket rooms with vehicle-id uid and transmit locationupdate events along with necessary database logging ops
//this is the only function of the this io.use shit -> it helps identify the kind of sockethandler
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
  if (socket.role === "admin") {
    // admin also joins the vehicle room, doesnt transmit anything
    passengerSocketHandler(io, socket);
  }
});

app.get("/", (req, res) => {
  res.send("Server running");
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/routeManagement", routeManager);
app.use("/api/suggestion", suggestionManager);
app.use("/api/essentials", essentialRoutes);
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

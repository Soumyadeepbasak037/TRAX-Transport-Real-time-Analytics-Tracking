import db from "../config/db.js";

const driverHandler = async (io, socket) => {
  socket.join(socket.vehicleId);
  console.log(`Driver ${socket.userId} joined vehicle ${socket.vehicleId}`);

  vehicleNumberQuery = `SELECT vehicle_number, from vehicles where vehicle_id $1`;

  result = await db.query(vehicleNumberQuery, [socket.vehicleId]);
};

export default driverHandler;

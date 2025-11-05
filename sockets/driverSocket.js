// import db from "../config/db.js";

// const driverHandler = async (io, socket) => {
//   if (!socket.vehicleId || !socket.userId) {
//     console.error("Missing vehicleId or userId on socket");
//     return;
//   }

//   socket.join(socket.vehicleId);
//   console.log(`Driver ${socket.userId} joined vehicle ${socket.vehicleId}`);

//   // Get vehicle number
//   const vehicleNumberQuery = `SELECT vehicle_number FROM vehicles WHERE vehicle_id = $1`;
//   const vehicleResult = await db.query(vehicleNumberQuery, [socket.vehicleId]);
//   if (vehicleResult.rows.length === 0) {
//     console.error("Vehicle not found");
//     return;
//   }
//   const vehicle_number = vehicleResult.rows[0].vehicle_number;

//   // Get route_id for this vehicle_number
//   const routeQuery = `SELECT route_id FROM routes WHERE vehicle_number = $1`;
//   const routeResult = await db.query(routeQuery, [vehicle_number]);
//   if (routeResult.rows.length === 0) {
//     console.error("No route found for this vehicle");
//     return;
//   }
//   const route_id = routeResult.rows[0].route_id;

//   //Insert a new trip
//   const tripInsertQuery = `
//     INSERT INTO trips (route_id, vehicle_id, start_time, status)
//     VALUES ($1, $2, NOW(), 'ongoing')
//     RETURNING trip_id
//   `;
//   const tripResult = await db.query(tripInsertQuery, [
//     route_id,
//     socket.vehicleId,
//   ]);
//   const trip_id = tripResult.rows[0].trip_id;
//   socket.tripId = trip_id;
//   console.log(`Trip ${trip_id} started for vehicle ${vehicle_number}`);

//   //Listen for driver's location updates
//   socket.on("driverLocation", async (data) => {
//     const { lat, lng, speed = 0, accuracy = 0 } = data;

//     if (lat == null || lng == null) {
//       console.error("Invalid location data:", data);
//       return;
//     }

//     try {
//       const insertQuery = `
//         INSERT INTO vehicle_positions (vehicle_id, trip_id, location, speed_mps, accuracy)
//         VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6)
//       `;

//       await db.query(insertQuery, [
//         socket.vehicleId,
//         socket.tripId,
//         lng,
//         lat,
//         speed,
//         accuracy,
//       ]);

//       // console.log(
//       //   `Location update stored for vehicle ${socket.vehicleId} (Trip ${socket.tripId})`
//       // );

//       io.to(socket.vehicleId).emit("vehicleLocationUpdate", {
//         vehicleId: socket.vehicleId,
//         tripId: socket.tripId,
//         lat,
//         lng,
//         speed,
//         accuracy,
//       });
//     } catch (err) {
//       console.error("Error inserting vehicle position:", err.message);
//     }
//   });

//   //Complete trip on disconnect
//   socket.on("disconnect", async () => {
//     try {
//       if (socket.tripId) {
//         const completeTripQuery = `
//           UPDATE trips
//           SET status = 'completed', end_time = NOW()
//           WHERE trip_id = $1
//         `;
//         await db.query(completeTripQuery, [socket.tripId]);
//         console.log(
//           `Trip ${socket.tripId} completed for vehicle ${socket.vehicleId}`
//         );
//       }
//     } catch (err) {
//       console.error("Error completing trip:", err.message);
//     }
//   });
// };

// export default driverHandler;

// ----------------------------------------------------------------------------------------------
//refactored

import {
  getVehicleNumber,
  getRouteIdByVehicleNumber,
  startTrip,
  insertVehiclePosition,
  completeTrip,
} from "../dbLogic/driverSocketLogic.js";

const driverHandler = async (io, socket) => {
  if (!socket.vehicleId || !socket.userId) {
    console.error("Missing vehicleId or userId on socket");
    return;
  }

  socket.join(socket.vehicleId);
  console.log(`Driver ${socket.userId} joined vehicle ${socket.vehicleId}`);

  try {
    const vehicleNumber = await getVehicleNumber(socket.vehicleId);
    if (!vehicleNumber) {
      console.error("Vehicle not found");
      return;
    }

    const routeId = await getRouteIdByVehicleNumber(vehicleNumber);
    if (!routeId) {
      console.error("No route found for this vehicle");
      return;
    }

    const tripId = await startTrip(routeId, socket.vehicleId);
    if (!tripId) {
      console.error("Failed to create trip");
      return;
    }

    socket.tripId = tripId;
    console.log(`Trip ${tripId} started for vehicle ${vehicleNumber}`);

    socket.on("driverLocation", async (data) => {
      const { lat, lng, speed = 0, accuracy = 0 } = data;

      if (lat == null || lng == null) {
        console.error("Invalid location data:", data);
        return;
      }

      try {
        await insertVehiclePosition(
          socket.vehicleId,
          socket.tripId,
          lat,
          lng,
          speed,
          accuracy
        );

        io.to(socket.vehicleId).emit("vehicleLocationUpdate", {
          vehicleId: socket.vehicleId,
          tripId: socket.tripId,
          lat,
          lng,
          speed,
          accuracy,
        });
      } catch (err) {
        console.error("Error inserting vehicle position:", err.message);
      }
    });

    socket.on("disconnect", async () => {
      try {
        if (socket.tripId) {
          await completeTrip(socket.tripId);
          console.log(
            `Trip ${socket.tripId} completed for vehicle ${socket.vehicleId}`
          );
        }
      } catch (err) {
        console.error("Error completing trip:", err.message);
      }
    });
  } catch (err) {
    console.error("Error in driver handler:", err.message);
  }
};

export default driverHandler;

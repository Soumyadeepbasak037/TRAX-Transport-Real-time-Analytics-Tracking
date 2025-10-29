// const passengerHandler = (io, socket) => {
//   console.log(`Passenger ${socket.id} connected`);

//   socket.on("passenger:join", ({ vehicleId }) => {
//     socket.join(vehicleId);
//     console.log(`Passenger ${socket.id} joined vehicle room ${vehicleId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log(`Passenger ${socket.id} disconnected`);
//   });
// };

// export default passengerHandler;

const passengerHandler = (io, socket) => {
  if (!socket) {
    console.error("Passenger socket does not exist.");
    return;
  }

  console.log(`Passenger ${socket.id} connected`);

  socket.on("passenger:join", ({ vehicleId }) => {
    if (!vehicleId) {
      console.warn(
        `Passenger ${socket.id} attempted to join with invalid vehicleId`
      );
      return;
    }

    if (socket.disconnected) {
      console.warn(`Passenger ${socket.id} is disconnected.`);
      return;
    }

    socket.join(vehicleId);
    console.log(`Passenger ${socket.id} joined vehicle room ${vehicleId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Passenger ${socket.id} disconnected (${reason})`);
  });
};

export default passengerHandler;

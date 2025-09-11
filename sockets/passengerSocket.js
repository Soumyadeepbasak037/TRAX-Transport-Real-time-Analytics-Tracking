const passengerHandler = (io, socket) => {
  console.log(`Passenger ${socket.id} connected`);

  // Passenger joins a vehicle room
  socket.on("passenger:join", ({ vehicleId }) => {
    socket.join(vehicleId);
    console.log(`Passenger ${socket.id} joined vehicle room ${vehicleId}`);
  });

  // Optional: handle passenger disconnect
  socket.on("disconnect", () => {
    console.log(`Passenger ${socket.id} disconnected`);
  });
};

export default passengerHandler;

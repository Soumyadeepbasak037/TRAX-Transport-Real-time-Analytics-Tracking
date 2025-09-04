import db from "../config/db.js";

const driverHandler = (io, socket) => {
  socket.on("driverLogin", async ({ username, password }) => {});
};

export default driverHandler;

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

//Routes
//const authRoutes = require("../e_com_pg/routes/authroutes");
//app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

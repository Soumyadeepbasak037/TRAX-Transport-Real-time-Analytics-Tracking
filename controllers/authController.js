import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import Joi from "joi";
import * as helper from "../helper_functions/helper.js";
// Move this to .env in production
const SECRET_KEY = "hehe";

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  role: Joi.string().min(3).max(10).required(),
});

export const register = async (req, res) => {
  const {
    username,
    password,
    email,
    role,
    vehicle_number,
    vehicle_plate_number,
    vehicle_type,
    vehicle_capacity,
    driver_name,
    driver_license_no,
    driver_phone,
  } = req.body;

  const { error } = registerSchema.validate({
    username,
    password,
    email,
    role,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const hashed_passwd = bcrypt.hashSync(password, 10);

  try {
    const result = await db.query(
      `INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3 ,$4) RETURNING user_id`,
      [username, hashed_passwd, email, role]
    );

    const user_id = result.rows[0].user_id;
    if (role == "passenger") {
      return res.status(201).json({ message: "User registered", user_id });
    } else if (role == "driver") {
      const inserted_vehicle_id = await helper.insertNewVehicle(
        vehicle_number,
        vehicle_type,
        vehicle_capacity,
        vehicle_plate_number
        //also have to insert driver_license_number in the vehicle.plate_number ->done
      );
      const inserted_driver_id = await helper.insertNewDriver(
        user_id,
        driver_name,
        driver_license_no,
        driver_phone,
        inserted_vehicle_id
      );
      return res.json({
        message: `Inserted driver id: ${inserted_driver_id}, assigned vhicle id: ${inserted_vehicle_id}`,
      });
    }
  } catch (err) {
    if (err.code === "23505") {
      // Unique constraint violation
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

export const login = async (req, res) => {
  const { username, password } = req.body;

  const { error } = loginSchema.validate({ username, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const result = await db.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    let token = "";
    if (user.role == "driver") {
      const joinQuery = `select u.user_id,u.role,
                      d.driver_id,
                      v.vehicle_id,v.vehicle_number 
                      from users as u 
                      inner join drivers as d 
                      on u.user_id = d.user_id 
                      inner join vehicles as v 
                      on d.assigned_vehicle_id = v.vehicle_id
                      where u.user_id = $1
                      `;
      const result = await db.query(joinQuery, [user.user_id]);
      const driver_data = result.rows[0];
      console.log(result);

      token = jwt.sign(
        {
          id: user.user_id,
          username: user.username,
          role: user.role,
          vehicleId: driver_data.vehicle_id,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
    } else {
      token = jwt.sign(
        {
          id: user.user_id,
          username: user.username,
          role: user.role,
          vehicleId: null,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
    }

    res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

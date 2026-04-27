import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db, { getClient } from "../config/db.js";
import Joi from "joi";
import * as helper from "../helper_functions/helper.js";

const SECRET_KEY = "hehe";

const UNIQUE_CONSTRAINT_MESSAGES = {
  users_username_key: "Username already taken",
  users_email_key: "Email already registered",
  vehicles_vehicle_number_key: "Vehicle number already registered",
  vehicles_vehicle_plate_number_key: "Vehicle plate number already registered",
  drivers_license_number_key: "Driver license number already registered",
  drivers_user_id_key: "This user is already registered as a driver",
};

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().max(100).required(),
  role: Joi.string().valid("admin", "driver", "passenger").required(),

  vehicle_number: Joi.when("role", {
    is: "driver",
    then: Joi.string().max(50).required(),
    otherwise: Joi.forbidden(),
  }),
  vehicle_plate_number: Joi.when("role", {
    is: "driver",
    then: Joi.string().max(20).required(),
    otherwise: Joi.forbidden(),
  }),
  vehicle_type: Joi.when("role", {
    is: "driver",
    then: Joi.string().max(50).required(),
    otherwise: Joi.forbidden(),
  }),
  vehicle_capacity: Joi.when("role", {
    is: "driver",
    then: Joi.number().integer().min(1).required(),
    otherwise: Joi.forbidden(),
  }),
  driver_name: Joi.when("role", {
    is: "driver",
    then: Joi.string().max(100).required(),
    otherwise: Joi.forbidden(),
  }),
  driver_license_no: Joi.when("role", {
    is: "driver",
    then: Joi.string().max(50).required(),
    otherwise: Joi.forbidden(),
  }),
  driver_phone: Joi.when("role", {
    is: "driver",
    then: Joi.string().max(20).optional(),
    otherwise: Joi.forbidden(),
  }),
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

  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const hashed_passwd = bcrypt.hashSync(password, 10);

  const client = await getClient();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4) RETURNING user_id`,
      [username, hashed_passwd, email, role],
    );
    const user_id = result.rows[0].user_id;

    if (role === "passenger") {
      await client.query("COMMIT");
      return res.status(201).json({ message: "Passenger registered", user_id });
    } else if (role === "driver") {
      const inserted_vehicle_id = await helper.insertNewVehicle(
        client,
        vehicle_number,
        vehicle_type,
        vehicle_capacity,
        vehicle_plate_number,
      );
      const inserted_driver_id = await helper.insertNewDriver(
        client,
        user_id,
        driver_name,
        driver_license_no,
        driver_phone,
        inserted_vehicle_id,
      );
      await client.query("COMMIT");
      return res.status(201).json({
        message: `Inserted driver id: ${inserted_driver_id}, assigned vehicle id: ${inserted_vehicle_id}`,
      });
    } else if (role === "admin") {
      await client.query("COMMIT");
      console.log("Admin account detected");
      return res.status(201).json({ message: `Inserted Admin id: ${user_id}` });
    }
  } catch (err) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      const message =
        UNIQUE_CONSTRAINT_MESSAGES[err.constraint] ||
        `Duplicate value for: ${err.constraint}`;
      return res.status(409).json({ message, constraint: err.constraint });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    client.release();
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
    if (user.role === "driver") {
      const joinQuery = `SELECT u.user_id, u.role,
                        d.driver_id,
                        v.vehicle_id, v.vehicle_number
                        FROM users AS u
                        INNER JOIN drivers AS d ON u.user_id = d.user_id
                        INNER JOIN vehicles AS v ON d.assigned_vehicle_id = v.vehicle_id
                        WHERE u.user_id = $1`;
      const driverResult = await db.query(joinQuery, [user.user_id]);
      const driver_data = driverResult.rows[0];
      token = jwt.sign(
        {
          id: user.user_id,
          driver_id: driver_data.driver_id,
          username: user.username,
          role: user.role,
          vehicleId: driver_data.vehicle_id,
        },
        SECRET_KEY,
        { expiresIn: "1h" },
      );
    } else if (user.role === "passenger") {
      token = jwt.sign(
        {
          id: user.user_id,
          username: user.username,
          role: user.role,
          vehicleId: null,
        },
        SECRET_KEY,
        { expiresIn: "1h" },
      );
    } else if (user.role === "admin") {
      token = jwt.sign(
        {
          id: user.user_id,
          username: user.username,
          role: user.role,
          vehicleId: null,
        },
        SECRET_KEY,
        { expiresIn: "1h" },
      );
      console.log(user.role);
    }

    res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

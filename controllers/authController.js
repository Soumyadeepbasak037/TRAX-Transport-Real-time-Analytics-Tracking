import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import Joi from "joi";

// Move this to .env in production
const SECRET_KEY = "hehe";

// Register Schema
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  role: Joi.string().min(3).max(10).required(),
});

export const register = async (req, res) => {
  const { username, password, email, role } = req.body;

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
    return res.status(201).json({ message: "User registered", user_id });
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

// Login Schema
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

    const token = jwt.sign(
      { id: user.user_id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

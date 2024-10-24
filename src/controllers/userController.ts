import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { getDbConnection } from "../config/db";
import { generateToken } from "../utils/jwt";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const pool = await getDbConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool
      .request()
      .input("name", name)
      .input("email", email)
      .input("password", hashedPassword)
      .query(
        "INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)"
      );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("email", email)
      .query("SELECT * FROM Users WHERE email = @email");

    const user = result.recordset[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("email", email)
      .input("name", name)
      .query("UPDATE Users SET name = @name WHERE email = @email");

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updateing user" });
  }
};

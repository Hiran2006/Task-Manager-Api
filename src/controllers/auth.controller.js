import bcrypt from "bcrypt"
import db from "../config/db.js"
import jwt from "jsonwebtoken"
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const [existing] = await db.query(
      "Select * from users where email=?",
      email,
    )
    if (existing.length > 0) {
      return res.status(400).json({ error: "User Exist" })
    }
    const hashPass = await bcrypt.hash(password, Number(process.env.SALT_LEVEL) || 10)
    console.log(hashPass)
    await db.query(
      `INSERT INTO users(name, email, password) VALUES(?, ?, ?)`,
      [name, email, hashPass]
    )
    return res.status(201).json({ message: "User Created" })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (!users.length)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ message: "Invalid password" });

    /* ✅ JWT TOKEN */
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
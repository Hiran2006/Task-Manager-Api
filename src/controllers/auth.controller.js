import bcrypt from "bcrypt"
import db from "../config/db.js"
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
    const hashPass = await bcrypt.hash(password, process.env.SALT_LEVEL || 10)
    console.log(hashPass)
    await db.query(
      "insert table users (name,email,password) values(?,?,?)",
      name,
      email,
      hashPass,
    )
  } catch (err) {
    res.status(500).json({ error: err })
  }
}
export const loginUser = async (req, res) => {}

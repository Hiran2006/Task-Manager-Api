import mysql from "mysql2/promise"

const port = process.env.DB_PORT || 3306
const user = process.env.DB_USER
const pass = process.env.DB_PASS

if (!user || !pass) {
  console.log("Missing Database Env")
  console.log(user, pass)
}
const db = mysql.createPool({
  user,
  host: "localhost",
  password: pass,
  database: "task_manager",
})

db.connect = async () => {
  try {
    await db.query("Select 1")
  } catch (error) {
    console.error("MYSQL Server Error", error)
    process.exit()
  }
}

export default db

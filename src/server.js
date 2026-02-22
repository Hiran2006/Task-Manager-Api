import "dotenv/config.js"
import app from "./app.js"
import db from "./config/db.js"
import { connectRedis } from "./config/redis.js"

const port = process.env.PORT || 5000
const startServer = async () => {
  try {
    await db.connect()
    await connectRedis()
    app.listen(port, () => {
      console.log(`Server is running in port ${port}`)
    })
  } catch (err) {
    console.log("Server Start Failed")
    console.error(err)
    process.exit(1)
  }
}

startServer()

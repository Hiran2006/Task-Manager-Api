import "dotenv/config.js"
import app from "./app.js"
const port = process.env.PORT || 5000
import db from "./config/db.js"

const startServer = () => {
  try {
    db.connect()
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

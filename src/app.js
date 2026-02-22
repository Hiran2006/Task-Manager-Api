import express from "express"
const app = express()
import authRoute from "./routes/auth.routes.js"
import taskRoute from "./routes/task.routes.js"

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Task Manager Api is running...")
})

app.use("/api/auth", authRoute)
app.use("/api/task", taskRoute)
export default app

import db from "../config/db.js";
import { redisClient } from "../config/redis.js";

/* ---------------- Create Task ---------------- */

export const createTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title } = req.body;

        await db.query(
            "INSERT INTO tasks(user_id,title,status) VALUES(?,?,?)",
            [userId, title, "pending"]
        );

        await redisClient.del(`tasks:${userId}`);

        res.json({ message: "Task created" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* ---------------- Get Tasks ---------------- */

export const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = `tasks:${userId}`;

        const cached = await redisClient.get(cacheKey);

        if (cached)
            return res.json(JSON.parse(cached));

        const [tasks] = await db.query(
            "SELECT * FROM tasks WHERE user_id=?",
            [userId]
        );

        await redisClient.set(
            cacheKey,
            JSON.stringify(tasks),
            { EX: 60 }
        );

        res.json(tasks);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* ---------------- Update ---------------- */

export const updateTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        await db.query(
            "UPDATE tasks SET status=? WHERE id=? AND user_id=?",
            [status, id, userId]
        );

        await redisClient.del(`tasks:${userId}`);

        res.json({ message: "Task updated" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* ---------------- Delete ---------------- */

export const deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await db.query(
            "DELETE FROM tasks WHERE id=? AND user_id=?",
            [id, userId]
        );

        await redisClient.del(`tasks:${userId}`);

        res.json({ message: "Task deleted" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
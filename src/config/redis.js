import redis from "redis";

const redisClient = redis.createClient({
    url: "redis://localhost:6379",
});

redisClient.on("connect", () => {
    console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

async function connectRedis() {
    await redisClient.connect();
}

export { redisClient, connectRedis };
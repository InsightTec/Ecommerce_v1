const { createClient } = require("redis");

const redisConnection = () => {
  const connectRedis = async () =>{
  // connect to Redis
const REDIS_HOST = "redis"; // name of sevice redis in docker-compose
const REDIS_PORT = 6379; // mapping port in redis service  in docker-compose
const client = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis is connected successfully"));

const connect_redis = async () => {
  await client.connect();
  await client.set("key", "value");
  const value = await client.get("key");
  //await client.disconnect();
};

connect_redis();
  }
  connectRedis();
};

module.exports = redisConnection;

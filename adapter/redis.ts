import { Redis } from "@upstash/redis";

const globalForRedis = global as unknown as { redis: Redis }

export const redis =
    globalForRedis.redis ||
    new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL ?? "",
        token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
    })

if (process.env.VERCEL_ENV !== 'production') globalForRedis.redis = redis
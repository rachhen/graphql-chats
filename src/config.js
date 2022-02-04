export const {
  APP_PORT = 4000,
  NODE_ENV = "development",
  DATABASE_URI,

  SESS_NAME = "sid",
  SESS_SECRET = "ssh!screct",
  SESS_LIFETIME = 1000 * 60 * 60 * 2,

  REDIS_HOST = "localhost",
  REDIS_PORT = 6379,
  REDIS_PASSWORD = "screct",
} = process.env;
export const IN_PROD = NODE_ENV === "production";

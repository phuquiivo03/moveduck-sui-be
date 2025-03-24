// src/config/index.ts
import dotenv from "dotenv";

dotenv.config();

export const config = {
  nosqlDb: {
    type: process.env.NOSQL_DB_TYPE || "mongodb",
    user: process.env.NOSQL_DB_USER || "x",
    password: process.env.NOSQL_DB_PASSWORD || "",
    host: process.env.NOSQL_DB_HOST || "127.0.0.1",
    port: parseInt(process.env.NOSQL_DB_PORT || "27017", 10),
    name: process.env.NOSQL_DB_NAME || "",
  },
};



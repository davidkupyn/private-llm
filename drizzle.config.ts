import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({
  path: ".env.local",
});

export default defineConfig({
  dialect: "turso",
  schema: "./lib/db.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});

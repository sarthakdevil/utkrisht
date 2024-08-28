import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/app/schema.ts", // Adjust the path to your schema if needed
  out: "./drizzle", // Directory where migrations will be stored
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Use the connection URL from your .env file
  },
});

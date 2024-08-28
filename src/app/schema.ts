import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const teacher = pgTable("teacher", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  teacher_id: text("teacherid"),
  specialization:text("specialization"),
  createdAt: timestamp("created_at"),
});
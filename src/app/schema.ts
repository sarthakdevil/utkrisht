import { boolean } from "drizzle-orm/mysql-core";
import { serial, text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";

export const teacher = pgTable("teacher", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  teacher_id: text("teacherid"),
  specialization:text("specialization"),
  createdAt: timestamp("created_at"),
});

// Define the 'student' table
export const student = pgTable("student", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  program: text("program").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  proposals_submitted: integer("proposals_submitted").default(0),
  proposals_approved: integer("proposals_approved").default(0),
  completed: boolean("completed").default(false),
});

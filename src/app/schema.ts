import { serial, text, timestamp, pgTable, integer,varchar,boolean } from "drizzle-orm/pg-core";

// Define the 'teacher' table
export const teacher = pgTable("teacher", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  teacher_id: text("teacher_id"),
  specialization: text("specialization"),
  createdAt: timestamp("created_at", { withTimezone: true }),
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

// Define the 'proposals' table
export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  student_id: varchar("student_id", { length: 255 }),
  teacher_id: varchar("teacher_id", { length: 255 }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  status: text("status").default("pending"), // Default status to 'pending'
});

// Define the 'slots' table
export const slots = pgTable("slots", {
  id: serial("id").primaryKey(),
  teacher_id: varchar("teacher_id", { length: 255 }),
  start_time: timestamp("start_time", { withTimezone: true }),
  end_time: timestamp("end_time", { withTimezone: true }),
  empty_slots: integer("empty_slots").default(0),
  filled_slots: integer("filled_slots").default(0),
});

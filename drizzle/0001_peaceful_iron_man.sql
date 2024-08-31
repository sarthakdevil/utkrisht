CREATE TABLE IF NOT EXISTS "proposals" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" varchar(255),
	"teacher_id" varchar(255),
	"title" varchar(255),
	"description" text,
	"status" text DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "slots" (
	"id" serial PRIMARY KEY NOT NULL,
	"teacher_id" varchar(255),
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"empty_slots" integer DEFAULT 0,
	"filled_slots" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"program" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"proposals_submitted" integer DEFAULT 0,
	"proposals_approved" integer DEFAULT 0,
	"completed" boolean DEFAULT false,
	CONSTRAINT "student_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "teacher" RENAME COLUMN "teacherid" TO "teacher_id";--> statement-breakpoint
ALTER TABLE "teacher" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "teacher" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;
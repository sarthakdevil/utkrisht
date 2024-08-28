CREATE TABLE IF NOT EXISTS "teacher" (
	"id" serial NOT NULL,
	"name" text,
	"email" text,
	"password" text,
	"teacherid" text,
	"specialization" text,
	"created_at" timestamp
);

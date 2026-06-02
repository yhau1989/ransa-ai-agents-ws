DROP TABLE IF EXISTS "form_submissions" CASCADE;

ALTER TABLE "form_submissions" ADD COLUMN "iso_tools_code" text;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD COLUMN "iso_tools_code_date" timestamp with time zone DEFAULT now() NOT NULL;
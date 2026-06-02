DROP TABLE IF EXISTS "form_submissions" CASCADE;

ALTER TABLE "form_submissions" ALTER COLUMN "iso_tools_code_date" DROP NOT NULL;
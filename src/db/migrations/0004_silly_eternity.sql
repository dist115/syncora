ALTER TABLE "auth_user" ALTER COLUMN "encryption_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_user" ALTER COLUMN "encryption_key" DROP NOT NULL;
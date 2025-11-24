ALTER TABLE "files" ADD COLUMN "encrypted_key" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "encryption_iv" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "encryption_salt" text;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "is_encrypted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "encryption_version" text DEFAULT '1.0';
ALTER TABLE "auth_user" ADD COLUMN "encryption_type" varchar(50) DEFAULT 'AES-256-GCM' NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_user" ADD COLUMN "encryption_key" varchar(500) NOT NULL;
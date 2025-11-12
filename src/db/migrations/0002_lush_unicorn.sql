CREATE TABLE "auth_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_token" varchar(255),
	"verification_token_expires_at" timestamp,
	"reset_password_token" varchar(255),
	"reset_password_token_expires_at" timestamp,
	"mfa_enabled" boolean DEFAULT false NOT NULL,
	"mfa_secret" varchar(255),
	"mfa_backup_codes" varchar(1000),
	"user_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "auth_user_email_unique" UNIQUE("email"),
	CONSTRAINT "auth_user_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "password";
CREATE TABLE "days" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "days_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"day" date NOT NULL,
	"period" integer NOT NULL,
	"eventId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar NOT NULL,
	"description" varchar,
	"updatedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "event_types" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_types_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" text NOT NULL,
	"name" varchar NOT NULL,
	"color" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "days" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "days" CASCADE;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "eventTypeId" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "startTime" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "endTime" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "isAllDay" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "recurrenceRule" varchar;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "recurrenceInterval" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "recurrenceEndDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "recurrenceCount" integer;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_eventTypeId_event_types_id_fk" FOREIGN KEY ("eventTypeId") REFERENCES "public"."event_types"("id") ON DELETE set null ON UPDATE no action;
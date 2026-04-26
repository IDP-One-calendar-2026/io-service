import { date, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const eventTable = pgTable("events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  description: varchar(),
  updatedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const eventRelations = relations(eventTable, ({ many }) => ({
  days: many(daysTable),
}));

export const daysTable = pgTable("days", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  day: date().notNull(),
  period: integer().notNull(),
  eventId: integer().notNull().references(() => eventTable.id, { onDelete: "cascade" }),
});

export const daysRelations = relations(daysTable, ({ one }) => ({
  event: one(eventTable, {
    fields: [daysTable.eventId],
    references: [eventTable.id],
  }),
}));



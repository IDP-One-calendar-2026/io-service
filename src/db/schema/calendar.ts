import { boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const eventTypeTable = pgTable("event_types", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text().notNull(),
  name: varchar().notNull(),
  color: varchar(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const eventTypeRelations = relations(eventTypeTable, ({ many }) => ({
  events: many(eventTable),
}));

export const eventTable = pgTable("events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text().notNull(),
  eventTypeId: integer().references(() => eventTypeTable.id, { onDelete: "set null" }),
  title: varchar().notNull(),
  description: varchar(),
  startTime: timestamp({ withTimezone: true }).notNull(),
  endTime: timestamp({ withTimezone: true }).notNull(),
  isAllDay: boolean().default(false),
  recurrenceRule: varchar(), // daily, weekly, monthly, yearly
  recurrenceInterval: integer().default(1),
  recurrenceEndDate: timestamp({ withTimezone: true }),
  recurrenceCount: integer(),
  updatedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const eventRelations = relations(eventTable, ({ one }) => ({
  eventType: one(eventTypeTable, {
    fields: [eventTable.eventTypeId],
    references: [eventTypeTable.id],
  }),
}));

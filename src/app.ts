import { Hono, type Context } from 'hono'
import { eq } from 'drizzle-orm'
import db from './db/index.js'
import { eventTable, daysTable } from './db/schema/calendar.js'

const app = new Hono()

const getRoot = (c: Context) => {
  return c.text('Hello Hono!')
}

// Events
const getEvents = async (c: Context) => {
  const events = await db.query.eventTable.findMany({
    with: { days: true },
  })
  return c.json(events)
}

const getEventById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const event = await db.query.eventTable.findFirst({
    where: eq(eventTable.id, id),
    with: { days: true },
  })
  if (!event) return c.json({ error: 'Event not found' }, 404)
  return c.json(event)
}

const createEvent = async (c: Context) => {
  const body = await c.req.json<{ title: string; description?: string }>()
  const [event] = await db.insert(eventTable).values({
    title: body.title,
    description: body.description,
  }).returning()
  return c.json(event, 201)
}

const updateEventById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ title?: string; description?: string }>()
  const [event] = await db.update(eventTable).set({
    ...body,
    updatedAt: new Date(),
  }).where(eq(eventTable.id, id)).returning()
  if (!event) return c.json({ error: 'Event not found' }, 404)
  return c.json(event)
}

const deleteEventById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const [event] = await db.delete(eventTable).where(eq(eventTable.id, id)).returning()
  if (!event) return c.json({ error: 'Event not found' }, 404)
  return c.json({ success: true })
}

// Days
const getDays = async (c: Context) => {
  const days = await db.select().from(daysTable)
  return c.json(days)
}

const getDayById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const [day] = await db.select().from(daysTable).where(eq(daysTable.id, id))
  if (!day) return c.json({ error: 'Day not found' }, 404)
  return c.json(day)
}

const createDay = async (c: Context) => {
  const body = await c.req.json<{ day: string; period: number; eventId: number }>()
  const [day] = await db.insert(daysTable).values({
    day: body.day,
    period: body.period,
    eventId: body.eventId,
  }).returning()
  return c.json(day, 201)
}

const updateDayById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ day?: string; period?: number; eventId?: number }>()
  const [day] = await db.update(daysTable).set(body).where(eq(daysTable.id, id)).returning()
  if (!day) return c.json({ error: 'Day not found' }, 404)
  return c.json(day)
}

const deleteDayById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const [day] = await db.delete(daysTable).where(eq(daysTable.id, id)).returning()
  if (!day) return c.json({ error: 'Day not found' }, 404)
  return c.json({ success: true })
}

const routes = app
  .get('/', getRoot)
  .get('/events', getEvents)
  .get('/events/:id', getEventById)
  .post('/events', createEvent)
  .put('/events/:id', updateEventById)
  .delete('/events/:id', deleteEventById)
  .get('/days', getDays)
  .get('/days/:id', getDayById)
  .post('/days', createDay)
  .put('/days/:id', updateDayById)
  .delete('/days/:id', deleteDayById)

export type AppType = typeof routes
export default app
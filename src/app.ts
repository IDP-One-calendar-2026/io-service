import { Hono, type Context } from 'hono'
import { eq, and, gte, lte, isNotNull, or, SQL } from 'drizzle-orm'
import db from './db/index.js'
import { eventTable, eventTypeTable } from './db/schema/calendar.js'

const app = new Hono()

const getRoot = (c: Context) => {
  return c.text('Hello Hono!')
}

// Event Types
const getEventTypes = async (c: Context) => {
  const userId = c.req.query('userId')
  if (!userId) return c.json({ error: 'userId is required' }, 400)
  const types = await db.query.eventTypeTable.findMany({
    where: eq(eventTypeTable.userId, userId),
  })
  return c.json(types)
}

const getEventTypeById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const type = await db.query.eventTypeTable.findFirst({
    where: eq(eventTypeTable.id, id),
  })
  if (!type) return c.json({ error: 'Event type not found' }, 404)
  return c.json(type)
}

const createEventType = async (c: Context) => {
  const body = await c.req.json<{ userId: string; name: string; color?: string }>()
  const [type] = await db.insert(eventTypeTable).values({
    userId: body.userId,
    name: body.name,
    color: body.color,
  }).returning()
  return c.json(type, 201)
}

const updateEventTypeById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ name?: string; color?: string }>()
  const [type] = await db.update(eventTypeTable).set(body).where(eq(eventTypeTable.id, id)).returning()
  if (!type) return c.json({ error: 'Event type not found' }, 404)
  return c.json(type)
}

const deleteEventTypeById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const [type] = await db.delete(eventTypeTable).where(eq(eventTypeTable.id, id)).returning()
  if (!type) return c.json({ error: 'Event type not found' }, 404)
  return c.json({ success: true })
}

// Events
const getEvents = async (c: Context) => {
  const userId = c.req.query('userId')
  const from = c.req.query('from')
  const to = c.req.query('to')

  if (!userId) return c.json({ error: 'userId is required' }, 400)

  const conditions: SQL<unknown>[] = [eq(eventTable.userId, userId)]

  if (from && to) {
    const fromDate = new Date(from)
    const toDate = new Date(to)
    const rangeCondition = or(
      gte(eventTable.endTime, fromDate),
      isNotNull(eventTable.recurrenceRule)
    )
    if (rangeCondition) {
      conditions.push(lte(eventTable.startTime, toDate), rangeCondition)
    }
  }

  const events = await db.query.eventTable.findMany({
    where: and(...conditions),
    with: { eventType: true },
  })
  return c.json(events)
}

const getEventById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const event = await db.query.eventTable.findFirst({
    where: eq(eventTable.id, id),
    with: { eventType: true },
  })
  if (!event) return c.json({ error: 'Event not found' }, 404)
  return c.json(event)
}

const createEvent = async (c: Context) => {
  const body = await c.req.json<{
    userId: string
    title: string
    description?: string
    eventTypeId?: number
    startTime: string
    endTime: string
    isAllDay?: boolean
    recurrenceRule?: string
    recurrenceInterval?: number
    recurrenceEndDate?: string
    recurrenceCount?: number
  }>()

  const [event] = await db.insert(eventTable).values({
    userId: body.userId,
    title: body.title,
    description: body.description,
    eventTypeId: body.eventTypeId,
    startTime: new Date(body.startTime),
    endTime: new Date(body.endTime),
    isAllDay: body.isAllDay,
    recurrenceRule: body.recurrenceRule,
    recurrenceInterval: body.recurrenceInterval,
    recurrenceEndDate: body.recurrenceEndDate ? new Date(body.recurrenceEndDate) : undefined,
    recurrenceCount: body.recurrenceCount,
  }).returning()

  return c.json(event, 201)
}

const updateEventById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<Partial<{
    title: string
    description: string
    eventTypeId: number
    startTime: string
    endTime: string
    isAllDay: boolean
    recurrenceRule: string
    recurrenceInterval: number
    recurrenceEndDate: string
    recurrenceCount: number
  }>>()

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  }

  if (body.title !== undefined) updateData.title = body.title
  if (body.description !== undefined) updateData.description = body.description
  if (body.eventTypeId !== undefined) updateData.eventTypeId = body.eventTypeId
  if (body.startTime !== undefined) updateData.startTime = new Date(body.startTime)
  if (body.endTime !== undefined) updateData.endTime = new Date(body.endTime)
  if (body.isAllDay !== undefined) updateData.isAllDay = body.isAllDay
  if (body.recurrenceRule !== undefined) updateData.recurrenceRule = body.recurrenceRule
  if (body.recurrenceInterval !== undefined) updateData.recurrenceInterval = body.recurrenceInterval
  if (body.recurrenceEndDate !== undefined) updateData.recurrenceEndDate = new Date(body.recurrenceEndDate)
  if (body.recurrenceCount !== undefined) updateData.recurrenceCount = body.recurrenceCount

  const [event] = await db.update(eventTable).set(updateData as any).where(eq(eventTable.id, id)).returning()

  if (!event) return c.json({ error: 'Event not found' }, 404)
  return c.json(event)
}

const deleteEventById = async (c: Context) => {
  const id = Number(c.req.param('id'))
  const [event] = await db.delete(eventTable).where(eq(eventTable.id, id)).returning()
  if (!event) return c.json({ error: 'Event not found' }, 404)
  return c.json({ success: true })
}

const routes = app
  .get('/', getRoot)
  .get('/event-types', getEventTypes)
  .get('/event-types/:id', getEventTypeById)
  .post('/event-types', createEventType)
  .put('/event-types/:id', updateEventTypeById)
  .delete('/event-types/:id', deleteEventTypeById)
  .get('/events', getEvents)
  .get('/events/:id', getEventById)
  .post('/events', createEvent)
  .put('/events/:id', updateEventById)
  .delete('/events/:id', deleteEventById)

export type AppType = typeof routes
export default app

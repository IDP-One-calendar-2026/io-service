import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schemaCalendar from './schema/calendar.js';

const pool = new Pool({
  connectionString: `postgresql://${process.env.DB_USER_IO_SERVICE!}:${process.env.DB_PASSWORD_IO_SERVICE!}@${process.env.DB_HOST_IO_SERVICE!}:${process.env.DB_PORT_IO_SERVICE!}/${process.env.DB_NAME_IO_SERVICE!}`,
});

const schema = {
  ... schemaCalendar,
}

const db = drizzle<typeof schema>(pool, { schema });

export default db;
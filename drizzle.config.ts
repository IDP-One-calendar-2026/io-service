import 'dotenv/config'
import { defineConfig } from "drizzle-kit";

const url =
  process.env.DATABASE_URL_IO_SERVICE ??
  `postgresql://${process.env.DB_USER_IO_SERVICE!}:${process.env.DB_PASSWORD_IO_SERVICE!}@${process.env.DB_HOST_IO_SERVICE!}:${process.env.DB_PORT_IO_SERVICE!}/${process.env.DB_NAME_IO_SERVICE!}`;

export default defineConfig({
  dbCredentials:{
    url
  },
  dialect: 'postgresql',
  schema: './src/db/schema'
})
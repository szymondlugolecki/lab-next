import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/tables/*",
  dialect: "sqlite",
  verbose: true,
  out: "./drizzle",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
});

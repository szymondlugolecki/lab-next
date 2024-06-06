import { drizzle } from "drizzle-orm/d1";

import * as sessions from "./tables/session";
import * as users from "./tables/user";
import * as oauthAccounts from "./tables/account";
import * as authenticators from "./tables/authenticator";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const schemas = {
  ...sessions,
  ...users,
  ...oauthAccounts,
  ...authenticators,
};

function getDB() {
  if (process.env.NODE_ENV === "development") {
    const { env } = getRequestContext();
    return drizzle(env.D1, { schema: schemas, logger: true });
  }
  // Production
  return drizzle(process.env.D1, {
    schema: schemas,
    logger: true,
  });
}

export const db = getDB();

import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { auth } from "../auth";
import { z } from "zod";
import { isModerator } from "../utils";

class ActionError extends Error {}

export const DANGEROUS_unauthenticatedAction = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  // Here we await the action execution.
  const result = await next({ ctx: null });

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);

  // And then return the result of the awaited action.
  return result;
});

export const authenticatedAction = DANGEROUS_unauthenticatedAction.use(
  async ({ next }) => {
    const session = await auth();
    if (!session) {
      throw new ActionError("Unauthorized");
    }

    return next({ ctx: { session } });
  }
);

export const moderatorAction = DANGEROUS_unauthenticatedAction.use(
  async ({ next }) => {
    const session = await auth();
    if (!session) {
      throw new ActionError("Unauthorized");
    }

    const ownerEmail = process.env.OWNER_EMAIL;
    if (session.user.email !== ownerEmail) {
      if (!isModerator(session.user.role)) {
        throw new ActionError("Only moderators can do that");
      }
    }

    return next({ ctx: { session } });
  }
);

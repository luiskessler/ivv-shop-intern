
/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";

import { parse } from "cookie";

import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type CreateContextOptions = Record<string, never>;

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    db,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export async function createTRPCContext({req, res}: CreateNextContextOptions) {
  const cookies = parse(req.headers.cookie ?? '')
  const session = cookies.sessionId ?? null

  console.log("SessionCookie", session)

  let isUserLoggedIn = false

  if (!session) {
     // falls keine SessionID vorhanden, wird der User nicht eingeloggt - behält normale Zugriffsrechte
     return { isUserLoggedIn: false, user: null, req, res, db }
  }

  const sessionData = await db.session.findUnique({
    where: {
      sessionId: session,
    },
  }) // query nach SessionID

  console.log("Session Data", sessionData)

  const userData = await db.user.findFirst({
    where: {
      id: sessionData?.userId!,
    },
  })

  console.log("Session Data", sessionData)

  if (!sessionData || sessionData.expires < new Date()) {
    return { isUserLoggedIn: false, user: null, req, res, db, message: "Session abgelaufen oder invalide."}
  } // falls SessionID nicht vorhanden oder abgelaufen, wird der User nicht eingeloggt - behält normale Zugriffsrechte
  else {
    isUserLoggedIn = true
    return {
      isUserLoggedIn: isUserLoggedIn,
      session: sessionData ? sessionData : null,
      user: userData ? userData : null,
      req, 
      res,
      db,
    }
  }
};

/*
 * 
 * 
 * 
 * Kontext hat alle relevanten userspezifischen Informationen wird bei jeder Req gecheckt
 * => nur auth kann auch protectedProcedure aufrufen, 
 * d.h nur wenn sessionID cookie vorhanden und valide, dann Zugriff auf protectedProcedure calls
 * Cookie wird NUR nach Login verliehen mit 24h Gültigkeit, genau wie Session
 * 
 * 
 * 
*/

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

export const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.isUserLoggedIn) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }

  return next({
    ctx: {
      ...ctx
    }
  });
});

export const isAdmin = t.middleware(({ctx, next}) => {
  if (!ctx.isUserLoggedIn || ctx.user?.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not logged in or not an Admin"
    }); 
  }

  return next({
      ctx: {
        ...ctx
      }
    })
})

export const publicProcedure = t.procedure.use(timingMiddleware); // fetchen von Daten / Produkten / öffentlicher Content

export const protectedProcedure = t.procedure.use(isAuthenticated).use(timingMiddleware); // ProtectedProcedure, für Authentifizierung, erstellung von Orders etc. - fetchen von privaten Daten 

export const adminProcedure = t.procedure.use(isAdmin).use(timingMiddleware); // FÜr alle Admin-Procedures / API calls
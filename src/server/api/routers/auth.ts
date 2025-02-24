import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { parse, serialize } from "cookie";

const sessionDuration = 1000 * 60 * 60 * 24; // 1 day in ms for session

export const authRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(z.object({ email: z.string(), password: z.string(), name: z.string(), surname: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!input.email || !input.password || !input.name) {
        throw new Error("Missing required fields");
      }

      const existingUser = await db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const newUser = await db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: "USER",
          surname: input.surname,
        },
      });

      const sessionId = generateSessionID();
      const currentDate = new Date();

      const session = await db.session.create({
        data: {
          sessionId,
          userId: newUser.id,
          expires: new Date(currentDate.getTime() + sessionDuration),
        },
      });

      console.log(session)

      ctx.res?.setHeader!("Set-Cookie", serialize("sessionId", sessionId, { httpOnly: true, secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development", sameSite: "strict", path: "/" }));

      return {
        message: "success",
        code: 201,
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      };
    }),

  loginUser: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!input.email || !input.password) {
        throw new Error("Missing required fields");
      }

      const user = await db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        throw new Error("User not found or incorrect password.");
      }

      const sessionId = generateSessionID();

      const session = await ctx.db.session.create({
        data: {
          sessionId,
          userId: user.id,
          expires: new Date(Date.now() + sessionDuration),
        },
      });

      // Set session cookie
      ctx.res?.setHeader!("Set-Cookie", serialize("sessionId", sessionId, { httpOnly: true, secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development", sameSite: "strict", path: "/" }));

      return {
        message: "success",
        code: 201,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    }),

  logoutUser: publicProcedure.mutation(async ({ ctx }) => {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const sessionId = cookies.sessionId;

    console.log("Session ID",sessionId)

    if (sessionId) {
      await db.session.delete({
        where: {
          sessionId: sessionId,
        },
      });

      ctx.res.setHeader('Set-Cookie', `sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);

      return {
        message: "success",
        code: 200,
      };
    }

    throw new Error("Session not found");
  }),

  deleteUser: protectedProcedure
    .input(z.object({  }))
    .mutation(async ({ ctx }) => {
      if (!ctx.user?.email) {
        throw new Error("Missing required fields");
      }

      const user = await db.user.findUnique({
        where: {
          email: ctx.user?.email,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await db.user.delete({
        where: {
          id: user.id,
        },
      });

      return {
        message: "success",
        code: 200,
      };
    }),

  getUser: publicProcedure.query(async ({ ctx }) => {
    return {user: ctx.user, session: ctx.session, isUserLoggedIn: ctx.isUserLoggedIn};
  }),
});

function generateSessionID() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

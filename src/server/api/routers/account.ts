import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { parse, serialize } from "cookie";
import { TRPCError } from "@trpc/server";


export const accountRouter = createTRPCRouter({
    getUserOrders: protectedProcedure
    .query(async ({ ctx }) => {
        if (!ctx.user) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const userOrders = await db.order.findMany({
            where: {
                userId: ctx.user.id,
            },
            include: {
                products: true, 
              },
        });

        console.log(userOrders)

        return userOrders;
    }),
});
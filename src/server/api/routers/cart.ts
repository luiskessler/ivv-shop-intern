import { z } from "zod";
import { parse, serialize } from "cookie";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const cartRouter = createTRPCRouter({
  addNewItemToCart: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        colorVariant: z.string(),
        size: z.string(),
        orderQuantity: z.number(),
        imageURL: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {

      const cookies = parse(ctx.req.headers.cookie ?? "");
      let cart: any[] = [];

      if (cookies.cart) {
        try {
          cart = JSON.parse(decodeURIComponent(cookies.cart));
        } catch (error) {
          console.error("Error parsing cart from cookies:", error);
        }
      }

      const existingItem = cart.find(
        (item) =>
          item.id === input.id &&
          item.colorVariant === input.colorVariant &&
          item.size === input.size
      );

      if (existingItem) {
        existingItem.orderQuantity += input.orderQuantity;
      } else {
        cart.push({
          id: input.id,
          name: input.name,
          price: input.price,
          size: input.size,
          colorVariant: input.colorVariant,
          orderQuantity: input.orderQuantity,
          imageURL: input.imageURL,
        });
      }

      ctx.res?.setHeader(
        "Set-Cookie",
        serialize("cart", encodeURIComponent(JSON.stringify(cart)), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          path: "/",
        })
      );

      return { success: true, cart };
    }),

  removeItemFromCart: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        colorVariant: z.string(),
        size: z.string(),
        orderQuantity: z.number(),
        imageURL: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {

      const cookies = parse(ctx.req.headers.cookie ?? "");
      let cart: any[] = [];

      if (cookies.cart) {
        try {
          cart = JSON.parse(decodeURIComponent(cookies.cart));
        } catch (error) {
          console.error("Error parsing cart from cookies:", error);
        }
      }

      const existingItemIndex = cart.findIndex(
        (item) =>
          item.id === input.id &&
          item.colorVariant === input.colorVariant &&
          item.size === input.size
      );

      if (existingItemIndex !== -1) {
        cart.splice(existingItemIndex, 1);
      }

      ctx.res?.setHeader(
        "Set-Cookie",
        serialize("cart", encodeURIComponent(JSON.stringify(cart)), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          path: "/",
        })
      );

      return { success: true, cart };
    }),

  getCartCookie: publicProcedure
  .query(async ({ctx}) => {
    const cookies = parse(ctx.req.headers.cookie ?? "")
    const cartCookie = cookies.cart

    if (!cartCookie) {
      return null
    }
    try {
      return JSON.parse(decodeURIComponent(cartCookie))
    } catch (error) {
      console.error("Error parsing cart from cookies:", error);
      return null
    }
  }),

  getCartItems: publicProcedure
  .query(async ({ctx}) => {
    const cookies = parse(ctx.req.headers.cookie ?? '')
    const cartCookie = cookies.cart

    if (!cartCookie) {
      return []
    }

    try {
      const cartItems = JSON.parse(decodeURIComponent(cartCookie)) 
      return cartItems  
    } catch (error) {
      console.error("Error parsing cart from cookies:", error);
      return []
    }
  })  
});

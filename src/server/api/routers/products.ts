import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { ColorVariant } from "~/types";
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  createNewProduct: adminProcedure
    .input(z.object({
        name: z.string(),
        imageURLs: z.array(z.string()).optional(),
        description: z.string(),
        price: z.number(),
        isFeatured: z.boolean(),
        category: z.string(),
        size: z.array(z.string()),
        colorVariant: z.array(
          z.object({
            name: z.string(),
            hex: z.string(),
            imageURL: z.string(),
          })
        ),
     }))
    .mutation(async ({ input, ctx }) => {
        return ctx.db.product.create({
            data: {
                name: input.name,
                imageURLs: input.imageURLs || ["https://placehold.co/400x400/", "https://placehold.co/400x400/"],
                description: input.description,
                price: input.price,
                category: input.category,
                size: input.size,
                colorVariant: input.colorVariant,
            },
        });
    }),

  
  getAllProducts: publicProcedure
    .query(async ({ ctx }) => {
      const products = await ctx.db.product.findMany();
      
      const formattedProducts = products.map(product => {
        return {
          ...product,
          colorVariant: Array.isArray(product.colorVariant)
          ? (product.colorVariant as unknown as ColorVariant[]).map((item) => ({
              name: item.name,
              hex: item.hex,
              imageURL: item.imageURL,
            }))
          : [],


          imageURLs: Array.isArray(product.imageURLs)
            ? product.imageURLs.map(url => url) 
            : [], 
          size: Array.isArray(product.size)
            ? product.size.map(size => size) 
            : [],
        };
      });
  
      console.log(formattedProducts);
  
      return formattedProducts;
    }), 

    
    getProduct: publicProcedure
    .input(z.object({
      productID: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      console.log(input.productID);
  
      const product = await ctx.db.product.findUnique({
        where: {
          id: input.productID,
        },
      });
  
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
  
      // Format the product data
      const formattedProduct = {
        ...product,
        colorVariant: Array.isArray(product.colorVariant)
          ? (product.colorVariant as unknown as ColorVariant[]).map((item) => ({
              name: item.name,
              hex: item.hex,
              imageURL: item.imageURL,
            }))
          : [],
  
        imageURLs: Array.isArray(product.imageURLs)
          ? product.imageURLs.map((url) => url)
          : [],
  
        size: Array.isArray(product.size) ? product.size.map((size) => size) : [],
      };
  
      return formattedProduct;
    }),
  

});
import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { ColorVariant } from "~/types";
import { TRPCError } from "@trpc/server";
import { s3 } from "~/server/s3";

export const productRouter = createTRPCRouter({
  createNewProduct: adminProcedure
    .input(z.object({
        name: z.string(),
        imageURLs: z.array(z.string()),
        description: z.string(),
        price: z.number(),
        category: z.string(),
        size: z.array(z.string()),
        colorVariant: z.array(
          z.object({
            name: z.string(),
            hex: z.string(),
          })
        ),
     }))
    .mutation(async ({ input, ctx }) => {
        return ctx.db.product.create({
            data: {
                name: input.name,
                imageURLs: input.imageURLs!,
                description: input.description,
                price: input.price,
                category: input.category,
                size: input.size,
                colorVariant: input.colorVariant,
            },
        });
    }),
  
    createPresignedURL: adminProcedure
    .input(z.object({
      fileName: z.string(),
      fileType: z.string(),
      expiresIn: z.number().optional().default(60 * 5),
    }))
    .query(async ({ input }) => {
      const { fileName, fileType, expiresIn } = input;
  
      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `product-images/${fileName}`,
        Expires: expiresIn,
        ContentType: fileType,
        ACL: 'public-read',
      };
  
      try {
        const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
        return { uploadURL };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate presigned URL",
        });
      }
    }),
  
  
  getAllProducts: adminProcedure
    .query(async ({ ctx }) => {
      const products = await ctx.db.product.findMany();
      
      const formattedProducts = products.map(product => {
        return {
          ...product,
          colorVariant: Array.isArray(product.colorVariant)
          ? (product.colorVariant as unknown as ColorVariant[]).map((item) => ({
              name: item.name,
              hex: item.hex,
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
  
      
      const formattedProduct = {
        ...product,
        colorVariant: Array.isArray(product.colorVariant)
          ? (product.colorVariant as unknown as ColorVariant[]).map((item) => ({
              name: item.name,
              hex: item.hex,
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
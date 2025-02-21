import { Product } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import QRCode from "qrcode"
import { SEPAQRCode } from "~/types";

const productSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    size: z.string(),
    colorVariant: z.string(),
  }),
  order_quantity: z.number(),
});

export const checkoutRouter = createTRPCRouter({
  createNewCheckout: protectedProcedure
    .input(z.object({ products: z.array(productSchema) }))
    .mutation(async ({ input, ctx }) => {
      const products = input.products;

      const existingOrder = await ctx.db.order.findFirst({
        where: {
          userId: ctx.user?.id,
          status: "OPEN",
        },
      });

      if (existingOrder) {
        throw new Error("Sie haben bereits eine offene Bestellung, bitte warten Sie zunächst bis diese Bestellung bearbeitet ist, bevor Sie eine neue erstellen.!");
      }

      const order_id = createNewOrderID();
      const payment_reference = createNewPaymentReference({
        user_name: ctx.user?.name!,
        user_surname: ctx.user?.surname!,
        order_id,
      });

      const totalPrice = products.reduce((acc, product) => acc + product.product.price * product.order_quantity, 0);
      
      console.log(totalPrice)

      const qrCode = await generateQRCodeForPayment({
        paymentID: payment_reference,
        totalPrice,
      });
      
      const productsData = products.map((product) => ({
        productId: product.product.id,
        productName: product.product.name,
        color: product.product.colorVariant,
        size: product.product.size,
        quantity: product.order_quantity,
        price: product.product.price
      }));

      const order = await ctx.db.order.create({
        data: {
          userId: ctx.user?.id!,
          status: "OPEN",
          paymentID: payment_reference,
          order_number: order_id,
          products: {
            create: productsData,
          },
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      ctx.res.setHeader('Set-Cookie', `cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);

      return {
        message: "success",
        code: 201,
        checkoutLink: qrCode,
        order: order,
      }
    }),
});

function createNewOrderID() {
  return Math.random().toString(36).substring(2, 15).toString();
}

function createNewPaymentReference({
  user_name,
  user_surname,
  order_id,
}: {
  user_name: string;
  user_surname: string;
  order_id: string;
}) {
  return "ivv-intern" + "-" + user_name + user_surname + "-" + order_id;
}
async function generateQRCodeForPayment({
  paymentID,
  totalPrice,
}: {
  paymentID: string;
  totalPrice: number;
}): Promise<string> {
  const recipientName = "Max Mustermann";
  const recipientIBAN = "DE44500105175407324931";
  const recipientBIC = "INGDDEFFXXX"; // Optional
  const currency = "EUR";
  const amount = totalPrice.toFixed(2); // Immer mit zwei Nachkommastellen

  const qrCodeData = `BCD\n001\n1\nSCT\n${recipientName}\n${recipientIBAN}\n${recipientBIC}\n${currency}${amount}\n\n${paymentID}\n\n`;

  return await QRCode.toDataURL(qrCodeData, { errorCorrectionLevel: "M" });
}
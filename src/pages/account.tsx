import React from "react";
import Navbar from "~/components/navbar";
import { api } from "~/utils/api";

export default function Home() {
  const userOrders = api.account.getUserOrders.useQuery();

  return (
    <div className="flex h-fit flex-col space-y-[10vh] py-[6vh]">
      <Navbar />
      <div className="container h-screen gap-2 space-y-[10vh] md:w-[95%]">
        <p>Deine Bestellungen:</p>
        {userOrders.data?.map((order) => {
          const totalPrice = order.products.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0,
          );

          return (
            <div
              key={order.id}
              className="flex h-fit w-full flex-col gap-4 border-t p-2"
            >
              <div>
                <div className="flex w-full justify-between">
                  <p className="text-xl font-medium">
                    Bestellung #{order.order_number}
                  </p>
                  <p className="text-lg font-semibold">
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <p>
                  Bestellt am: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col">
                {order.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-2">
                    <p>{product.quantity}x </p>
                    <p className="text-lg">{product.productName}</p>
                    <p className="text-lg">${product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
        {userOrders.data?.map((order) => (
          <div key={order.id} className="h-[15vh] w-full rounded-lg border p-4">
            <p className="text-lg">Bestellung #{order.order_number}</p>
            {order.products.map((product) => (
              <div key={product.id} className="flex items-center gap-2">
                <p>{product.quantity}x </p>
                <p className="text-lg">{product.productName}</p>
                <p className="text-lg">${product.price}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

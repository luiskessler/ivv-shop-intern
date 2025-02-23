import { TrashIcon } from "lucide-react";
import React from "react";
import Navbar from "~/components/navbar";
import { api } from "~/utils/api";

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  colorVariant: string;
  orderQuantity: number;
  imageURL: string;
}

export default function Home() {
  const [responseQRCode, setResponseQRCode] = React.useState<string>("");

  const { data: cartItems = [] } = api.cart.getCartItems.useQuery();

  const totalPrice = cartItems.reduce(
    (acc: any, item: CartItem) => acc + item.price * item.orderQuantity,
    0,
  );

  const totalItems = cartItems.length;

  const checkoutMutation = api.checkout.createNewCheckout.useMutation();
  const removeFromCartMutation = api.cart.removeItemFromCart.useMutation();

  const handleCheckout = async () => {
    const products = cartItems.map((item: CartItem) => ({
      product: {
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        colorVariant: item.colorVariant,
      },
      order_quantity: item.orderQuantity,
    }));

    const res = await checkoutMutation.mutateAsync({ products });

    setResponseQRCode(res.checkoutLink);
  };

  const removeItem = (item: CartItem) => {
    removeFromCartMutation.mutate(item);
  };

  return (
    <div className="flex h-fit flex-col space-y-[10vh] py-[6vh]">
      <Navbar />
      <div className="container flex grid-cols-5 flex-col gap-4 space-y-[10vh] md:w-[95%] xl:grid xl:space-y-0">
        {!responseQRCode ? (
          <>
            <div className="col-span-4 flex h-full flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <p className="text-2xl">Warenkorb</p>
                <p>{totalItems} Items</p>
              </div>
              <div className="mb-2 w-full border-b"></div>
              <div className="flex flex-col gap-4">
                {cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="aspect-square w-[20%] bg-black">
                      <img
                        src={item.imageURL}
                        className="h-full w-full object-cover"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex w-full items-center justify-between">
                        <p className="text-xl font-medium">{item.name}</p>
                        <p className="text-lg font-medium">
                          {(item.price * item.orderQuantity).toLocaleString(
                            "de-DE",
                            {
                              style: "currency",
                              currency: "EUR",
                            },
                          )}
                        </p>
                      </div>
                      <div className="flex w-full justify-between border">
                        <div className="flex w-fit flex-col gap-4 border">
                          {item.size && item.colorVariant && (
                            <div className="flex flex-col gap-1">
                              <p>{item.size.toUpperCase()}</p>
                              <p>{item.colorVariant}</p>
                            </div>
                          )}
                          <div className="flex w-fit flex-col gap-2 pt-2">
                            <label htmlFor="quantity">Menge:</label>
                            <input
                              type="number"
                              name="quantity"
                              min={1}
                              max={10}
                              value={item.orderQuantity}
                              //onChange={(e) => setQuantity(Number(e.target.value))}
                              accept="number"
                              id="quantity"
                              className="h-10 rounded-md border px-2 shadow-md"
                            />
                          </div>{" "}
                        </div>
                        <div className="flex items-end justify-end">
                          <button onClick={() => removeItem(item)}>
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-1 flex h-full w-full flex-col items-start justify-start gap-2 px-2 xl:border-l">
              <div className="flex w-full items-end justify-between">
                <p className="text-2xl">Gesamt</p>
                <p className="text-lg font-medium">
                  {totalPrice.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
              <div className="mb-2 w-full border-b"></div>
              <button
                onClick={() => handleCheckout()}
                className="h-10 w-full rounded-md bg-[#0055A6] px-4 text-lg text-white"
              >
                Bezahl QR-Code
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="col-span-full flex h-full w-full flex-col items-center justify-center">
              <h3>
                Nur noch ein kleiner Schritt - der QR Code generiert automatisch
                ein SEPA Lastschriftmandat und leitet dich zu deiner
                Online-Banking App
              </h3>
              <img src={responseQRCode} alt="QR Code" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

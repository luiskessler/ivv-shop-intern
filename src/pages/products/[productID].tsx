import { useRouter } from "next/router";
import React, { useState } from "react";
import Navbar from "~/components/navbar";
import { api } from "~/utils/api";
import Carousel from "react-bootstrap/Carousel";
import { ColorVariant } from "~/types";
import { z } from "zod";
import { CalendarDays } from "lucide-react";

export default function Home() {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<ColorVariant>();
  const [quantity, setQuantity] = useState<number>(1);

  const router = useRouter();
  const { productID } = router.query;

  const productData = api.products.getProduct.useQuery(
    {
      productID: Array.isArray(productID)
        ? productID[0]!
        : productID?.toString()!,
    },
    {
      enabled: !!productID,
    },
  );

  const addToCartMutation = api.cart.addNewItemToCart.useMutation();

  const quantitySchema = z
    .string()
    .min(1, "Quantity cannot be empty")
    .regex(/^\d+$/, "Quantity must be a number")
    .transform(Number); // To convert the string to a number after validation

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = quantitySchema.safeParse(quantity.toString());

    if (!result.success) {
      alert(`Validation error: ${result.error.errors[0]!.message}`);
    } else {
      addToCartMutation.mutate({
        id: productData.data!.id,
        name: productData.data!.name,
        price: productData.data!.price,
        colorVariant: selectedColor?.name!,
        size: selectedSize,
        orderQuantity: quantity,
        imageURL: productData.data!.imageURLs[0]!.toString(),
      });
    }
  };

  return (
    <div className="flex h-fit flex-col space-y-[10vh] py-[6vh]">
      <Navbar />
      <div className="container grid h-full grid-cols-3 border md:w-[95%]">
        <div className="col-span-1 h-full border">
          <Carousel
            interval={3500}
            indicators={false}
            className="aspect-square overflow-hidden"
          >
            {productData.data &&
              productData.data.imageURLs.map((imageURL) => (
                <Carousel.Item
                  className="h-full w-full bg-black"
                  key={imageURL!.toString()}
                >
                  <img
                    src={imageURL!.toString()}
                    alt={productData.data.name}
                    className="aspect-square w-full border object-cover"
                  ></img>
                </Carousel.Item>
              ))}
          </Carousel>
        </div>
        <div className="col-span-2 flex flex-col space-y-4 px-8 py-4">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-1">
              <h1 className="text-3xl">{productData.data?.name}</h1>
              <p className="text-xl font-medium text-[#0055A6]">
                {productData.data?.price}€
              </p>
            </div>
            <p className="text-[#8b8b8b]">{productData.data?.description}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col border-t pt-4">
              <div className="flex flex-col gap-2">
                <p>Farbe:</p>
                <div className="flex gap-1">
                  {productData.data?.colorVariant?.map((colorVariant) => (
                    <button
                      type="button"
                      onClick={() => setSelectedColor(colorVariant)}
                      style={{ backgroundColor: colorVariant.hex }}
                      className={`size-6 rounded-full border ${selectedColor === colorVariant ? "border-black" : ""}`}
                    ></button>
                  ))}{" "}
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <p>Größe:</p>
                <div className="flex flex-wrap gap-4">
                  {productData.data?.size?.map((size) => (
                    <label
                      key={size?.toString()!}
                      className={`relative inline-block h-10 min-w-20 cursor-pointer rounded-full ${
                        selectedSize === size?.toString()
                          ? "border-2 border-black"
                          : "border border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="size"
                        value={size?.toString()}
                        onClick={() => setSelectedSize(size?.toString()!)}
                        className="absolute h-0 w-0 opacity-0"
                      />
                      <div
                        className={`flex h-full w-full items-center justify-center rounded-full ${
                          selectedSize === size?.toString()
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        } shadow-md transition-all`}
                      >
                        {size?.toString().toUpperCase()}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex w-full items-end gap-2">
                <div className="flex w-1/2 flex-col gap-2 pt-2">
                  <label htmlFor="quantity">Menge:</label>
                  <input
                    type="number"
                    name="quantity"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    accept="number"
                    id="quantity"
                    className="h-10 rounded-md border px-2 shadow-md"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 w-1/2 rounded-md bg-black px-2 text-white"
                >
                  Zum Warenkorb hinzufügen
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

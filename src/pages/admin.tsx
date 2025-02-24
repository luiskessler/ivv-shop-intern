import { X } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ImageUpload } from "~/components/imageUpload";
import KeywordsInput from "~/components/keywordInput";
import Navbar from "~/components/navbar";
import { ColorVariant, Product } from "~/types";

import { api } from "~/utils/api";

interface Tab {
  name: string;
  component: React.FC;
}

const ProductsComponent = () => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] =
    useState<boolean>(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSizes, setProductSizes] = useState<string[]>([]);
  const [productColorVariants, setProductColorVariants] = useState<
    ColorVariant[]
  >([]);
  const [productImageURLs, setProductImageURLs] = useState<string[]>([]);

  const { data: products, isLoading: isProductsLoading } =
    api.products.getAllProducts.useQuery();

  const productMutation = api.products.createNewProduct.useMutation();

  const createProduct = async () => {
    const newProduct = {
      name: productName,
      description: productDescription!,
      price: parseFloat(productPrice!),
      category: productCategory!,
      size: productSizes!,
      colorVariant: productColorVariants!,
      imageURLs: productImageURLs!,
    };

    productMutation.mutate(newProduct);
    setIsAddProductModalOpen(false);
  };

  return (
    <>
      {isAddProductModalOpen && (
        <div className="fixed left-0 top-0 z-[9999999] flex h-screen w-full items-center justify-center bg-black/30 backdrop-blur-md">
          <div className="relative flex h-fit w-[50vw] flex-col gap-4 rounded-md bg-white p-4 shadow-lg">
            <button
              onClick={() => setIsAddProductModalOpen(false)}
              className="absolute right-2 top-2"
            >
              <X size={20} />
            </button>
            <p>Neues Produkt hinzufügen</p>
            <ImageUpload
              onImageUpload={(uploadedImageUrl) => {
                setProductImageURLs((prevURLs) => [
                  ...prevURLs,
                  uploadedImageUrl,
                ]);
              }}
            />
            <div className="grid grid-cols-3 gap-x-2 gap-y-4">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Name"
                className="col-span-1 h-fit min-h-11 w-full rounded-md border px-2 shadow-lg"
              />
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Preis"
                className="min-h-11 w-full rounded-md border px-2 shadow-lg"
              />
              <input
                type="text"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                placeholder="Kategorie"
                className="min-h-11 w-full rounded-md border px-2 shadow-lg"
              />
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Beschreibung"
                className="col-span-full row-start-2 resize-none rounded-md p-2 shadow-lg"
                rows={5}
              ></textarea>
              <div className="col-span-3">
                <KeywordsInput
                  onKeywordsChange={(keywords) => setProductSizes(keywords)}
                  unique
                  placeholder="Größen"
                />
              </div>

              <div className="col-span-3">
                <button
                  onClick={() =>
                    setProductColorVariants([
                      ...productColorVariants,
                      { name: "New Color", hex: "#FFFFFF" },
                    ])
                  }
                  className="min-h-11 w-full rounded-md border px-2 shadow-lg"
                >
                  Add Color Variant
                </button>
                {productColorVariants.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) =>
                        setProductColorVariants(
                          productColorVariants.map((variant, i) =>
                            i === index
                              ? { ...variant, name: e.target.value }
                              : variant,
                          ),
                        )
                      }
                      className="rounded-md border px-2"
                      placeholder="Color Name"
                    />
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) =>
                        setProductColorVariants(
                          productColorVariants.map((variant, i) =>
                            i === index
                              ? { ...variant, hex: e.target.value }
                              : variant,
                          ),
                        )
                      }
                      className="rounded-md border"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={createProduct}
              className="min-h-11 w-full rounded-md bg-blue-500 text-white shadow-lg"
            >
              Create Product
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={() => setIsAddProductModalOpen(true)}
          className="flex h-10 w-full items-center justify-center rounded-md border text-center shadow-lg"
        >
          Neues Produkt hinzufügen
        </button>

        {products && !isProductsLoading && (
          <div className="grid grid-cols-1 gap-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative flex h-fit items-center rounded-md border p-2"
              >
                <div className="ml-4 flex flex-col justify-center">
                  <p className="text-xl font-bold">{product.name}</p>
                  <p>{product.price}€</p>
                  <p className="text-sm">{product.description}</p>
                  <p className="text-sm">Kategorie: {product.category}</p>
                  <p className="text-sm">Größen: {product.size.join(", ")}</p>
                  <p className="text-sm">
                    Farben:{" "}
                    {product.colorVariant.map((color) => color.name).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const OrdersComponent = () => {
  const { data: orders, isLoading: isOrdersLoading } =
    api.account.getAllOrders.useQuery();

  if (isOrdersLoading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {orders &&
        orders.map((order) => {
          const totalPrice = order.products.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0,
          );

          return (
            <div
              key={order.id}
              className="flex w-full flex-col gap-4 rounded-md border p-4"
            >
              <div className="flex w-full justify-between">
                <h3 className="text-lg font-bold">
                  Bestellung #{order.order_number}
                </h3>
                <div className="flex items-center gap-4">
                  <p>Status: {order.status}</p>
                  <p>
                    Gesamt:{" "}
                    {totalPrice.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
              </div>
              <p>Bezahlbetreff: {order.paymentID}</p>
              <div>
                <h4>Produkte:</h4>
                {order.products.map((product) => (
                  <div key={product.id}>
                    <p>
                      {product.quantity}x {product.productName}, {product.color}
                      , {product.size}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

const tabs: Tab[] = [
  {
    name: "Produkte",
    component: ProductsComponent,
  },
  {
    name: "Bestellungen",
    component: OrdersComponent,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = React.useState<Tab>(tabs[0]!);

  return (
    <div className="flex h-fit flex-col space-y-[10vh] py-[6vh]">
      <Navbar />
      <div className="container h-screen gap-2 space-y-[10vh] md:w-[95%]">
        <div className="flex h-10 w-full gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab)}
              className={`w-fit ${
                activeTab.name === tab.name ? "underline" : ""
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div className="h-full w-full">
          <activeTab.component />
        </div>
      </div>
    </div>
  );
}

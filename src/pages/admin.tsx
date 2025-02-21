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
  const [selectedProduct, setSelectedProduct] = React.useState<Product>();
  const [isAddProductModalOpen, setIsAddProductModalOpen] =
    React.useState<boolean>(false);

  const { data: products, isLoading: isProductsLoading } =
    api.products.getAllProducts.useQuery();

  return (
    <>
      {isAddProductModalOpen && (
        <AddProductModalComponent
          setIsAddProductModalOpen={setIsAddProductModalOpen}
        />
      )}
      <div className="grid h-full w-full grid-cols-4 gap-2">
        <div className="col-span-1">
          <button
            onClick={() => setIsAddProductModalOpen(!isAddProductModalOpen)}
            className="flex h-10 w-full items-center justify-center rounded-md border text-center shadow-lg"
          >
            Neues Produkt hinzufügen
          </button>
          {products && (
            <>
              {products.map((product) => {
                return (
                  <Link
                    href={`/products/${product.id}`}
                    key={product.id}
                    className="relative col-span-1 h-fit"
                  >
                    <img
                      src={product.imageURLs[0]?.toString()!}
                      className="aspect-square w-full rounded-sm object-cover"
                      alt={product.name}
                    />

                    <div className="absolute left-2 top-2 flex gap-2">
                      {product.colorVariant.map((colorVariant) => (
                        <Link
                          href={`/products/${product.id}?color=${colorVariant.name.toLowerCase()}`}
                          key={colorVariant.name}
                          className="h-6 w-6 rounded-full"
                          style={{
                            backgroundColor: colorVariant.hex,
                          }}
                        ></Link>
                      ))}
                    </div>

                    <div className="z-[999] flex h-fit w-full flex-col items-start justify-start p-2 backdrop-blur-2xl">
                      <p className="text-2xl">{product.name}</p>
                      <p>{product.price}€</p>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>
        <div className="col-span-3 border"></div>
      </div>
    </>
  );
};

const OrdersComponent = () => {
  return <div></div>;
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

const AddProductModalComponent = ({
  setIsAddProductModalOpen,
}: {
  setIsAddProductModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSizes, setProductSizes] = useState<string[]>([]);
  const [productColorVariants, setProductColorVariants] = useState<
    ColorVariant[]
  >([]);

  return (
    <div className="fixed left-0 top-0 z-[9999999] flex h-screen w-full items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="relative flex h-fit w-[50vw] flex-col gap-4 rounded-md bg-white p-4 shadow-lg">
        <button
          onClick={() => setIsAddProductModalOpen(false)}
          className="absolute right-2 top-2"
        >
          <X size={20} />
        </button>
        <p>Neues Produkt hinzufügen</p>
        <ImageUpload />
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
            id="produktpreis"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            name="produktpreis"
            min="1"
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
            name="produktbeschreibung"
            id="produktbeschreibung"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Beschreibung"
            className="col-span-full row-start-2 resize-none rounded-md p-2 shadow-lg"
            rows={5}
          ></textarea>
          <div className="col-span-3">
            <KeywordsInput
              onKeywordsChange={(keywords) => console.log(keywords)}
              unique
              placeholder="Größe"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /*
  export default function Home() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [surname, setSurname] = React.useState("");

  const [selectedProduct, setSelectedProduct] = React.useState<string>();
  const [selectedSize, setSelectedSize] = React.useState<string>();
  const [selectedColor, setSelectedColor] = React.useState<ColorVariant>();
  const [quantity, setQuantity] = React.useState<number>();

  const user = api.auth.getUser.useQuery();

  const loginUser = api.auth.loginUser.useMutation();
  const registerUser = api.auth.registerUser.useMutation();
  const logoutUser = api.auth.logoutUser.useMutation();

  const checkOutMutation = api.checkout.createNewCheckout.useMutation();

  const handleUserLogin = async () => {
    const res = await loginUser.mutateAsync({
      email: email,
      password: password,
    });

    console.log(res);
  };

  const handleUserRegister = async () => {
    const res = await registerUser.mutateAsync({
      email: email,
      password: password,
      name: name,
      surname: surname,
    });
    console.log(res);
  };

  const handleUserLogout = async () => {
    const res = await logoutUser.mutateAsync();
    console.log(res);
  };

  const { data: productsData, isLoading } =
    api.products.getAllProducts.useQuery();

  const handleCheckout = async () => {
    if (!selectedProduct || !selectedSize || !selectedColor || !quantity) {
      alert("Bitte alle Felder ausfüllen");
      return;
    }

    checkOutMutation.mutate({
      products: [
        {
          product: {
            id: selectedProduct!, // id als Teil des product-Objekts
            name: productsData?.find((p) => p.id === selectedProduct)?.name!,
            price: productsData?.find((p) => p.id === selectedProduct)?.price!,
            size: selectedSize!, // Beispiel für Größen
            colorVariant: {
              name: selectedColor!.name,
              hex: selectedColor!.hex,
            },
          },
          order_quantity: quantity!, // Füge order_quantity hinzu, wenn benötigt
        },
      ],
    });
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-col items-center justify-center space-y-4 bg-white">
        {user && <h1>Hallo {user.data?.user?.name!}</h1>}

        <form action="#">
          <div className="flex flex-col space-y-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="h-10 rounded-md border px-4 shadow-lg"
              id="name"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="surname">Nachname</label>
            <input
              type="text"
              name="surname"
              onChange={(e) => setSurname(e.target.value)}
              value={surname}
              className="h-10 rounded-md border px-4 shadow-lg"
              id="surname"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="h-10 rounded-md border px-4 shadow-lg"
              id="password"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="h-10 rounded-md border px-4 shadow-lg"
              id="email"
            />
          </div>
        </form>
        <div className="flex gap-4">
          <button
            onClick={() => handleUserRegister()}
            className="h-10 rounded-full border px-4 shadow-lg"
          >
            Register
          </button>
          <button
            onClick={() => handleUserLogin()}
            className="h-10 rounded-full border px-4 shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => handleUserLogout()}
            className="h-10 rounded-full border px-4 shadow-lg"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col gap-4 pt-[5vh]">
          <div>Checkout Simulation</div>
          {/* <div>
            Produkte:
            {productsData?.map((product) => (
              <div key={product.id} className="flex flex-col">
                <div>{product.name}</div>
                <div>{product.price}</div>
                <div>{product.stock}</div>
                <div>{product.isFeatured ? "Featured" : ""}</div>
                <div>{product.category}</div>
                <div>{product.size?.toString()}</div>
                <div></div>
              </div>
            ))}
          </div>

          {selectedProduct && (
            <>
              <div className="flex gap-2">
                Selected Product:
                {selectedColor && selectedColor.name}
                {selectedSize && selectedSize}
                {selectedProduct}
              </div>
            </>
          )}

          <hr />

          <div className="flex flex-col space-y-1">
            <label htmlFor="name">Produkt</label>
            <select onChange={(e) => setSelectedProduct(e.target.value)}>
              {productsData?.map((product) => (
                <>
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                  <option key={"3"} value={"3"}>
                    3
                  </option>
                  <option key={"4"} value={"4"}>
                    4
                  </option>
                  <option key={"5"} value={"5"}>
                    5
                  </option>
                  <option key={"6"} value={"6"}>
                    6
                  </option>
                </>
              ))}
            </select>
          </div>
          <div>
            {selectedProduct && (
              <div>
                {(() => {
                  const product = productsData?.find(
                    (p) => p.id === selectedProduct,
                  );
                  if (product) {
                    return (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          {product.size.map((size) => (
                            <>
                              <button
                                className="h-10 min-w-16 rounded-full border px-4 shadow-lg"
                                onClick={() =>
                                  setSelectedSize(size?.toString())
                                }
                              >
                                {size?.toString()}
                              </button>
                            </>
                          ))}
                        </div>
                        <div className="flex w-full justify-between gap-4 border">
                          {product.colorVariant.map(
                            (colorVariant: ColorVariant) => (
                              <>
                                <button
                                  onClick={() => setSelectedColor(colorVariant)}
                                >
                                  <div
                                    className={`h-10 w-10 rounded-full border`}
                                    style={{
                                      backgroundColor: colorVariant.hex!,
                                    }}
                                  ></div>
                                </button>
                              </>
                            ),
                          )}
                        </div>
                      </div>
                    );
                  }
                  return <p>Produkt nicht gefunden</p>;
                })()}
              </div>
            )}
          </div>

          <button
            onClick={() => handleCheckout()}
            className="h-10 rounded-full border px-4 shadow-lg"
          >
            Simulate Checkout
          </button>
        </div>
      </main>
    </>
  );
} */
}

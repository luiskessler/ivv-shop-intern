import Image from "next/image";
import React, { useState } from "react";
import Navbar from "~/components/navbar";
import { api } from "~/utils/api";
import Carousel from "react-bootstrap/Carousel";
import { ListFilterPlus } from "lucide-react";
import { ColorVariant } from "~/types";
import { useRouter } from "next/router";
import Link from "next/link";
import FooterComponent from "~/components/footer";

export default function Home() {
  const router = useRouter();

  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = api.products.getAllProducts.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 3,
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const [filteredColors, setFilteredColors] = useState<ColorVariant[]>([]);
  const [filteredSizes, setFilteredSizes] = useState<string[]>([]);

  const handleAddFilterColor = (color: ColorVariant) => {
    setFilteredColors((prev) => [...prev, color]);
  };

  const handleRemoveFilterColor = (color: ColorVariant) => {
    setFilteredColors((prev) => prev.filter((c) => c.name !== color.name));
  };

  const handleAddFilterSize = (size: string) => {
    setFilteredSizes((prev) => [...prev, size]);
  };

  const handleRemoveFilterSize = (size: string) => {
    setFilteredSizes((prev) => prev.filter((s) => s !== size));
  };

  return (
    <>
      <div className="flex h-fit w-full flex-col items-center space-y-[10vh] overflow-x-hidden pt-[6vh]">
        <Navbar />
        <div className="container flex h-fit flex-col items-center md:w-[95%]">
          <Carousel
            interval={3500}
            indicators={false}
            className="aspect-video h-[80%] w-[80%] overflow-hidden"
          >
            {products &&
              products.flatMap((product) =>
                product.imageURLs.map((imageURL) => (
                  <Carousel.Item
                    className="h-full w-full bg-black"
                    key={imageURL!.toString()}
                  >
                    <img
                      src={imageURL!.toString()}
                      alt={product.name}
                      className="aspect-square w-full border object-cover"
                    ></img>
                  </Carousel.Item>
                )),
              )}
          </Carousel>
        </div>
        <div className="container flex h-fit flex-col items-center space-y-[4vh] overflow-hidden md:w-[95%]">
          <h2 className="text-4xl">Den ivv-Merch entdecken</h2>
          <div className="flex h-fit w-full flex-col gap-2 overflow-x-scroll border-b pb-3">
            <div className="flex w-full justify-start">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center gap-2"
              >
                Filter <ListFilterPlus size={18} />
              </button>
            </div>
            {isFiltersOpen && (
              <div className="flex w-full justify-between">
                {products && (
                  <>
                    {(() => {
                      const uniqueSizes = new Set<string>();
                      const uniqueColors = new Set<string>();

                      products.forEach((product) => {
                        product.size.forEach((size) =>
                          uniqueSizes.add(size!.toString()),
                        );
                      });

                      products.forEach((product) => {
                        product.colorVariant.forEach((color) =>
                          uniqueColors.add(color.hex),
                        );
                      });

                      return (
                        <>
                          <div className="flex gap-2">
                            {Array.from(uniqueSizes).map((size) => (
                              <button
                                onClick={() =>
                                  filteredSizes.includes(size)
                                    ? handleRemoveFilterSize(size)
                                    : handleAddFilterSize(size)
                                }
                                key={size}
                                className={`h-10 min-w-16 rounded-full border-2 px-4 shadow-sm ${filteredSizes.includes(size) ? "border-black" : ""}`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            {Array.from(uniqueColors).map((color) => (
                              <button
                                onClick={() =>
                                  filteredColors
                                    .map((c) => c.hex)
                                    .includes(color)
                                    ? handleRemoveFilterColor(
                                        products
                                          .find((p) =>
                                            p.colorVariant
                                              .map((c) => c.hex)
                                              .includes(color),
                                          )!
                                          .colorVariant.find(
                                            (c) => c.hex === color,
                                          )!,
                                      )
                                    : handleAddFilterColor(
                                        products
                                          .find((p) =>
                                            p.colorVariant
                                              .map((c) => c.hex)
                                              .includes(color),
                                          )!
                                          .colorVariant.find(
                                            (c) => c.hex === color,
                                          )!,
                                      )
                                }
                                key={color}
                              >
                                <div
                                  className={`size-6 rounded-full border-2 ${filteredColors.includes(filteredColors.find((c) => c.hex === color)!) ? "border-black" : ""}`}
                                  style={{
                                    backgroundColor: color,
                                  }}
                                ></div>
                              </button>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex h-full w-full flex-col">
            {/* {filteredColors.map((color) => (
              <div key={color.name} className="relative col-span-1 h-fit">
                {color.name}
              </div>
            ))}
            {filteredSizes.map((size) => (
              <div key={size} className="relative col-span-1 h-fit">
                {size}
              </div>
            ))} 
            
            NUR FÜR DEBUGGING
             
            */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products && (
                <>
                  {products.map((product) => {
                    const productSizeMatches =
                      filteredSizes.length === 0 ||
                      product.size.some((size) =>
                        filteredSizes.includes(size?.toString()!),
                      );

                    const productColorMatches =
                      filteredColors.length === 0 ||
                      product.colorVariant.some((color) =>
                        filteredColors.includes(color),
                      );

                    if (productSizeMatches && productColorMatches) {
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
                    }

                    return null; // Falls das Produkt keinem der ausgewählten Filter entspricht, wird es nicht angezeigt (gilt nicht wenn mehrere Filter ausgewählt sind aber nur ein paar zutreffen)
                  })}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="container flex h-[50vh] flex-col items-center justify-center rounded-md border bg-gray-200 md:w-[95%]">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-2xl">Probleme mit der Bestellung?</p>
            <a href="mailto:info@ivv-online.de" className="text-lg underline">
              info@ivv-online.de
            </a>
          </div>
        </div>
        <FooterComponent />
      </div>
    </>
  );
}

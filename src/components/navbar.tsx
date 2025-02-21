import React from "react";
import Logo from "./ui/logo";
import Link from "next/link";

import { Search, ShoppingCart, User } from "lucide-react";
import Cart from "./cart";

const categories = [
  { id: 1, name: "Alle Produkte", path: "/products" },
  { id: 2, name: "Kleidung", path: "/products?category=2?item=1" },
  { id: 3, name: "Kleidung", path: "/" },
  { id: 4, name: "Kleidung", path: "/" },
  { id: 5, name: "Kleidung", path: "/" },
];

export default function Navbar() {
  return (
    <div className="container flex h-[8vh] w-full items-center justify-between md:w-[95%]">
      <Link
        href={"/"}
        className="flex aspect-video h-full flex-col items-center justify-center"
      >
        <Logo />
      </Link>
      <ul className="flex gap-4">
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={category.path}>{category.name}</Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        <Search size={20} />
        <Link href={"/account"}>
          <User size={20} />
        </Link>
        <Cart />
      </div>
    </div>
  );
}

import React from "react";
import Logo from "./ui/logo";
import Link from "next/link";

import { Search, ShoppingCart, User } from "lucide-react";
import Cart from "./cart";

export default function Navbar() {
  return (
    <div className="container flex h-[8vh] w-full items-center justify-between md:w-[95%]">
      <Link
        href={"/"}
        className="flex aspect-video h-full flex-col items-center justify-center"
      >
        <Logo />
      </Link>

      <div className="flex items-center gap-4">
        <Link href={"/account"}>
          <User size={20} />
        </Link>
        <Cart />
      </div>
    </div>
  );
}

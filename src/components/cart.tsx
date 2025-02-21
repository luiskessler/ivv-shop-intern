import { parse } from "cookie";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { api } from "~/utils/api";

export default function Cart() {
  const [cartCount, setCartCount] = useState(0);
  const cartCookie = api.cart.getCartCookie.useQuery();

  useEffect(() => {
    if (cartCookie.data) {
      setCartCount(cartCookie.data.length);
    }
  }, [cartCookie.data]);

  return (
    <Link href={"/cart"} className="flex items-center gap-2">
      <ShoppingCart size={20} />
      <span className="">({cartCount} Items)</span>
    </Link>
  );
}

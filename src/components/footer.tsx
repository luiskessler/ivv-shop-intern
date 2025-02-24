import React from "react";
import Logo from "./ui/logo";
import Link from "next/link";

export default function FooterComponent() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="h-[10vh] w-full justify-between border-t p-2 px-4 lg:flex-row">
      <Link
        href={"/"}
        className="flex aspect-video h-full flex-col items-center justify-center"
      >
        <Logo />
      </Link>
      <ul className="flex flex-col items-center gap-4 text-sm lg:flex-row">
        <li>
          <Link href={"https://ivv.de/de/Datenschutz"}>Datenschutz</Link>
        </li>
        <li>
          <Link href={"https://ivv.de/de/Impressum"}>Impressum</Link>
        </li>
        <li>
          <Link href={"https://ivv.de/de/ivv%20Comliance.pdf"}>
            ivv Compliance
          </Link>
        </li>
        <li>© {currentYear && currentYear} ivv GmbH</li>
      </ul>
    </div>
  );
}

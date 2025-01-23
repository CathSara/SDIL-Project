"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* Used help in ChatGPT to create a navigation bar that functions with next.js */
export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/inventory", label: "Inventory" },
    { href: "/box_interaction/take_or_donate", label: "Take/Donate an Item" },
    { href: "/profile", label: "Profile" },
    { href: "/support", label: "Support" },
    { href: "/about_us_and_faq", label: "About Us & FAQ" },
  ];

  return (
    <nav className="w-full bg-mint-green text-dark-green shadow-md">
      <div className="text-2xl font-bold container mx-auto px-4 py-4 flex justify-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-md font-semibold transition ${pathname === link.href
              ? "bg-dark-green shadow-lg text-white"
              : "hover:bg-lighter-green hover:text-white"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
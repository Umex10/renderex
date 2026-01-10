"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/content/header/header";

/**
 * Mobile navigation menu using a sheet/drawer.
 * Renders navigation links and closes the sheet when a link is selected.
 */

interface MobileNav {
  user: string | undefined
}
export default function MobileNav({user}: MobileNav) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[250px]">
        <nav className="flex flex-col gap-4 mt-8">

          {navItems.map((item, index) => {

            return <Link
              key={index}
              onClick={(_e) => {
                setOpen(false);
              }}
              href={item.href}
              className="text-lg hover:underline"
            >
              {item.text}
            </Link>
          })}

          {user ? (
            <Link
              key="dashboard"
              onClick={(_e) => {
                setOpen(false);
              }}
              href={"/dashboard"}
              className="text-lg hover:underline"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              key="sign-in"
              onClick={(_e) => {
                setOpen(false);
              }}
              href={"/sign-in"}
              className="text-lg hover:underline"
            >
              Sign-In
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
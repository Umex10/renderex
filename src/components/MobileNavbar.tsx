"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/content/header/header";

export default function MobileNavbar() {
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
          {navItems.map((item, index) => (
            <Link
              key={index}
              onClick={(_e) => {
                setOpen(false);
              }}
              href={item.href}
              className="text-lg hover:underline"
            >
              {item.text}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
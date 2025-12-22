"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navItems } from "@/content/header/header";

export function DesktopNavbar() {
  return (
    <div className="items-center gap-4">
      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              <Link
                href={item.href}
            
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {item.text}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default DesktopNavbar;
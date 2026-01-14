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

/**
 * Desktop navigation bar that renders the main navigation items.
 * Only visible on medium and larger screens.
 */
export function DesktopNav() {
  return (
    <div className="w-full flex justify-center items-center gap-4">
      <NavigationMenu>
        <NavigationMenuList className="w-full space-x-0">
          {navItems.map((item, index) => {

            return (
              <NavigationMenuItem key={index} className="px-0 gap-0">
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle({
                    className: "px-10 py-4",
                  })}
                >
                  <Link href={item.href} className="bg-transparent hover:bg-main/20
                  active:bg-main/50">
                    {item.text}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default DesktopNav;

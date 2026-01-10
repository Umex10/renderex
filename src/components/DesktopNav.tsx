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
        <NavigationMenuList>
          {navItems.map((item, index) => {

            return (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={item.href}>
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

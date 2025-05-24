"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Globe, LayoutDashboard } from "lucide-react"; // Added LayoutDashboard
import { cn } from "@/lib/utils";
import Logo from "./Logo";

// interface NavLinkProps { // Not used by the hardcoded item, but keep for future
//   href: string;
//   label: string;
//   description?: string;
// }

// interface NavGroupProps { // Not used by the hardcoded item
//   title: string;
//   links: NavLinkProps[];
//   footer?: {
//     text: string;
//     linkText: string;
//     href: string;
//     icon?: string;
//   };
// }

// const navGroups: NavGroupProps[] = [ /* ... */ ]; // Not used by the hardcoded item

const navigationLinks = [
  { label: "Builder", href: "/builder", icon: LayoutDashboard }, // Added Builder link with icon
  { label: "Enterprise", href: "/studio/enterprise" },
  { label: "Pricing", href: "/studio/plans" },
];

const languageOptions = [
  { label: "English", value: "en", selected: true },
  { label: "Deutsch", value: "de" },
  { label: "Español", value: "es" },
  { label: "Français", value: "fr" },
  { label: "日本語", value: "ja" },
  { label: "Português", value: "pt" },
];

// const NavigationMenuLinkItem = ({ href, label, description }: NavLinkProps) => ( // Not used by hardcoded item
//   <Link href={href} legacyBehavior passHref>
//     <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
//       <div className="text-base font-medium leading-none">{label}</div>
//       {description && (
//         <p className="line-clamp-2 mt-1 text-sm leading-snug text-muted-foreground">
//           {description}
//         </p>
//       )}
//     </NavigationMenuLink>
//   </Link>
// );

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b text-white transition-colors duration-300",
      isScrolled ? "bg-dark border-gray-700" : "bg-transparent border-transparent" // Restored original background logic
    )}>
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex"> 
          <Logo />
        </div>
        
        <nav className="hidden md:flex items-center gap-5 mx-auto"> {/* Centering the nav items */}
          {navigationLinks.map((link) => (
            <Link
              key={`nav-link-${link.label}`}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-gray-300 flex items-center"
            >
              {link.icon && <link.icon className="h-4 w-4 mr-1.5" />}
              {link.label}
            </Link>
          ))}

          <div className="relative group">
            <button aria-label="Select language" className="flex items-center text-sm font-medium transition-colors hover:text-gray-300">
              <Globe className="h-5 w-5 mr-1" /> 
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-3 w-3"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 hidden group-hover:block bg-white text-black shadow-lg rounded-md py-1 w-32">
              {languageOptions.map((option) => (
                <Link
                  key={`lang-${option.value}`}
                  href="#"
                  className={cn("block px-4 py-2 text-sm hover:bg-gray-100", {
                    "font-bold": option.selected
                  })}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="ml-4 flex items-center gap-2">
          <Link
            href="/"
            className="hidden md:inline-flex text-sm font-medium text-white hover:text-gray-300"
          >
            Log In
          </Link>
          <Button
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
            asChild
          >
            <Link href="/">Start Creating</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

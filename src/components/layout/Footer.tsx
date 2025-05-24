import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Logo from "./Logo";

const footerLinks = [
  {
    title: "Studio",
    links: [
      { label: "About", href: "/studio/about" },
      { label: "Features", href: "/studio/features" },
      { label: "Pricing", href: "/studio/plans" },
      { label: "Templates", href: "/studio/templates" },
      { label: "Enterprise", href: "/studio/enterprise" },
      { label: "Blocks Marketplace", href: "/studio/blocks" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Academy", href: "/studio/academy" },
      { label: "Blog", href: "/studio/blog" },
      { label: "Inspiration", href: "/studio/inspiration" },
      { label: "Partner Program", href: "/studio/partner-program" },
      { label: "Developer Docs", href: "/docs" },
      { label: "Support", href: "/support" },
      { label: "Privacy Policy", href: "/about/privacy" },
      { label: "Terms of Use", href: "/about/terms-of-use" },
    ],
  },
  {
    title: "Connect with Us",
    links: [
      { label: "Community", href: "/studio/community" },
      { label: "Status", href: "/status" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/example" },
      { label: "YouTube", href: "https://www.youtube.com/user/example" },
      { label: "Twitter", href: "https://twitter.com/example" },
      { label: "Instagram", href: "https://www.instagram.com/example" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Website Creator", href: "/" },
      { label: "Business Email", href: "/email/professional-email-address" },
      { label: "Domain Names", href: "/domain/names" },
      { label: "Enterprise Solutions", href: "/enterprise" },
      { label: "Business Solutions", href: "/business-solutions" },
      { label: "Marketplace", href: "/marketplace" },
    ],
  },
];

const socialIcons = [
  { icon: "facebook", href: "https://www.facebook.com/example" },
  { icon: "twitter", href: "https://twitter.com/example" },
  { icon: "instagram", href: "https://www.instagram.com/example" },
  { icon: "linkedin", href: "https://www.linkedin.com/company/example" },
  { icon: "youtube", href: "https://www.youtube.com/user/example" },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="mb-6 md:mb-0">
            <Logo className="text-white" />

            <div className="mt-4 flex space-x-4">
              {socialIcons.map((social) => (
                <Link
                  key={social.icon}
                  href={social.href}
                  className="text-white hover:text-accent"
                  aria-label={`Follow us on ${social.icon}`}
                >
                  <div className="h-5 w-5 rounded-full border border-white flex items-center justify-center">
                    <span className="sr-only">{social.icon}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-300 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Example.com, Inc. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <Link href="/about/privacy" className="text-xs text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/about/terms-of-use" className="text-xs text-gray-400 hover:text-white">
              Terms of Use
            </Link>
            <Link href="/about/cookies-policy" className="text-xs text-gray-400 hover:text-white">
              Cookies Policy
            </Link>
            <Link href="/about/gdpr" className="text-xs text-gray-400 hover:text-white">
              GDPR
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

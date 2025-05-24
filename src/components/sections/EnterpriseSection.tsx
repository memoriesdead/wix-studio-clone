import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const enterpriseLogos = [
  {
    name: "Bolt",
    src: "https://ext.same-assets.com/2838255838/684885694.svg"
  },
  {
    name: "Vevo",
    src: "https://ext.same-assets.com/2838255838/2363647571.svg"
  },
  {
    name: "Intuit",
    src: "https://ext.same-assets.com/2838255838/2134621540.svg"
  },
  {
    name: "Kroger",
    src: "https://via.placeholder.com/100x40.png?text=Kroger"
  },
  {
    name: "Fujitsu",
    src: "https://via.placeholder.com/100x40.png?text=Fujitsu"
  },
  {
    name: "Glassdoor",
    src: "https://via.placeholder.com/100x40.png?text=Glassdoor"
  },
  {
    name: "Hello Fresh",
    src: "https://via.placeholder.com/100x40.png?text=Hello+Fresh"
  },
  {
    name: "Clarins",
    src: "https://via.placeholder.com/100x40.png?text=Clarins"
  }
];

const EnterpriseSection = () => {
  return (
    <section className="bg-dark text-white py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-1 mb-4 text-xs font-medium uppercase tracking-wide bg-gray-800 rounded-full">
            ENTERPRISE SOLUTION
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Advanced multi-site management for enterprises
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Wix Studio offers scalable solutions including account-level analytics, SSO, and shared content collections as well as services like custom development and dedicated success managers.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-gray-500 hover:border-gray-400 text-white"
            asChild
          >
            <Link href="/studio/enterprise" className="gap-2 group">
              Learn more
            </Link>
          </Button>
        </div>

        <div className="relative mt-16">
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://ext.same-assets.com/2838255838/474460326.jpeg"
              alt="Enterprise interface"
              className="w-full h-auto"
            />

            {/* Overlay elements */}
            <img
              src="https://ext.same-assets.com/2838255838/4037107073.svg"
              alt="Interface element"
              className="absolute top-1/4 right-1/4 w-16 h-auto"
            />
            <img
              src="https://ext.same-assets.com/2838255838/671139592.svg"
              alt="Interface element"
              className="absolute bottom-1/4 left-1/4 w-12 h-auto"
            />
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://ext.same-assets.com/2838255838/2734599357.jpeg"
              alt="Multi-site dashboard"
              className="w-full h-auto"
            />

            {/* Overlay elements */}
            <img
              src="https://ext.same-assets.com/2838255838/306289131.svg"
              alt="Interface element"
              className="absolute top-1/4 right-1/4 w-16 h-auto"
            />
            <img
              src="https://ext.same-assets.com/2838255838/2682876032.svg"
              alt="Interface element"
              className="absolute bottom-1/4 left-1/4 w-12 h-auto"
            />
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center">
            {enterpriseLogos.map((logo, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="h-10 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseSection;

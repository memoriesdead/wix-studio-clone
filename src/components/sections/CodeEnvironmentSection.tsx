import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CodeEnvironmentSection = () => {
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://ext.same-assets.com/2838255838/2700050028.jpeg"
                alt="Code editor interface"
                className="w-full h-auto"
              />

              {/* Overlay elements */}
              <img
                src="https://ext.same-assets.com/2838255838/1930839088.svg"
                alt="Code element"
                className="absolute top-10 right-10 w-16 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/1909622125.svg"
                alt="Code element"
                className="absolute bottom-20 left-10 w-12 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/963298729.svg"
                alt="Code element"
                className="absolute top-1/4 left-1/4 w-10 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/3224053176.svg"
                alt="Code element"
                className="absolute bottom-1/4 right-1/4 w-14 h-auto"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Code on your terms, in a robust environment
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Create anything from custom components to full-stack solutions. Build on your preferred IDE to empower your process, and ship even faster with our AI code assistant.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-gray-500 hover:border-gray-900"
              asChild
            >
              <Link href="/studio/developers" className="gap-2 group">
                Explore more dev features
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-xs uppercase tracking-wide font-medium text-gray-500 text-center mb-6">
            INTEGRATIONS
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <img
              src="https://ext.same-assets.com/2838255838/2243092813.svg"
              alt="Github logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/705702029.svg"
              alt="NPM logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/1731959461.svg"
              alt="Visual Studio logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/3823642359.svg"
              alt="CSS logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/184234988.svg"
              alt="Google Cloud logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/263164754.svg"
              alt="Node.js logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeEnvironmentSection;

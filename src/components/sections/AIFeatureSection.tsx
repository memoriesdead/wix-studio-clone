import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AIFeatureSection = () => {
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="container">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-wide font-medium text-gray-500 text-center mb-6">
            INTEGRATIONS
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <img
              src="https://ext.same-assets.com/2838255838/1039193309.svg"
              alt="Shutterstock logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/593795439.svg"
              alt="Unsplash logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/4117690213.svg"
              alt="LottieFiles logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/3551457297.svg"
              alt="Figma logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Set complex responsive behaviors with AI
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Create more intricate relationships between elements to optimize sections, with the click of a button—and tweak as needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-accent text-black hover:bg-accent/90"
                asChild
              >
                <Link href="/">Start creating</Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-gray-500 hover:border-gray-900"
                asChild
              >
                <Link href="/studio/ai" className="gap-2 group">
                  <img
                    src="https://ext.same-assets.com/2838255838/31427165.svg"
                    alt=""
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  />
                  Explore all AI tools
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://ext.same-assets.com/2838255838/3339624856.jpeg"
                alt="AI responsive interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeatureSection;

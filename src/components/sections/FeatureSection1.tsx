import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeatureSection1 = () => {
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Focus on design—everything scales automatically
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Create freely on canvas, including in pixels, with a responsive editor that optimizes designs for every screen size.
            </p>
            <Button
              size="lg"
              className="bg-accent text-black hover:bg-accent/90"
              asChild
            >
              <Link href="/">Start creating</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://ext.same-assets.com/2838255838/414531453.jpeg"
                alt="Design interface screenshot"
                className="w-full h-auto"
              />

              {/* Overlay SVG elements */}
              <img
                src="https://ext.same-assets.com/2838255838/2827464598.svg"
                alt="Design element"
                className="absolute top-1/4 right-0 w-1/3 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/676167898.svg"
                alt="Design element"
                className="absolute bottom-1/4 left-0 w-1/4 h-auto"
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-xs uppercase tracking-wide font-medium text-gray-500 text-center mb-6">
            INTEGRATIONS
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <img
              src="https://ext.same-assets.com/2838255838/2131556491.svg"
              alt="Shutterstock logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/62809126.svg"
              alt="Unsplash logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/979785383.svg"
              alt="LottieFiles logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://ext.same-assets.com/2838255838/2457271041.svg"
              alt="Figma logo"
              className="h-6 opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection1;

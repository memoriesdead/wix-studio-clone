import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeatureSection4 = () => {
  return (
    <section className="bg-dark text-white py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative order-2 md:order-1">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://ext.same-assets.com/2838255838/2603836185.jpeg"
                alt="Design interface screenshot"
                className="w-full h-auto"
              />

              {/* Overlay SVG elements */}
              <img
                src="https://ext.same-assets.com/2838255838/3344078983.svg"
                alt="Design element"
                className="absolute top-1/4 right-1/4 w-16 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/572868801.svg"
                alt="Design element"
                className="absolute bottom-1/4 left-1/4 w-12 h-auto"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Focus on design—everything scales automatically
            </h2>
            <p className="text-lg text-gray-300 mb-8">
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
        </div>
      </div>
    </section>
  );
};

export default FeatureSection4;

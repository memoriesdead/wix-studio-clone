import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeatureSection2 = () => {
  return (
    <section className="bg-dark text-white py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://ext.same-assets.com/2838255838/447811835.jpeg"
                alt="No-code animations interface"
                className="w-full h-auto"
              />

              {/* Overlay elements */}
              <img
                src="https://ext.same-assets.com/2838255838/109264286.svg"
                alt="Animation element"
                className="absolute top-1/4 right-1/4 w-16 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/4226798101.svg"
                alt="Animation element"
                className="absolute bottom-1/3 left-1/4 w-12 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/1778693148.svg"
                alt="Animation element"
                className="absolute top-1/3 left-1/3 w-10 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/1261820529.svg"
                alt="Animation element"
                className="absolute bottom-1/4 right-1/3 w-14 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/2850460683.jpeg"
                alt="Animation example"
                className="absolute bottom-0 right-0 w-1/3 h-auto rounded-tl-lg"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Set your vision in motion with no-code animations
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Choose from smart presets and tailor them to your exact specs with options for scroll, loop, click, hover and more.
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

export default FeatureSection2;

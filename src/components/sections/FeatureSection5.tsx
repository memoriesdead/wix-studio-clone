import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeatureSection5 = () => {
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Set your vision in motion with no-code animations
            </h2>
            <p className="text-lg text-gray-700 mb-8">
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

          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://ext.same-assets.com/2838255838/658650513.jpeg"
                alt="No-code animations interface"
                className="w-full h-auto"
              />

              {/* Overlay elements */}
              <img
                src="https://ext.same-assets.com/2838255838/2142710191.svg"
                alt="Animation element"
                className="absolute top-1/4 right-1/4 w-16 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/4035473003.svg"
                alt="Animation element"
                className="absolute bottom-1/3 left-1/4 w-12 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/3155801419.svg"
                alt="Animation element"
                className="absolute top-1/3 left-1/3 w-10 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/4019915330.svg"
                alt="Animation element"
                className="absolute bottom-1/4 right-1/3 w-14 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection5;

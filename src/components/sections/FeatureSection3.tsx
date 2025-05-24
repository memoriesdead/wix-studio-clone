import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeatureSection3 = () => {
  return (
    <section className="bg-light py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Create signature experiences with custom CSS
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Add personalized styles, handle changes at runtime to make components interactive, and streamline edits with global updates.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-gray-500 hover:border-gray-900"
              asChild
            >
              <Link href="/studio/design" className="gap-2 group">
                <img
                  src="https://ext.same-assets.com/2838255838/4144287229.svg"
                  alt=""
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                />
                Advanced design features
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://ext.same-assets.com/2838255838/218573707.jpeg"
                alt="CSS code editor interface"
                className="w-full h-auto"
              />

              {/* Overlay elements */}
              <img
                src="https://ext.same-assets.com/2838255838/2448124107.svg"
                alt="Design element"
                className="absolute top-10 right-10 w-16 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/4181131068.svg"
                alt="Design element"
                className="absolute bottom-20 left-1/4 w-12 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/1417968507.svg"
                alt="Design element"
                className="absolute top-1/4 left-10 w-10 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/2541391590.svg"
                alt="Design element"
                className="absolute bottom-1/4 right-1/4 w-14 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/1671198911.jpeg"
                alt="Code example"
                className="absolute bottom-0 right-0 w-1/3 h-auto rounded-tl-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection3;

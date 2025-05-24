import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeatureSection6 = () => {
  return (
    <section className="bg-dark text-white py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative order-2 md:order-1">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://ext.same-assets.com/2838255838/546374125.jpeg"
                alt="CSS code editor interface"
                className="w-full h-auto"
              />

              {/* Overlay elements */}
              <img
                src="https://ext.same-assets.com/2838255838/1798384168.svg"
                alt="Design element"
                className="absolute top-10 right-10 w-16 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/3259304417.svg"
                alt="Design element"
                className="absolute bottom-20 left-10 w-12 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/269218561.svg"
                alt="Design element"
                className="absolute top-1/4 left-1/4 w-10 h-auto"
              />
              <img
                src="https://ext.same-assets.com/2838255838/534181319.svg"
                alt="Design element"
                className="absolute bottom-1/4 right-1/4 w-14 h-auto"
              />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Create signature experiences with custom CSS
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Add unique styles and animations with CSS access. Make components interactive by handling style changes at runtime and streamline your process by applying global changes.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-gray-500 hover:border-gray-400 text-white"
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
        </div>
      </div>
    </section>
  );
};

export default FeatureSection6;

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const DeveloperSection = () => {
  return (
    <section className="bg-dark text-white py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://ext.same-assets.com/2838255838/477407616.jpeg"
                  alt="Development interface"
                  className="w-full h-auto"
                />

                {/* Overlay elements */}
                <img
                  src="https://ext.same-assets.com/2838255838/1529984527.svg"
                  alt="Code element"
                  className="absolute top-1/4 right-1/4 w-16 h-auto"
                />
                <img
                  src="https://ext.same-assets.com/2838255838/1991916101.svg"
                  alt="Code element"
                  className="absolute bottom-1/4 left-1/4 w-12 h-auto"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Develop and sell your applications
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Use the Blocks workspace to build widgets and interactive components. And monetize them on our app market, with an audience of 245M+ potential customers.
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

export default DeveloperSection;

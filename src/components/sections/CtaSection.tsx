import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="bg-accent py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Start creating
            </h2>
            <p className="text-lg text-gray-800 max-w-2xl">
              Design the way you want to. Deliver when you need to.
            </p>
          </div>

          <div>
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-900"
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

export default CtaSection;

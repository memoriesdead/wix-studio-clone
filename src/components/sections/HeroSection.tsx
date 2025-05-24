import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react"; // Import ArrowRight icon

const HeroSection = () => {
  return (
    <section className="bg-dark text-white py-20 md:py-32 lg:py-48 relative overflow-hidden min-h-screen flex flex-col justify-center"> {/* Adjusted padding and min-height */}
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center"> {/* Increased max-width for larger text */}
          <h1 className="text-hero-title font-heading mb-6 text-white"> {/* Applied custom hero-title class */}
            Studio
          </h1>
          <p className="text-hero-tagline font-heading mb-4 text-gray-300"> {/* Applied custom hero-tagline class, adjusted color */}
            Deliver brilliance.
          </p>
          <p className="text-hero-tagline font-heading mb-10 text-gray-300"> {/* Applied custom hero-tagline class, adjusted color */}
            Smash deadlines.
          </p>

          <Button
            size="lg"
            className="bg-white text-dark hover:bg-gray-200 px-8 py-4 rounded-full group" // Styled to match live site: white bg, dark text
            asChild
          >
            <Link href="/" className="flex items-center">
              Start creating
              <span className="ml-2 bg-blue text-white rounded-full p-2 transform transition-transform duration-300 group-hover:scale-110"> {/* Styled blue circle for arrow */}
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Background gradient/aurora effect would be handled here, possibly with ::before/::after pseudo-elements or a dedicated div with complex CSS */}
      {/* For now, removing the old blurred circles */}
    </section>
  );
};

export default HeroSection;

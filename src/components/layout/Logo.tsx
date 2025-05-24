import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link href="/" className={`flex items-center ${className || ""}`}>
      <div className="text-xl md:text-2xl font-bold tracking-tight">
        Wix Studio
      </div>
    </Link>
  );
};

export default Logo;

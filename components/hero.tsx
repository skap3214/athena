import React from "react";

const Hero = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full dark:bg-grid-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
      <div className="absolute border-2 pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" />
      {children}
    </div>
  );
};

export default Hero;

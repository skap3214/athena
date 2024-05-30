import React from "react";

const Hero = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full dark:bg-grid-white/[0.15] bg-grid-black/[0.15] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" />
      {children}
    </div>
  );
};

export default Hero;

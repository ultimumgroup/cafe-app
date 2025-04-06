import { ReactNode } from "react";

interface HeroSectionProps {
  title: string;
  image: string;
  children?: ReactNode;
}

const HeroSection = ({ title, image, children }: HeroSectionProps) => {
  return (
    <div className="relative mb-12">
      {/* Hero Image Container with Gradient Overlay */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        
        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-end z-10 px-4 md:px-6 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{title}</h1>
        </div>
      </div>

      {/* Cards Section that overlays the hero image */}
      {children && (
        <div className="absolute bottom-0 transform translate-y-1/2 w-full px-4 md:px-6">
          <div className="flex flex-wrap gap-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
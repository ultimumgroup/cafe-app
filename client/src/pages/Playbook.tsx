import { Button } from "@/components/ui/button";
import { FileText, Plus, BookOpen, Clipboard, ArrowRight } from "lucide-react";
import HeroSection from "@/components/layout/HeroSection";
import StatsCard from "@/components/dashboard/StatsCard";

const Playbook = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <div className="mb-8">
        {/* Hero Section with overlaid cards */}
        <HeroSection 
          title="Restaurant Playbook"
          image="https://images.unsplash.com/photo-1571805529673-0f56b922b359?q=80&w=1280"
        >
          {/* Overlay Cards */}
          <div className="flex flex-wrap gap-4 w-full justify-center">
            <StatsCard 
              value="12"
              label="SOPs Created"
              icon={<BookOpen className="h-6 w-6" />}
              iconColor="text-amber-400"
              bgColor="bg-card/95 backdrop-blur-sm"
            />
            <StatsCard 
              value="3"
              label="Training Guides"
              icon={<Clipboard className="h-6 w-6" />}
              iconColor="text-blue-400"
              bgColor="bg-card/95 backdrop-blur-sm"
            />
            <StatsCard 
              value="85%"
              label="Completion Rate"
              icon={<ArrowRight className="h-6 w-6" />}
              iconColor="text-green-400"
              bgColor="bg-card/95 backdrop-blur-sm"
            />
          </div>
        </HeroSection>
      </div>

      <div className="flex items-center justify-between mt-16">
        <h2 className="text-xl font-semibold">Playbook</h2>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Create New
        </Button>
      </div>
      
      <div className="bg-surface-dark rounded-lg border border-gray-700 p-6 text-center">
        <FileText className="h-12 w-12 mx-auto text-gray-500" />
        <h3 className="mt-4 text-lg font-medium">Create Your First Playbook</h3>
        <p className="mt-2 text-gray-400 max-w-md mx-auto">
          Standardize your restaurant operations with comprehensive guides and protocols for your staff.
        </p>
        <Button className="mt-4">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Playbook;

import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

const Playbook = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <div className="flex items-center justify-between">
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

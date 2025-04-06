import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, File, FileText, Video, BookOpen, FileBadge, FileArchive } from "lucide-react";
import { Resource } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/layout/HeroSection";
import StatsCard from "@/components/dashboard/StatsCard";

const Library = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Default to restaurant ID 1 for the demo
  const restaurantId = user?.restaurantId || 1;
  
  // Fetch resources for the current restaurant
  const { 
    data: resources = [], 
    isLoading 
  } = useQuery<Resource[]>({ 
    queryKey: ['/api/restaurants', restaurantId, 'resources'] 
  });
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <File className="h-12 w-12 text-gray-600" />;
      case 'docx':
        return <FileText className="h-12 w-12 text-gray-600" />;
      case 'mp4':
      case 'mov':
      case 'avi':
        return <Video className="h-12 w-12 text-gray-600" />;
      default:
        return <File className="h-12 w-12 text-gray-600" />;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  
  const getTimeAgo = (date: Date | null) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const resourceDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - resourceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };
  
  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <div className="mb-8">
        {/* Hero Section with overlaid cards */}
        <HeroSection 
          title="Knowledge Library"
          image="https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=1280"
        >
          {/* Overlay Cards */}
          <div className="flex flex-wrap gap-4 w-full justify-center">
            <StatsCard 
              value="18"
              label="Documents"
              icon={<FileText className="h-6 w-6" />}
              iconColor="text-blue-400"
              bgColor="bg-card/95 backdrop-blur-sm"
            />
            <StatsCard 
              value="5"
              label="Training Videos"
              icon={<Video className="h-6 w-6" />}
              iconColor="text-red-400"
              bgColor="bg-card/95 backdrop-blur-sm"
            />
            <StatsCard 
              value="7.5GB"
              label="Storage Used"
              icon={<FileArchive className="h-6 w-6" />}
              iconColor="text-purple-400"
              bgColor="bg-card/95 backdrop-blur-sm"
            />
          </div>
        </HeroSection>
      </div>

      <div className="flex items-center justify-between mt-16">
        <h2 className="text-xl font-semibold">Resource Library</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search resources..."
              className="bg-gray-800 text-gray-100 text-sm rounded-md pl-9 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center p-8">Loading resources...</div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(resource => (
            <div key={resource.id} className="bg-surface-dark rounded-lg border border-gray-700 overflow-hidden">
              <div className="h-36 bg-gray-800 flex items-center justify-center">
                {getFileIcon(resource.fileType || 'unknown')}
              </div>
              <div className="p-4">
                <h4 className="font-medium">{resource.title}</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {resource.fileType?.toUpperCase()} • {formatFileSize(resource.fileSize || 0)} • Updated {getTimeAgo(resource.updatedAt)}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400">
                    {Array.isArray(resource.visibleTo) && resource.visibleTo.includes('all') ? 'Shared with all staff' : 'Limited access'}
                  </span>
                  <Button variant="link" className="text-primary text-sm hover:text-blue-400 p-0">
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 text-gray-400">
          {searchQuery ? 'No resources match your search' : 'No resources available'}
        </div>
      )}
    </div>
  );
};

export default Library;

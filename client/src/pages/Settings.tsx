import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Restaurant } from "@shared/schema";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Default to restaurant ID 1 for the demo
  const restaurantId = user?.restaurantId || 1;
  
  // Fetch restaurant details
  const { 
    data: restaurant, 
    isLoading 
  } = useQuery<Restaurant>({ 
    queryKey: ['/api/restaurants', restaurantId] 
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    description: '',
  });
  
  // Update form data when restaurant details are loaded
  useState(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        email: restaurant.email || '',
        phone: restaurant.phone || '',
        location: restaurant.address || '',
        description: restaurant.description || '',
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>
      
      <div className="bg-surface-dark rounded-lg border border-gray-700 overflow-hidden">
        <Tabs defaultValue="general">
          <div className="flex border-b border-gray-700 overflow-x-auto">
            <TabsList className="bg-transparent">
              <TabsTrigger value="general" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white text-gray-400 hover:text-white rounded-none px-4 py-3">
                General
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white text-gray-400 hover:text-white rounded-none px-4 py-3">
                User Management
              </TabsTrigger>
              <TabsTrigger value="permissions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white text-gray-400 hover:text-white rounded-none px-4 py-3">
                Permissions
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white text-gray-400 hover:text-white rounded-none px-4 py-3">
                Integrations
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-white text-gray-400 hover:text-white rounded-none px-4 py-3">
                Billing
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="general" className="p-6">
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-medium">Restaurant Information</h3>
                <p className="text-sm text-gray-400 mt-1">Update your restaurant details and preferences</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="description">Restaurant Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mt-8">Appearance</h3>
                <p className="text-sm text-gray-400 mt-1">Customize how the dashboard looks</p>
                
                <div className="flex items-center mt-4">
                  <Switch id="dark-mode" defaultChecked />
                  <Label htmlFor="dark-mode" className="ml-3">Dark Mode</Label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mt-8">Notifications</h3>
                <p className="text-sm text-gray-400 mt-1">Configure notification preferences</p>
                
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Task assignments</p>
                      <p className="text-sm text-gray-400">Get notified when tasks are assigned to you</p>
                    </div>
                    <Switch id="task-notification" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Staff updates</p>
                      <p className="text-sm text-gray-400">Get notified about staff changes</p>
                    </div>
                    <Switch id="staff-notification" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Playbook changes</p>
                      <p className="text-sm text-gray-400">Get notified when playbooks are updated</p>
                    </div>
                    <Switch id="playbook-notification" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="p-6 text-center text-gray-400">
              User management settings will be available here
            </div>
          </TabsContent>
          
          <TabsContent value="permissions">
            <div className="p-6 text-center text-gray-400">
              Permission settings will be available here
            </div>
          </TabsContent>
          
          <TabsContent value="integrations">
            <div className="p-6 text-center text-gray-400">
              Integration settings will be available here
            </div>
          </TabsContent>
          
          <TabsContent value="billing">
            <div className="p-6 text-center text-gray-400">
              Billing settings will be available here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

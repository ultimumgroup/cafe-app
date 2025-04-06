import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Restaurant, User } from '@shared/schema';
import { Loader2, Building, Plus, Users, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeTab, setActiveTab] = useState('restaurants');

  const { data: restaurantsData, isLoading: loadingRestaurants } = useQuery({
    queryKey: ['/api/restaurants'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/restaurants');
      return await res.json() as Restaurant[];
    },
    enabled: !!user?.id && user?.role === 'superadmin',
  });

  useEffect(() => {
    if (restaurantsData) {
      setRestaurants(restaurantsData);
    }
  }, [restaurantsData]);

  if (loadingRestaurants) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage restaurants, users, and system settings</p>
      </div>

      <Tabs defaultValue="restaurants" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="restaurants">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>{restaurant.name}</CardTitle>
                  <CardDescription>
                    {restaurant.address || 'No address provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>Owner ID: {restaurant.ownerId || 'Not assigned'}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle>Add New Restaurant</CardTitle>
                <CardDescription>Set up a new restaurant in the system</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center justify-center h-24">
                  <Plus className="h-12 w-12 text-muted-foreground/50" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Create Restaurant
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium">User Management</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage system users and permissions
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center">
              <SettingsIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium">System Settings</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Configure global system parameters
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  BarChart3, 
  Users, 
  Car, 
  MessageCircle, 
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  IndianRupee
} from "lucide-react";
import VehicleForm from "@/components/vehicle-form";
import SettingsForm from "@/components/settings-form";
import ChatWidget from "@/components/chat-widget";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);
  const [isEditVehicleDialogOpen, setIsEditVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [isUserListDialogOpen, setIsUserListDialogOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user?.isAdmin,
  });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["/api/vehicles", { sellerId: user?.id }],
    enabled: !!user?.isAdmin,
  });

  const { data: chatRooms = [], isLoading: chatsLoading } = useQuery({
    queryKey: ["/api/chat-rooms"],
    enabled: !!user?.isAdmin,
  });

  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isAdmin,
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: (vehicleId: number) => apiRequest("DELETE", `/api/vehicles/${vehicleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-hema-secondary">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName || 'Admin'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <SettingsForm isAdmin={true} />
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
              >
                View Site
              </Button>
              <Button 
                className="bg-hema-orange hover:bg-hema-orange/90"
                onClick={() => window.location.href = '/api/auth/logout'}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Vehicles</p>
                  <p className="text-2xl font-bold text-hema-secondary">
                    {statsLoading ? "..." : stats?.totalVehicles || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-hema-secondary">
                    {statsLoading ? "..." : `₹${(stats?.totalSales || 0).toLocaleString()}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold text-hema-secondary">
                    {statsLoading ? "..." : stats?.activeChats || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Dialog open={isUserListDialogOpen} onOpenChange={setIsUserListDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-hema-secondary">
                        {statsLoading ? "..." : stats?.totalUsers || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>All Users</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto max-h-[60vh]">
                {usersLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-hema-orange text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </div>
                              <div>
                                <div className="font-medium">{user.firstName} {user.lastName}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={user.isAdmin ? "default" : "secondary"}>
                              {user.isAdmin ? "Admin" : "User"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                              {user.isEmailVerified ? "Verified" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="chats">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vehicles" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vehicle Management</CardTitle>
                  <Dialog open={isAddVehicleDialogOpen} onOpenChange={setIsAddVehicleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-hema-orange hover:bg-hema-orange/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Add New Vehicle</DialogTitle>
                      </DialogHeader>
                      <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-2">
                        <VehicleForm onSuccess={() => {
                          setIsAddVehicleDialogOpen(false);
                          queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
                        }} />
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Edit Vehicle Dialog */}
                  <Dialog open={isEditVehicleDialogOpen} onOpenChange={setIsEditVehicleDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Edit Vehicle</DialogTitle>
                      </DialogHeader>
                      <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-2">
                        <VehicleForm 
                          vehicle={editingVehicle} 
                          onSuccess={() => {
                            setIsEditVehicleDialogOpen(false);
                            setEditingVehicle(null);
                            queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
                          }} 
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {vehiclesLoading ? (
                  <div className="text-center py-8">Loading vehicles...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Vehicle Number</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicles.map((vehicle: any) => (
                          <TableRow key={vehicle.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Car className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                  <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                                  <div className="text-sm text-gray-600">{vehicle.year} • {vehicle.kmDriven} km</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{vehicle.vehicleNumber}</TableCell>
                            <TableCell>₹{parseFloat(vehicle.price.toString()).toLocaleString()}</TableCell>
                            <TableCell>{vehicle.location}</TableCell>
                            <TableCell>
                              <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                                {vehicle.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.location.href = `/vehicle/${vehicle.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingVehicle(vehicle);
                                    setIsEditVehicleDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => deleteVehicleMutation.mutate(vehicle.id)}
                                  disabled={deleteVehicleMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {chatsLoading ? (
                  <div className="text-center py-8">Loading chats...</div>
                ) : chatRooms.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">No active chats</div>
                ) : (
                  <div className="space-y-4">
                    {chatRooms.map((chat: any) => (
                      <div key={chat.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-hema-orange text-white rounded-full flex items-center justify-center">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{chat.vehicle?.brand} {chat.vehicle?.model}</h4>
                            <Badge variant="secondary">{chat.vehicle?.vehicleNumber}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Chat with {chat.buyer?.firstName} {chat.buyer?.lastName}
                          </p>
                          {chat.messages?.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                              Last message: {chat.messages[chat.messages.length - 1]?.content}
                            </p>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          View Chat
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overview Stats Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Platform Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Vehicles', value: stats?.totalVehicles || 0, color: '#ff6b35' },
                      { name: 'Users', value: stats?.totalUsers || 0, color: '#8b5cf6' },
                      { name: 'Active Chats', value: stats?.activeChats || 0, color: '#f59e0b' },
                      { name: 'Sales', value: stats?.totalSales || 0, color: '#10b981' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ff6b35" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Activity Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Regular Users', value: (stats?.totalUsers || 0) - 1, fill: '#8b5cf6' },
                          { name: 'Admin Users', value: 1, fill: '#ff6b35' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#ff6b35" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Vehicle Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    Vehicle Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Vehicles</span>
                      <span className="font-semibold">{stats?.totalVehicles || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Listings</span>
                      <span className="font-semibold text-green-600">{vehicles?.filter((v: any) => v.isActive).length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Featured Vehicles</span>
                      <span className="font-semibold text-orange-600">{vehicles?.filter((v: any) => v.isFeatured).length || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-hema-orange h-2 rounded-full transition-all" 
                        style={{ width: `${((vehicles?.filter((v: any) => v.isActive).length || 0) / (stats?.totalVehicles || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">Active vehicle percentage</p>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Communication Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Chat Rooms</span>
                      <span className="font-semibold">{stats?.activeChats || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Messages</span>
                      <span className="font-semibold">{chatRooms?.reduce((total: number, chat: any) => total + (chat.messages?.length || 0), 0) || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg Messages/Chat</span>
                      <span className="font-semibold">
                        {chatRooms?.length > 0 
                          ? Math.round((chatRooms?.reduce((total: number, chat: any) => total + (chat.messages?.length || 0), 0) || 0) / chatRooms.length)
                          : 0
                        }
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={120}>
                      <AreaChart data={[
                        { name: 'Week 1', messages: 12 },
                        { name: 'Week 2', messages: 19 },
                        { name: 'Week 3', messages: 25 },
                        { name: 'Week 4', messages: chatRooms?.reduce((total: number, chat: any) => total + (chat.messages?.length || 0), 0) || 0 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="messages" stroke="#ff6b35" fill="#ff6b35" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}

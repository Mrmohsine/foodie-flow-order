
import React from 'react';
import { BarChart3, PieChart, LineChart, TrendingUp, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import Layout from '@/components/Layout';
import { useOrder } from '@/context/OrderContext';

const OwnerPage: React.FC = () => {
  const { state } = useOrder();
  const { orders, menuItems } = state;
  
  // Calculate sales data
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  // Count item occurrences in orders
  const itemCounts = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      if (!acc[item.menuItemId]) {
        acc[item.menuItemId] = 0;
      }
      acc[item.menuItemId] += item.quantity;
    });
    return acc;
  }, {} as Record<string, number>);
  
  // Sort items by popularity
  const popularItems = Object.entries(itemCounts)
    .map(([id, count]) => {
      const menuItem = menuItems.find(item => item.id === id);
      return {
        id,
        name: menuItem?.name || 'Unknown Item',
        count,
      };
    })
    .sort((a, b) => b.count - a.count);
  
  // Prepare data for charts
  const popularItemsChartData = popularItems.slice(0, 5).map(item => ({
    name: item.name,
    value: item.count,
  }));
  
  // Mock data for time-based charts
  const dailySalesData = [
    { name: 'Mon', sales: 1200 },
    { name: 'Tue', sales: 1900 },
    { name: 'Wed', sales: 2100 },
    { name: 'Thu', sales: 1500 },
    { name: 'Fri', sales: 2400 },
    { name: 'Sat', sales: 3000 },
    { name: 'Sun', sales: 2200 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5'];
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
              <p className="text-xs text-gray-500">For all time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-gray-500">For all time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              <LineChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Per order</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.filter(item => !item.available).length}</div>
              <p className="text-xs text-gray-500">Items unavailable</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Analytics Tabs */}
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
            <TabsTrigger value="popular">Popular Items</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Needs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales</CardTitle>
                <CardDescription>Sales over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailySalesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#F97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="popular" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Items</CardTitle>
                  <CardDescription>Top selling items by quantity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={popularItemsChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {popularItemsChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Products</CardTitle>
                  <CardDescription>Most ordered items</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {popularItems.slice(0, 5).map((item, index) => (
                      <li key={item.id} className="flex items-center">
                        <div className="bg-foodie-100 text-foodie-700 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.count} orders</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Items that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold">Unavailable Items</h3>
                  <ul className="divide-y">
                    {menuItems.filter(item => !item.available).map(item => (
                      <li key={item.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Out of Stock
                        </div>
                      </li>
                    ))}
                    {menuItems.filter(item => !item.available).length === 0 && (
                      <li className="py-3 text-center text-gray-500">
                        All items are currently available
                      </li>
                    )}
                  </ul>
                  
                  <h3 className="font-semibold mt-6">Items to Restock Soon</h3>
                  <ul className="divide-y">
                    {/* Mock data for items to restock */}
                    <li className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Ground Beef</p>
                        <p className="text-sm text-gray-500">Ingredients</p>
                      </div>
                      <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                        Low Stock
                      </div>
                    </li>
                    <li className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Fresh Tomatoes</p>
                        <p className="text-sm text-gray-500">Produce</p>
                      </div>
                      <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                        Low Stock
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OwnerPage;

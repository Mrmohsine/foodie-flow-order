
import React from 'react';
import { Package, ArrowUpDown, ArrowRight, Check, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { useOrder } from '@/context/OrderContext';

// Mock supply needs data
const supplyData = [
  { 
    id: '1', 
    name: 'Ground Beef', 
    category: 'Meat', 
    quantity: '10 kg', 
    priority: 'High', 
    lastDelivery: '2023-04-01',
    scheduled: true
  },
  { 
    id: '2', 
    name: 'Fresh Tomatoes', 
    category: 'Produce', 
    quantity: '5 kg', 
    priority: 'Medium', 
    lastDelivery: '2023-04-02',
    scheduled: false
  },
  { 
    id: '3', 
    name: 'Burger Buns', 
    category: 'Bakery', 
    quantity: '8 packs', 
    priority: 'High', 
    lastDelivery: '2023-03-28',
    scheduled: true
  },
  { 
    id: '4', 
    name: 'Lettuce', 
    category: 'Produce', 
    quantity: '3 kg', 
    priority: 'Low', 
    lastDelivery: '2023-04-03',
    scheduled: false
  },
  { 
    id: '5', 
    name: 'Cheese Slices', 
    category: 'Dairy', 
    quantity: '4 packs', 
    priority: 'Medium', 
    lastDelivery: '2023-03-30',
    scheduled: true
  },
];

// Past deliveries mock data
const deliveryHistory = [
  {
    id: 'DEL-001',
    date: '2023-04-01',
    items: [
      { name: 'Ground Beef', quantity: '15 kg' },
      { name: 'Cheese Slices', quantity: '10 packs' },
    ],
    status: 'Delivered',
  },
  {
    id: 'DEL-002',
    date: '2023-03-25',
    items: [
      { name: 'Lettuce', quantity: '5 kg' },
      { name: 'Fresh Tomatoes', quantity: '8 kg' },
      { name: 'Burger Buns', quantity: '12 packs' },
    ],
    status: 'Delivered',
  },
];

const SupplierPage: React.FC = () => {
  const { state } = useOrder();
  const { menuItems } = state;
  const { toast } = useToast();
  
  const handleScheduleDelivery = (item: string) => {
    toast({
      title: "Delivery Scheduled",
      description: `${item} has been scheduled for the next delivery.`,
    });
  };
  
  // Filter out unavailable items as potential supply needs
  const unavailableItems = menuItems.filter(item => !item.available);
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Items to Deliver</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supplyData.length}</div>
              <p className="text-xs text-gray-500">Current delivery needs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Deliveries</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{supplyData.filter(item => item.scheduled).length}</div>
              <p className="text-xs text-gray-500">Items on upcoming deliveries</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unavailableItems.length}</div>
              <p className="text-xs text-gray-500">Items needing resupply</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different views */}
        <Tabs defaultValue="delivery-needs" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="delivery-needs">Delivery Needs</TabsTrigger>
            <TabsTrigger value="delivery-history">Delivery History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="delivery-needs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Delivery Needs</CardTitle>
                <CardDescription>Items that need to be delivered to the restaurant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Item</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Quantity</th>
                        <th className="text-left py-3 px-4">Priority</th>
                        <th className="text-left py-3 px-4">Last Delivery</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplyData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4 text-gray-600">{item.category}</td>
                          <td className="py-3 px-4">{item.quantity}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              item.priority === 'High' ? 'bg-red-100 text-red-800' :
                              item.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{item.lastDelivery}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              item.scheduled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.scheduled ? 'Scheduled' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              size="sm" 
                              variant={item.scheduled ? "outline" : "default"}
                              onClick={() => handleScheduleDelivery(item.name)}
                              disabled={item.scheduled}
                            >
                              {item.scheduled ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Scheduled
                                </>
                              ) : (
                                <>
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Schedule
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            {/* Out of Stock Items from Menu */}
            {unavailableItems.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Out of Stock Menu Items</CardTitle>
                  <CardDescription>Menu items marked as unavailable</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {unavailableItems.map(item => (
                      <li key={item.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Add to Delivery
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="delivery-history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
                <CardDescription>Past deliveries to the restaurant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryHistory.map((delivery) => (
                    <Card key={delivery.id} className="bg-gray-50">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-md">Delivery #{delivery.id}</CardTitle>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {delivery.status}
                          </span>
                        </div>
                        <CardDescription>{delivery.date}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <h4 className="font-medium text-sm mb-2">Items Delivered:</h4>
                        <ul className="space-y-1">
                          {delivery.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <span className="text-gray-600">{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SupplierPage;

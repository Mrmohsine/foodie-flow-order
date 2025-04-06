
import React from 'react';
import { Clock, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Layout from '@/components/Layout';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';

const KitchenPage: React.FC = () => {
  const { state, dispatch } = useOrder();
  const { orders, menuItems } = state;
  const { toast } = useToast();
  
  // Filter for active orders (confirmed or preparing)
  const activeOrders = orders.filter(order => 
    order.status === 'confirmed' || order.status === 'preparing'
  );
  
  const handleToggleAvailability = (id: string, currentAvailability: boolean) => {
    dispatch({
      type: 'UPDATE_ITEM_AVAILABILITY',
      payload: { id, available: !currentAvailability },
    });
    
    toast({
      title: `Item ${!currentAvailability ? 'Available' : 'Unavailable'}`,
      description: `The item has been marked as ${!currentAvailability ? 'available' : 'unavailable'}.`,
    });
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Active Orders Section */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Clock className="mr-2 h-6 w-6 text-foodie-500" />
              Active Orders
            </h2>
            
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No active orders at the moment
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-foodie-50 p-4">
                      <CardTitle className="text-lg flex justify-between">
                        <span>Order #{order.id.substring(0, 5)}</span>
                        <span>Table {order.table}</span>
                      </CardTitle>
                      <div className="text-sm text-gray-500">
                        {new Date(order.timestamp).toLocaleTimeString()}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ul className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">
                          <Check className="mr-1 h-4 w-4" />
                          Mark as Ready
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Menu Item Availability */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">Menu Item Availability</h2>
            <Card>
              <CardContent className="p-4">
                <ul className="divide-y">
                  {menuItems.map((item) => (
                    <li key={item.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {item.available ? 'Available' : 'Unavailable'}
                        </span>
                        <Switch
                          checked={item.available}
                          onCheckedChange={() => 
                            handleToggleAvailability(item.id, item.available)
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default KitchenPage;

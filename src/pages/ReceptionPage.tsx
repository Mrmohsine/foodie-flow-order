import React, { useEffect, useState } from 'react';
import { BellRing, Check, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { useOrder, Order } from '@/context/OrderContext';

const ReceptionPage: React.FC = () => {
  const { state } = useOrder();
  const { orders } = state;
  const { toast } = useToast();
  const [hasNewOrder, setHasNewOrder] = useState(false);
  
  // Keep track of the last order count to detect new orders
  const [previousOrderCount, setPreviousOrderCount] = useState(orders.length);
  
  useEffect(() => {
    // Check if a new order has been added
    if (orders.length > previousOrderCount) {
      setHasNewOrder(true);
      
      // Show toast notification
      toast({
        title: "New Order Received!",
        description: `Order #${orders[orders.length - 1].id.substring(0, 5)} has been placed.`,
      });
      
      // Play notification sound
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3');
      audio.play().catch(error => console.error('Error playing notification sound:', error));
    }
    
    // Update the previous order count
    setPreviousOrderCount(orders.length);
  }, [orders.length, previousOrderCount, toast]);
  
  // Reset the new order flag when user interacts with the page
  const handleInteraction = () => {
    setHasNewOrder(false);
  };
  
  // Organize orders into categories
  const confirmedOrders = orders.filter(order => order.status === 'confirmed');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');
  const completedOrders = orders.filter(order => order.status === 'delivered');
  
  return (
    <Layout>
      <div onClick={handleInteraction} className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reception Dashboard</h1>
          
          {hasNewOrder && (
            <div className="animate-pulse flex items-center text-foodie-500">
              <BellRing className="mr-2 h-5 w-5" />
              <span className="font-semibold">New Order!</span>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="confirmed" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="confirmed" className="relative">
              Confirmed
              {confirmedOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-foodie-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {confirmedOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing">
              Preparing
              {preparingOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-foodie-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {preparingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ready">
              Ready
              {readyOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-foodie-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {readyOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="confirmed" className="mt-4">
            <OrderList orders={confirmedOrders} emptyMessage="No confirmed orders" />
          </TabsContent>
          
          <TabsContent value="preparing" className="mt-4">
            <OrderList orders={preparingOrders} emptyMessage="No orders in preparation" />
          </TabsContent>
          
          <TabsContent value="ready" className="mt-4">
            <OrderList orders={readyOrders} emptyMessage="No orders ready for delivery" />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <OrderList orders={completedOrders} emptyMessage="No completed orders" />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Order list component
interface OrderListProps {
  orders: Order[];
  emptyMessage: string;
}

const OrderList: React.FC<OrderListProps> = ({ orders, emptyMessage }) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-foodie-50 p-4">
            <CardTitle className="text-lg flex justify-between">
              <span>Order #{order.id.substring(0, 5)}</span>
              <span>Table {order.table}</span>
            </CardTitle>
            <div className="text-sm text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(order.timestamp).toLocaleTimeString()}
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 pt-4 border-t flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-1 h-3 w-3" />
              Update Status
            </Button>
            
            <Button size="sm">
              <Check className="mr-1 h-3 w-3" />
              Complete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ReceptionPage;

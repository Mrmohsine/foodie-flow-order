
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/context/OrderContext';

const ReceptionPage = () => {
  const { state, dispatch } = useOrder();
  const { orders } = state;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reception Dashboard</h1>
          <p className="text-gray-600">Manage orders and tables</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Orders section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Current Orders</h2>
            
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No active orders at the moment
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 p-4">
                      <CardTitle className="text-lg flex justify-between">
                        <span>Order #{order.id.substring(0, 5)}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </CardTitle>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Table {order.table}</span>
                        <span>{new Date(order.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ul className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-500">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                        <li className="flex justify-between font-bold pt-2 border-t">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </li>
                      </ul>
                      <div className="flex justify-end space-x-2">
                        {(order.status === 'ready') && (
                          <Button variant="default">
                            Mark as Delivered
                          </Button>
                        )}
                        {(order.status === 'delivered') && (
                          <Button variant="outline">
                            Complete Order
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Table management section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Table Management</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((table) => {
                    const hasActiveOrder = orders.some(
                      order => 
                        order.table === table.toString() && 
                        !['completed', 'cancelled'].includes(order.status)
                    );
                    
                    return (
                      <Button
                        key={table}
                        variant={hasActiveOrder ? "default" : "outline"}
                        className="h-20 text-lg"
                      >
                        Table {table}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReceptionPage;

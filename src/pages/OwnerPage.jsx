
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrder } from '@/context/OrderContext';

const OwnerPage = () => {
  const { state } = useOrder();
  const { orders, menuItems } = state;
  
  // Calculate some simple statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Find popular items
  const itemPopularity = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (itemPopularity[item.id]) {
        itemPopularity[item.id].quantity += item.quantity;
        itemPopularity[item.id].revenue += item.price * item.quantity;
      } else {
        itemPopularity[item.id] = {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity
        };
      }
    });
  });
  
  const popularItems = Object.values(itemPopularity)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
          <p className="text-gray-600">Business overview and analytics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalOrders}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Average Order</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${averageOrderValue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
            </CardHeader>
            <CardContent>
              {popularItems.length > 0 ? (
                <ul className="divide-y">
                  {popularItems.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity sold: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.revenue.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No order data available</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {menuItems.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerPage;

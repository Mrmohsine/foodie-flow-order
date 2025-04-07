
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrder } from '@/context/OrderContext';

const SupplierPage = () => {
  const { state } = useOrder();
  const { menuItems } = state;
  
  const supplierItems = [
    { id: 'sup1', name: 'Flour', supplier: 'GoodFlour Inc.', quantity: 50, unit: 'kg', lastOrder: '2023-04-01' },
    { id: 'sup2', name: 'Tomatoes', supplier: 'Fresh Produce', quantity: 20, unit: 'kg', lastOrder: '2023-04-05' },
    { id: 'sup3', name: 'Cheese', supplier: 'Dairy Delights', quantity: 15, unit: 'kg', lastOrder: '2023-04-02' },
    { id: 'sup4', name: 'Olive Oil', supplier: 'Mediterranean Imports', quantity: 10, unit: 'liters', lastOrder: '2023-03-28' },
    { id: 'sup5', name: 'Chicken', supplier: 'Farmhouse Poultry', quantity: 30, unit: 'kg', lastOrder: '2023-04-04' },
  ];
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Management</h1>
          <p className="text-gray-600">Manage your restaurant's inventory and suppliers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Inventory section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Current Inventory</h2>
              <div className="flex gap-2">
                <Input 
                  placeholder="Search items..." 
                  className="max-w-xs"
                />
              </div>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left">Item</th>
                      <th className="py-3 px-4 text-left">Supplier</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                      <th className="py-3 px-4 text-right">Last Order</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {supplierItems.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4">{item.supplier}</td>
                        <td className="py-3 px-4 text-right">{item.quantity} {item.unit}</td>
                        <td className="py-3 px-4 text-right">{item.lastOrder}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">Order</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
          
          {/* Supplier section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Suppliers</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Supplier Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="p-3 bg-gray-50 rounded">
                    <p className="font-semibold">GoodFlour Inc.</p>
                    <p className="text-sm text-gray-600">Flour, Sugar, Salt</p>
                    <p className="text-sm text-gray-600 mt-1">Contact: (555) 123-4567</p>
                  </li>
                  <li className="p-3 bg-gray-50 rounded">
                    <p className="font-semibold">Fresh Produce</p>
                    <p className="text-sm text-gray-600">Vegetables, Fruits</p>
                    <p className="text-sm text-gray-600 mt-1">Contact: (555) 987-6543</p>
                  </li>
                  <li className="p-3 bg-gray-50 rounded">
                    <p className="font-semibold">Dairy Delights</p>
                    <p className="text-sm text-gray-600">Cheese, Milk, Cream</p>
                    <p className="text-sm text-gray-600 mt-1">Contact: (555) 456-7890</p>
                  </li>
                  <li className="p-3 bg-gray-50 rounded">
                    <p className="font-semibold">Farmhouse Poultry</p>
                    <p className="text-sm text-gray-600">Chicken, Turkey, Eggs</p>
                    <p className="text-sm text-gray-600 mt-1">Contact: (555) 234-5678</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupplierPage;

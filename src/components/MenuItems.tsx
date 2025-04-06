
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOrder, MenuItem } from '@/context/OrderContext';

const MenuItems: React.FC = () => {
  const { state, dispatch } = useOrder();
  const { menuItems } = state;
  
  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
  
  const handleAddToOrder = (item: MenuItem) => {
    if (item.available) {
      dispatch({ type: 'ADD_TO_ORDER', payload: item });
    }
  };
  
  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <Card 
                key={item.id} 
                className={`overflow-hidden transition-all hover:shadow-md animate-fade-in ${
                  !item.available ? 'opacity-50' : ''
                }`}
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-lg">{item.name}</span>
                    <span className="text-foodie-600 font-bold">${item.price.toFixed(2)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full"
                    variant={item.available ? "default" : "outline"}
                    disabled={!item.available}
                    onClick={() => handleAddToOrder(item)}
                  >
                    {item.available ? (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add to Order
                      </>
                    ) : (
                      "Not Available"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItems;


import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { state, dispatch } = useOrder();
  const { currentOrder, isCartOpen } = state;
  const { toast } = useToast();
  const [tableNumber, setTableNumber] = useState('');
  
  const handleCloseCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  
  const handleRemoveItem = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_ORDER', payload: itemId });
  };
  
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
    } else {
      dispatch({ type: 'REMOVE_FROM_ORDER', payload: id });
    }
  };
  
  const handlePlaceOrder = () => {
    if (!tableNumber) {
      toast({
        title: "Table number required",
        description: "Please enter a table number before placing your order",
        variant: "destructive",
      });
      return;
    }
    
    if (currentOrder.items.length === 0) {
      toast({
        title: "Empty order",
        description: "Please add items to your order before proceeding",
        variant: "destructive",
      });
      return;
    }
    
    dispatch({ type: 'SET_TABLE', payload: tableNumber });
    
    setTimeout(() => {
      dispatch({ type: 'PLACE_ORDER' });
      toast({
        title: "Order placed",
        description: "Your order has been sent to the kitchen",
      });
    }, 100);
  };
  
  const totalAmount = currentOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  if (!isCartOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Order
          </h2>
          <Button variant="ghost" size="icon" onClick={handleCloseCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-grow overflow-auto p-4">
          {currentOrder.items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2">Your cart is empty</p>
              <p className="text-sm">Add items from the menu to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentOrder.items.map((item) => (
                <Card key={item.id} className="p-4 flex items-center">
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold">${totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Table Number</label>
            <Input 
              type="text" 
              placeholder="Enter table number" 
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
          
          <Button 
            className="w-full"
            disabled={currentOrder.items.length === 0}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

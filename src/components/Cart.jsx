
import React, { useState } from 'react';
import { X, Minus, Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useOrder } from '@/context/OrderContext';

const Cart = () => {
  const { state, dispatch } = useOrder();
  const { currentOrder, isCartOpen } = state;
  const { toast } = useToast();
  const [tipPercentage, setTipPercentage] = useState(0);
  
  if (!isCartOpen) return null;
  
  const handleUpdateQuantity = (id, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity },
    });
  };
  
  const handleRemoveItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_ORDER', payload: id });
  };
  
  const handleConfirmOrder = () => {
    if (!currentOrder || currentOrder.items.length === 0) {
      toast({
        title: "Cannot place empty order",
        description: "Please add items to your order first",
        variant: "destructive",
      });
      return;
    }
    
    dispatch({ type: 'CONFIRM_ORDER' });
    dispatch({ type: 'TOGGLE_CART' });
    
    toast({
      title: "Order Confirmed!",
      description: "Your order has been sent to the kitchen",
    });
  };
  
  const handleAddTip = (percentage) => {
    if (!currentOrder) return;
    
    setTipPercentage(percentage);
    
    const subtotal = currentOrder.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    
    const tipAmount = subtotal * (percentage / 100);
    
    dispatch({
      type: 'ADD_TIP',
      payload: tipAmount,
    });
  };
  
  // Calculate subtotal
  const subtotal = currentOrder?.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ) || 0;
  
  const tipAmount = currentOrder?.tipAmount || 0;
  const total = subtotal + tipAmount;
  
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      />
      <div className="bg-white w-full max-w-md h-full overflow-auto shadow-xl animate-slide-in">
        <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Order</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          {(!currentOrder || currentOrder.items.length === 0) ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Your cart is empty</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentOrder.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-md flex justify-between">
                        <span>{item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Add a Tip</h3>
                <div className="flex space-x-2 mb-4">
                  {[10, 15, 20].map((percentage) => (
                    <Button
                      key={percentage}
                      variant={tipPercentage === percentage ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => handleAddTip(percentage)}
                    >
                      {percentage}%
                    </Button>
                  ))}
                  <Button
                    variant={tipPercentage === 0 ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => handleAddTip(0)}
                  >
                    No Tip
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleConfirmOrder}
              >
                Confirm Order
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

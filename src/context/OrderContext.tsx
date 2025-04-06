
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define types for menu item and order
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
};

export type OrderItem = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  status: 'draft' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  table: number;
  timestamp: Date;
  tipAmount: number;
  total: number;
};

// State type
type StateType = {
  menuItems: MenuItem[];
  currentOrder: Order | null;
  orders: Order[];
  isCartOpen: boolean;
};

// Initial state
const initialState: StateType = {
  menuItems: [
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, and special sauce',
      price: 12.99,
      image: '/placeholder.svg',
      category: 'Mains',
      available: true,
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with Caesar dressing and croutons',
      price: 9.99,
      image: '/placeholder.svg',
      category: 'Starters',
      available: true,
    },
    {
      id: '3',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 14.99,
      image: '/placeholder.svg',
      category: 'Mains',
      available: true,
    },
    {
      id: '4',
      name: 'Grilled Salmon',
      description: 'Fresh salmon fillet with lemon butter sauce',
      price: 17.99,
      image: '/placeholder.svg',
      category: 'Mains',
      available: true,
    },
    {
      id: '5',
      name: 'Chocolate Mousse',
      description: 'Rich and creamy chocolate dessert',
      price: 6.99,
      image: '/placeholder.svg',
      category: 'Desserts',
      available: true,
    },
    {
      id: '6',
      name: 'French Fries',
      description: 'Crispy golden fries with sea salt',
      price: 4.99,
      image: '/placeholder.svg',
      category: 'Sides',
      available: true,
    },
  ],
  currentOrder: null,
  orders: [],
  isCartOpen: false,
};

// Action types
type ActionType =
  | { type: 'ADD_TO_ORDER'; payload: MenuItem }
  | { type: 'REMOVE_FROM_ORDER'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CONFIRM_ORDER' }
  | { type: 'ADD_TIP'; payload: number }
  | { type: 'UPDATE_ITEM_AVAILABILITY'; payload: { id: string; available: boolean } }
  | { type: 'TOGGLE_CART' };

// Reducer function
const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case 'ADD_TO_ORDER': {
      const newItem = action.payload;
      let order = state.currentOrder;
      
      if (!order) {
        order = {
          id: Math.random().toString(36).substr(2, 9),
          items: [],
          status: 'draft',
          table: 1, // Default table
          timestamp: new Date(),
          tipAmount: 0,
          total: 0,
        };
      }
      
      const existingItemIndex = order.items.findIndex(
        item => item.menuItemId === newItem.id
      );
      
      if (existingItemIndex >= 0) {
        // If item already exists, increment quantity
        const updatedItems = [...order.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        
        return {
          ...state,
          currentOrder: {
            ...order,
            items: updatedItems,
            total: calculateTotal(updatedItems, order.tipAmount),
          },
        };
      } else {
        // Add new item to order
        const newOrderItem: OrderItem = {
          id: Math.random().toString(36).substr(2, 9),
          menuItemId: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
        };
        
        const updatedItems = [...order.items, newOrderItem];
        
        return {
          ...state,
          currentOrder: {
            ...order,
            items: updatedItems,
            total: calculateTotal(updatedItems, order.tipAmount),
          },
        };
      }
    }
    
    case 'REMOVE_FROM_ORDER': {
      if (!state.currentOrder) return state;
      
      const itemId = action.payload;
      const updatedItems = state.currentOrder.items.filter(item => item.id !== itemId);
      
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: updatedItems,
          total: calculateTotal(updatedItems, state.currentOrder.tipAmount),
        },
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (!state.currentOrder) return state;
      
      const { id, quantity } = action.payload;
      let updatedItems;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        updatedItems = state.currentOrder.items.filter(item => item.id !== id);
      } else {
        // Update quantity
        updatedItems = state.currentOrder.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
      }
      
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: updatedItems,
          total: calculateTotal(updatedItems, state.currentOrder.tipAmount),
        },
      };
    }
    
    case 'CONFIRM_ORDER': {
      if (!state.currentOrder || state.currentOrder.items.length === 0) return state;
      
      const confirmedOrder = {
        ...state.currentOrder,
        status: 'confirmed' as const,
        timestamp: new Date(),
      };
      
      return {
        ...state,
        currentOrder: null,
        orders: [...state.orders, confirmedOrder],
      };
    }
    
    case 'ADD_TIP': {
      if (!state.currentOrder) return state;
      
      const tipAmount = action.payload;
      
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          tipAmount,
          total: calculateTotal(state.currentOrder.items, tipAmount),
        },
      };
    }
    
    case 'UPDATE_ITEM_AVAILABILITY': {
      const { id, available } = action.payload;
      
      const updatedMenuItems = state.menuItems.map(item =>
        item.id === id ? { ...item, available } : item
      );
      
      return {
        ...state,
        menuItems: updatedMenuItems,
      };
    }
    
    case 'TOGGLE_CART': {
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };
    }
    
    default:
      return state;
  }
};

// Helper function to calculate total
const calculateTotal = (items: OrderItem[], tipAmount: number): number => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return subtotal + tipAmount;
};

// Create context
const OrderContext = createContext<{
  state: StateType;
  dispatch: React.Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Context provider
export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook for using the context
export const useOrder = () => useContext(OrderContext);

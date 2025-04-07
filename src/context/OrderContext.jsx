
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Initial sample data for menu items
const sampleMenuItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce with mozzarella and basil',
    price: 12.99,
    image: 'https://source.unsplash.com/random/300x200/?pizza',
    category: 'Pizza',
    available: true
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Tomato sauce with mozzarella and pepperoni',
    price: 14.99,
    image: 'https://source.unsplash.com/random/300x200/?pepperoni',
    category: 'Pizza',
    available: true
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 8.99,
    image: 'https://source.unsplash.com/random/300x200/?salad',
    category: 'Salads',
    available: true
  },
  {
    id: '4',
    name: 'French Fries',
    description: 'Crispy golden fries served with ketchup',
    price: 4.99,
    image: 'https://source.unsplash.com/random/300x200/?fries',
    category: 'Sides',
    available: true
  },
  {
    id: '5',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with vanilla ice cream',
    price: 6.99,
    image: 'https://source.unsplash.com/random/300x200/?brownie',
    category: 'Desserts',
    available: false
  },
  {
    id: '6',
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with rich meat sauce',
    price: 13.99,
    image: 'https://source.unsplash.com/random/300x200/?pasta',
    category: 'Pasta',
    available: true
  },
];

// Initial sample data for orders
const sampleOrders = [
  {
    id: 'ord1',
    table: '5',
    items: [
      { id: '1', name: 'Margherita Pizza', price: 12.99, quantity: 2 },
      { id: '4', name: 'French Fries', price: 4.99, quantity: 1 }
    ],
    status: 'confirmed',
    timestamp: new Date().toISOString(),
    total: 30.97
  },
  {
    id: 'ord2',
    table: '3',
    items: [
      { id: '2', name: 'Pepperoni Pizza', price: 14.99, quantity: 1 },
      { id: '3', name: 'Caesar Salad', price: 8.99, quantity: 1 }
    ],
    status: 'preparing',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    total: 23.98
  }
];

// Initial state
const initialState = {
  menuItems: sampleMenuItems,
  orders: sampleOrders,
  currentOrder: {
    items: [],
    table: '',
    status: 'pending'
  },
  isCartOpen: false
};

// Reducer function
const orderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_ORDER': {
      const { payload: item } = action;
      const updatedItems = [...state.currentOrder.items];
      const existingItem = updatedItems.find(i => i.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        updatedItems.push({ ...item, quantity: 1 });
      }
      
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: updatedItems
        }
      };
    }
      
    case 'REMOVE_FROM_ORDER': {
      const { payload: itemId } = action;
      const updatedItems = [...state.currentOrder.items];
      const itemIndex = updatedItems.findIndex(i => i.id === itemId);
      
      if (itemIndex >= 0) {
        if (updatedItems[itemIndex].quantity > 1) {
          updatedItems[itemIndex].quantity -= 1;
        } else {
          updatedItems.splice(itemIndex, 1);
        }
      }
      
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: updatedItems
        }
      };
    }
      
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          currentOrder: {
            ...state.currentOrder,
            items: state.currentOrder.items.filter(item => item.id !== id)
          }
        };
      }
      
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        }
      };
    }
      
    case 'CLEAR_ORDER':
      return {
        ...state,
        currentOrder: {
          items: [],
          table: '',
          status: 'pending'
        }
      };
      
    case 'SET_TABLE':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          table: action.payload
        }
      };
      
    case 'TOGGLE_CART':
      return {
        ...state,
        isCartOpen: !state.isCartOpen
      };
      
    case 'PLACE_ORDER': {
      const { table, items } = state.currentOrder;
      
      if (!table || items.length === 0) {
        return state;
      }
      
      const newOrder = {
        id: `ord${Date.now()}`,
        table,
        items: [...items],
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        currentOrder: {
          items: [],
          table: '',
          status: 'pending'
        },
        isCartOpen: false
      };
    }
      
    case 'UPDATE_ORDER_STATUS': {
      const { id, status } = action.payload;
      
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === id ? { ...order, status } : order
        )
      };
    }
      
    case 'UPDATE_ITEM_AVAILABILITY': {
      const { id, available } = action.payload;
      
      return {
        ...state,
        menuItems: state.menuItems.map(item => 
          item.id === id ? { ...item, available } : item
        )
      };
    }
      
    default:
      return state;
  }
};

// Create context
const OrderContext = createContext(null);

// Provider component
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    // You could load data from localStorage or an API here
    console.log('OrderContext initialized');
  }, []);
  
  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the context
export const useOrder = () => {
  const context = useContext(OrderContext);
  
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  
  return context;
};

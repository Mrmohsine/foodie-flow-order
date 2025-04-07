
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/context/OrderContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { to: '/', label: 'Menu', role: 'customer' },
  { to: '/kitchen', label: 'Kitchen', role: 'kitchen' },
  { to: '/reception', label: 'Reception', role: 'reception' },
  { to: '/owner', label: 'Owner', role: 'owner' },
  { to: '/supplier', label: 'Supplier', role: 'supplier' },
];

const Layout = ({ children }) => {
  const location = useLocation();
  const { state, dispatch } = useOrder();
  const { currentOrder, isCartOpen } = state;
  
  const itemCount = currentOrder?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-foodie-500">
              FoodieFlow
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`py-2 px-3 rounded-md font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-foodie-100 text-foodie-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Cart button - Only show on menu page */}
          {location.pathname === '/' && (
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-foodie-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          )}
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`py-2 px-3 rounded-md font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'bg-foodie-100 text-foodie-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} FoodieFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

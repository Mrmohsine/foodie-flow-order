
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <div className="min-h-screen-content flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to FoodieFlow</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          Your one-stop solution for restaurant management and food ordering
        </p>
        
        {!isAuthenticated ? (
          <div className="flex gap-4 mt-4">
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        ) : (
          <Button asChild>
            <Link to="/menu">View Menu</Link>
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default Index;


import React from 'react';
import Layout from '@/components/Layout';
import MenuItems from '@/components/MenuItems';
import Cart from '@/components/Cart';

const MenuPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-600">Browse our selection of delicious dishes</p>
        </div>
        <MenuItems />
        <Cart />
      </div>
    </Layout>
  );
};

export default MenuPage;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Page components
import MenuPage from "./pages/MenuPage.jsx";
import KitchenPage from "./pages/KitchenPage.jsx";
import ReceptionPage from "./pages/ReceptionPage.jsx";
import OwnerPage from "./pages/OwnerPage.jsx";
import SupplierPage from "./pages/SupplierPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <OrderProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={<MenuPage />} />
              <Route 
                path="/kitchen" 
                element={
                  <ProtectedRoute requiredRoles={['kitchen', 'admin']}>
                    <KitchenPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reception" 
                element={
                  <ProtectedRoute requiredRoles={['reception', 'admin']}>
                    <ReceptionPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/owner" 
                element={
                  <ProtectedRoute requiredRoles={['owner', 'admin']}>
                    <OwnerPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/supplier" 
                element={
                  <ProtectedRoute requiredRoles={['supplier', 'admin']}>
                    <SupplierPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

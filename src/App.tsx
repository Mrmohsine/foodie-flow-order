
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderProvider } from "@/context/OrderContext";

// Page components
import MenuPage from "./pages/MenuPage";
import KitchenPage from "./pages/KitchenPage";
import ReceptionPage from "./pages/ReceptionPage";
import OwnerPage from "./pages/OwnerPage";
import SupplierPage from "./pages/SupplierPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OrderProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/kitchen" element={<KitchenPage />} />
            <Route path="/reception" element={<ReceptionPage />} />
            <Route path="/owner" element={<OwnerPage />} />
            <Route path="/supplier" element={<SupplierPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

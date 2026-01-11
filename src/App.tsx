import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import ExpertDashboard from "./pages/ExpertDashboard";
import ChatBot from "./pages/ChatBot";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import WeatherDetails from "./pages/WeatherDetails";
import MandiRates from "./pages/MandiRates";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import SoilHealth from "./pages/SoilHealth";
import CropAdvisory from "./pages/CropAdvisory";
import FertilizerAssistant from "./pages/FertilizerAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/KEISHISAKHI">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/expert-dashboard" element={<ExpertDashboard />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/weather" element={<WeatherDetails />} />
          <Route path="/mandi-rates" element={<MandiRates />} />
          <Route path="/government-schemes" element={<GovernmentSchemes />} />
          <Route path="/soil-health" element={<SoilHealth />} />
          <Route path="/crop-advisory" element={<CropAdvisory />} />
          <Route path="/fertilizer-assistant" element={<FertilizerAssistant />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
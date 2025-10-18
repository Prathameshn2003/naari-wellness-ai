import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PCOSPrediction from "./pages/prediction/PCOSPrediction";
import MenstruationTracker from "./pages/prediction/MenstruationTracker";
import MenopausePrediction from "./pages/prediction/MenopausePrediction";
import ChatPage from "./pages/ChatPage";
import Resources from "./pages/Resources";
import Gynecologists from "./pages/Gynecologists";
import Schemes from "./pages/Schemes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction/pcos" element={<PCOSPrediction />} />
          <Route path="/prediction/menstruation" element={<MenstruationTracker />} />
          <Route path="/prediction/menopause" element={<MenopausePrediction />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/gynecologists" element={<Gynecologists />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

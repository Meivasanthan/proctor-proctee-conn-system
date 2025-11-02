import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentHome from "./pages/StudentHome";
import StaffHome from "./pages/StaffHome";
import NotFound from "./pages/NotFound";
import StudentViews from "./components/StudentViews";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student-home" element={<StudentHome />} />
      <Route path="/staff-home" element={<StaffHome />} />
      <Route path="/students/:id" element={<StudentViews />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

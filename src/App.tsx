import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import QuizSetup from "./pages/QuizSetup";
import QuizPlay from "./pages/QuizPlay";
import QuizResults from "./pages/QuizResults";
import PictureMemory from "./pages/PictureMemory";
import Minesweeper from "./pages/Minesweeper";
import PathPuzzle from "./pages/PathPuzzle";
import UnscrambleWord from "./pages/UnscrambleWord";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="brain-blast-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quiz/:category" element={<QuizSetup />} />
            <Route path="/quiz/:category/play" element={<QuizPlay />} />
            <Route path="/quiz/results" element={<QuizResults />} />
            <Route path="/games/picture-memory" element={<PictureMemory />} />
            <Route path="/games/minesweeper" element={<Minesweeper />} />
            <Route path="/games/path-puzzle" element={<PathPuzzle />} />
            <Route path="/games/unscramble" element={<UnscrambleWord />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
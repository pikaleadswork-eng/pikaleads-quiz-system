import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ThankYou from "./pages/ThankYou";
import MetaFurniture from "./pages/MetaFurniture";
import MetaRepair from "./pages/MetaRepair";
import MetaEcom from "./pages/MetaEcom";
import MetaProducts from "./pages/MetaProducts";
import MetaTelegram from "./pages/MetaTelegram";
import GoogleFurniture from "./pages/GoogleFurniture";
import GoogleRepair from "./pages/GoogleRepair";
import GoogleEcom from "./pages/GoogleEcom";
import GoogleProducts from "./pages/GoogleProducts";
import GoogleTelegram from "./pages/GoogleTelegram";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/thank-you"} component={ThankYou} />
      
      {/* META Ads Quizzes */}
      <Route path={"/meta-furniture"} component={MetaFurniture} />
      <Route path={"/meta-repair"} component={MetaRepair} />
      <Route path={"/meta-ecom"} component={MetaEcom} />
      <Route path={"/meta-products"} component={MetaProducts} />
      <Route path={"/meta-telegram"} component={MetaTelegram} />
      
      {/* Google Ads Quizzes */}
      <Route path={"/google-furniture"} component={GoogleFurniture} />
      <Route path={"/google-repair"} component={GoogleRepair} />
      <Route path={"/google-ecom"} component={GoogleEcom} />
      <Route path={"/google-products"} component={GoogleProducts} />
      <Route path={"/google-telegram"} component={GoogleTelegram} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

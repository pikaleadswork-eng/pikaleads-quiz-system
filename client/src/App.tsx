import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { CookieConsent } from "@/components/CookieConsent";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
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
import Admin from "./pages/Admin";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminABTests from "./pages/AdminABTests";
import AdminManagers from "./pages/AdminManagers";
import AdminAnalytics from "./pages/AdminAnalytics";
import CRM from "./pages/CRM";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import RegisterManager from "./pages/RegisterManager";

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
      
      {/* Admin Panel */}
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/quizzes"} component={AdminQuizzes} />
      <Route path={"/admin/ab-tests"} component={AdminABTests} />
      <Route path={"/admin/managers"} component={AdminManagers} />
      <Route path={"/admin/analytics"} component={AdminAnalytics} />
      
      {/* CRM */}
      <Route path={"/crm"} component={CRM} />
      
      {/* Legal Pages */}
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/contact"} component={Contact} />
      
      {/* Manager Registration */}
      <Route path={"/register-manager"} component={RegisterManager} />
      
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
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <CookieConsent />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

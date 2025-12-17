import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { CookieConsent } from "@/components/CookieConsent";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
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
import AdminDashboard from "./pages/AdminDashboard";
import AdminQuizzes from "./pages/AdminQuizzes";
import QuizAnalytics from "./pages/QuizAnalytics";
import QuizDesignPage from "./pages/QuizDesignPage";
import AdminABTests from "./pages/AdminABTests";
import AdminManagers from "./pages/AdminManagers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminAssignmentRules from "./pages/AdminAssignmentRules";
import AdminPerformance from "./pages/AdminPerformance";
import AdminRetargeting from "./pages/AdminRetargeting";
import AdminMessaging from "./pages/AdminMessaging";
import MessagingInbox from "./pages/MessagingInbox";
import SalesStatistics from "./pages/SalesStatistics";
import SalesScripts from "./pages/SalesScripts";
import AdminSettings from "./pages/AdminSettings";
import { SettingsRoles } from "./pages/SettingsRoles";
import { SettingsLeadStatuses } from "./pages/SettingsLeadStatuses";
import { SettingsIPTelephony } from "./pages/SettingsIPTelephony";
import ServicesManagement from "./pages/ServicesManagement";
import { ServerMonitoring } from "./pages/ServerMonitoring";
import LeadAssignment from "./pages/LeadAssignment";
import CRMDashboard from "./pages/CRMDashboard";
import AdminCalendar from "./pages/AdminCalendar";
import AdminWebhooks from "./pages/AdminWebhooks";
import { PipelineDashboard } from "./pages/PipelineDashboard";
import { AttributionReport } from "./pages/AttributionReport";
import ManagerDashboard from "./pages/ManagerDashboard";
import CRM from "./pages/CRM";
import EventsDashboard from "./pages/EventsDashboard";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";

import FurnitureQuiz from "./pages/FurnitureQuiz";
import ApartmentRenovationQuiz from "./pages/ApartmentRenovationQuiz";
import ECommerceQuiz from "./pages/ECommerceQuiz";
import QuizPage from "./pages/QuizPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/thank-you"} component={ThankYou} />
      
      {/* Dynamic Quiz Page - must be before static routes */}
      <Route path={"/quiz/:slug"} component={QuizPage} />
      
      {/* New Quiz Pages with Offers */}
      <Route path={"/quiz/furniture"} component={FurnitureQuiz} />
      <Route path={"/quiz/apartment-renovation"} component={ApartmentRenovationQuiz} />
      <Route path={"/quiz/e-commerce"} component={ECommerceQuiz} />
      
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
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/quizzes"} component={AdminQuizzes} />
      <Route path={"/admin/quizzes/:id/analytics"} component={QuizAnalytics} />
      <Route path={"/admin/quizzes/:quizId/design"} component={QuizDesignPage} />
      <Route path={"/admin/ab-tests"} component={AdminABTests} />
      <Route path={"/admin/ab-testing"} component={AdminABTests} />
      <Route path={"/admin/managers"} component={AdminManagers} />
      <Route path={"/admin/analytics"} component={AdminAnalytics} />
      <Route path={"/admin/assignment-rules"} component={AdminAssignmentRules} />
      <Route path={"/admin/performance"} component={AdminPerformance} />
      <Route path={"/admin/retargeting"} component={AdminRetargeting} />
      <Route path={"/admin/messaging"} component={AdminMessaging} />
      <Route path={"/admin/inbox"} component={MessagingInbox} />
      <Route path={"/admin/sales"} component={SalesStatistics} />
      <Route path={"/admin/scripts"} component={SalesScripts} />
      <Route path={"/admin/services"} component={ServicesManagement} />
      <Route path={"/admin/settings"} component={AdminSettings} />
      <Route path={"/admin/settings/roles"} component={SettingsRoles} />
      <Route path={"/admin/settings/lead-statuses"} component={SettingsLeadStatuses} />
      <Route path={"/admin/settings/ip-telephony"} component={SettingsIPTelephony} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/admin/settings/lead-assignment"} component={LeadAssignment} />
      <Route path={"/admin/monitoring"} component={ServerMonitoring} />
      <Route path={"/admin/calendar"} component={AdminCalendar} />
      <Route path={"/admin/webhooks"} component={AdminWebhooks} />
      <Route path={"/admin/events"} component={EventsDashboard} />
      
      {/* CRM & Manager Dashboard */}
      <Route path={"/manager"} component={ManagerDashboard} />
      <Route path={"/crm-dashboard"} component={CRMDashboard} />
      <Route path={"/crm"} component={CRM} />
      
      {/* Analytics Dashboards */}
      <Route path={"/admin/pipeline"} component={PipelineDashboard} />
      <Route path={"/admin/attribution"} component={AttributionReport} />
      
      {/* Legal Pages */}
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/contact"} component={Contact} />
      

      
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
            <AnalyticsScripts />
            <Router />
            <CookieConsent />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

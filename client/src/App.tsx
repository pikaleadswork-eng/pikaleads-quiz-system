import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { CookieConsent } from "@/components/CookieConsent";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Agency Website Pages
import AgencyHome from "./pages/agency/AgencyHome";

// Quiz System Pages (moved to /quiz-service)
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
import FurnitureQuiz from "./pages/FurnitureQuiz";
import ApartmentRenovationQuiz from "./pages/ApartmentRenovationQuiz";
import ECommerceQuiz from "./pages/ECommerceQuiz";
import QuizPage from "./pages/QuizPage";

// Admin & CRM Pages
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
import Login from "./pages/Login";
import Profile from "./pages/Profile";

// Legal Pages
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Disclaimer from "./pages/Disclaimer";

function Router() {
  return (
    <Switch>
      {/* ========== AGENCY WEBSITE (Main Domain) ========== */}
      <Route path={"/"} component={AgencyHome} />
      
      {/* Legal Pages (accessible from main site) */}
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/cookie-policy"} component={CookiePolicy} />
      <Route path={"/disclaimer"} component={Disclaimer} />
      
      {/* ========== QUIZ SERVICE (Subdirectory) ========== */}
      <Route path={"/quiz-service"} component={Home} />
      <Route path={"/quiz-service/login"} component={Login} />
      <Route path={"/quiz-service/thank-you"} component={ThankYou} />
      
      {/* Dynamic Quiz Page - must be before static routes */}
      <Route path={"/quiz-service/quiz/:slug"} component={QuizPage} />
      
      {/* New Quiz Pages with Offers */}
      <Route path={"/quiz-service/quiz/furniture"} component={FurnitureQuiz} />
      <Route path={"/quiz-service/quiz/apartment-renovation"} component={ApartmentRenovationQuiz} />
      <Route path={"/quiz-service/quiz/e-commerce"} component={ECommerceQuiz} />
      
      {/* META Ads Quizzes */}
      <Route path={"/quiz-service/meta-furniture"} component={MetaFurniture} />
      <Route path={"/quiz-service/meta-repair"} component={MetaRepair} />
      <Route path={"/quiz-service/meta-ecom"} component={MetaEcom} />
      <Route path={"/quiz-service/meta-products"} component={MetaProducts} />
      <Route path={"/quiz-service/meta-telegram"} component={MetaTelegram} />
      
      {/* Google Ads Quizzes */}
      <Route path={"/quiz-service/google-furniture"} component={GoogleFurniture} />
      <Route path={"/quiz-service/google-repair"} component={GoogleRepair} />
      <Route path={"/quiz-service/google-ecom"} component={GoogleEcom} />
      <Route path={"/quiz-service/google-products"} component={GoogleProducts} />
      <Route path={"/quiz-service/google-telegram"} component={GoogleTelegram} />
      
      {/* ========== CRM & ADMIN (under /quiz-service) ========== */}
      <Route path={"/quiz-service/admin"} component={AdminDashboard} />
      <Route path={"/quiz-service/admin/quizzes"} component={AdminQuizzes} />
      <Route path={"/quiz-service/admin/quizzes/:id/analytics"} component={QuizAnalytics} />
      <Route path={"/quiz-service/admin/quizzes/:quizId/design"} component={QuizDesignPage} />
      <Route path={"/quiz-service/admin/ab-tests"} component={AdminABTests} />
      <Route path={"/quiz-service/admin/ab-testing"} component={AdminABTests} />
      <Route path={"/quiz-service/admin/managers"} component={AdminManagers} />
      <Route path={"/quiz-service/admin/analytics"} component={AdminAnalytics} />
      <Route path={"/quiz-service/admin/assignment-rules"} component={AdminAssignmentRules} />
      <Route path={"/quiz-service/admin/performance"} component={AdminPerformance} />
      <Route path={"/quiz-service/admin/retargeting"} component={AdminRetargeting} />
      <Route path={"/quiz-service/admin/messaging"} component={AdminMessaging} />
      <Route path={"/quiz-service/admin/inbox"} component={MessagingInbox} />
      <Route path={"/quiz-service/admin/sales"} component={SalesStatistics} />
      <Route path={"/quiz-service/admin/scripts"} component={SalesScripts} />
      <Route path={"/quiz-service/admin/services"} component={ServicesManagement} />
      <Route path={"/quiz-service/admin/settings"} component={AdminSettings} />
      <Route path={"/quiz-service/admin/settings/roles"} component={SettingsRoles} />
      <Route path={"/quiz-service/admin/settings/lead-statuses"} component={SettingsLeadStatuses} />
      <Route path={"/quiz-service/admin/settings/ip-telephony"} component={SettingsIPTelephony} />
      <Route path={"/quiz-service/profile"} component={Profile} />
      <Route path={"/quiz-service/admin/settings/lead-assignment"} component={LeadAssignment} />
      <Route path={"/quiz-service/admin/monitoring"} component={ServerMonitoring} />
      <Route path={"/quiz-service/admin/calendar"} component={AdminCalendar} />
      <Route path={"/quiz-service/admin/webhooks"} component={AdminWebhooks} />
      <Route path={"/quiz-service/admin/events"} component={EventsDashboard} />
      
      {/* CRM & Manager Dashboard */}
      <Route path={"/quiz-service/manager"} component={ManagerDashboard} />
      <Route path={"/quiz-service/crm-dashboard"} component={CRMDashboard} />
      <Route path={"/quiz-service/crm"} component={CRM} />
      
      {/* Analytics Dashboards */}
      <Route path={"/quiz-service/admin/pipeline"} component={PipelineDashboard} />
      <Route path={"/quiz-service/admin/attribution"} component={AttributionReport} />
      
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

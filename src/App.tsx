import { useState, useEffect } from "react";
import { ClientProvider } from "./contexts/ClientContext";
import { AdminLayout } from "./components/AdminLayout";
import { Dashboard } from "./components/Dashboard";
import { MembersPage } from "./components/MembersPage";
import { PlansPage } from "./components/PlansPage";
import { CustomerPreferencesPage } from "./components/CustomerPreferencesPage";
import { ShipmentBuilderPage } from "./components/ShipmentBuilderPage";
import { SquareConfigPage } from "./components/SquareConfigPage";
import { FulfillmentPage } from "./components/FulfillmentPage";
import { SuperadminDashboard } from "./components/SuperadminDashboard";
import { SuperadminLayout } from "./components/SuperadminLayout";
import { OrganizationsPage } from "./components/ClubsOrganizationsPage";
import { UsersPage } from "./components/ClubsUsersPage";
import { BillingPage } from "./components/BillingPage";
import { MarketingIntegration } from "./components/MarketingIntegration";
import { ShippingSchedulePage } from "./components/ShippingSchedulePage";
import { EmbeddableSignupPage } from "./components/EmbeddableSignupPage";
import { AuthPage } from "./components/AuthPage";
import { AuthCallback } from "./components/AuthCallback";
import { ResetPassword } from "./components/ResetPassword";
import { EmbeddedSignup } from "./components/EmbeddedSignup";
import { WineSelectionReview } from "./components/customer/WineSelectionReview";
import { BonusUpsell } from "./components/customer/BonusUpsell";
import { DeliveryDateConfirmation } from "./components/customer/DeliveryDateConfirmation";
import { PaymentCollection } from "./components/customer/PaymentCollection";
import { WelcomeToast } from "./components/WelcomeToast";
import { Toaster } from "./components/ui/sonner";
import { api } from "./utils/api";

type AdminPage = "dashboard" | "members" | "shipments" | "fulfillment" | "square-config" | "superadmin" | "marketing" | "shipping-schedule" | "embeddable-signup";
type SuperadminPage = "saas-dashboard" | "organizations" | "users" | "billing" | "settings";
type CustomerStep = "wine-selection" | "upsell" | "delivery" | "payment" | "preferences" | "payment-collection";
type AppMode = "admin" | "superadmin" | "customer" | "auth" | "signup" | "auth-callback" | "reset-password";

export default function App() {
  return (
    <ClientProvider>
      <AppContent />
    </ClientProvider>
  );
}

function AppContent() {
  const [appMode, setAppMode] = useState<AppMode>("auth");
  const [currentPage, setCurrentPage] = useState<AdminPage>("dashboard");
  const [currentSuperadminPage, setCurrentSuperadminPage] = useState<SuperadminPage>("saas-dashboard");
  const [customerStep, setCustomerStep] = useState<CustomerStep>("wine-selection");
  const [isDemoMode, setIsDemoMode] = useState<boolean | null>(null);
  const [isCheckingDemoMode, setIsCheckingDemoMode] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const [authSuccess, setAuthSuccess] = useState<string>("");

  const handlePageChange = (page: string) => {
    if (page === "customer-portal") {
      setAppMode("customer");
      setCustomerStep("wine-selection");
    } else if (page === "embedded-signup") {
      setAppMode("signup");
    } else {
      setCurrentPage(page as AdminPage);
    }
  };

  const handleAuth = (method: 'password' | 'magic-link', email: string, password?: string) => {
    setAuthError("");
    setAuthSuccess("");
    
    if (method === 'magic-link') {
      setAuthSuccess("Magic link sent to your email! Check your inbox and click the link to sign in.");
      return;
    }
    
    // Route different user types to appropriate dashboards
    if (email && password) {
      if (email === 'jimmy@arccom.io') {
        // SaaS Admin - Jimmy ArcCom
        setAppMode("superadmin");
        setCurrentSuperadminPage("saas-dashboard");
      } else if (email === 'klausbellinghausen@gmail.com') {
        // Wine Club Owner - Klaus Bellinghausen
        setAppMode("admin");
        setCurrentPage("dashboard");
      } else if (email === 'demo@wineclub.com') {
        // Demo account
        setAppMode("admin");
        setCurrentPage("dashboard");
      } else {
        // Check if this is a wine club member trying to login
        // For now, show error message directing them to wine club domain
        setAuthError("Members should login at their wine club's website. Please contact your wine club administrator for the correct login URL.");
        return;
      }
    } else {
      setAuthError("Please check your credentials and try again.");
    }
  };

  const handleLogout = () => {
    setAppMode("auth");
    setAuthError("");
    setAuthSuccess("");
  };

  const handleSignup = (data: any) => {
    console.log("New member signup:", data);
    // This would create the member in Supabase and Square
    setAppMode("customer");
    setCustomerStep("payment-collection");
  };

  const handlePaymentSaved = (paymentMethodId: string) => {
    console.log("Payment method saved:", paymentMethodId);
    setCustomerStep("wine-selection");
  };

  const handleCustomerNext = () => {
    switch (customerStep) {
      case "wine-selection":
        setCustomerStep("upsell");
        break;
      case "upsell":
        setCustomerStep("delivery");
        break;
      case "delivery":
        setCustomerStep("payment");
        break;
      case "payment":
        setCustomerStep("preferences");
        break;
      default:
        break;
    }
  };

  const handleCustomerBack = () => {
    switch (customerStep) {
      case "upsell":
        setCustomerStep("wine-selection");
        break;
      case "delivery":
        setCustomerStep("upsell");
        break;
      case "payment":
        setCustomerStep("delivery");
        break;
      default:
        break;
    }
  };

  const refreshDemoMode = async () => {
    if (isCheckingDemoMode) return;
    
    setIsCheckingDemoMode(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await api.getLiveInventory("1", 'all', 1);
      clearTimeout(timeoutId);
      setIsDemoMode(!!response.isDemoMode);
    } catch (error: any) {
      console.log('Demo mode refresh failed:', error.message);
      setIsDemoMode(true);
    } finally {
      setIsCheckingDemoMode(false);
    }
  };

  // Check demo mode status on app load only
  useEffect(() => {
    const checkDemoMode = async () => {
      try {
        // Use a very lightweight API call with short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await api.getLiveInventory("1", 'all', 1);
        clearTimeout(timeoutId);
        setIsDemoMode(!!response.isDemoMode);
      } catch (error: any) {
        console.log('Demo mode check failed, assuming demo mode:', error.message);
        setIsDemoMode(true); // Assume demo mode if there's an error
      }
    };
    
    // Small delay to let the app render first
    const timer = setTimeout(checkDemoMode, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderSuperadminPage = () => {
    switch (currentSuperadminPage) {
      case "saas-dashboard":
        return <SuperadminDashboard />;
      case "organizations":
        return <OrganizationsPage />;
      case "users":
        return <UsersPage />;
      case "billing":
        return <BillingPage />;
      case "settings":
        return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">System Settings</h2>
              <p className="text-gray-600 mb-6">Platform configuration and settings</p>
            </div>
          </div>
        );
      default:
        return <SuperadminDashboard />;
    }
  };

  const renderAdminPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "members":
        return <MembersPage />;
      case "shipments":
        return <ShipmentBuilderPage />;
      case "fulfillment":
        return <FulfillmentPage />;
      case "square-config":
        return <SquareConfigPage />;
      case "superadmin":
        // Switch to superadmin mode
        setAppMode("superadmin");
        return <SuperadminDashboard />;
      case "marketing":
        return <MarketingIntegration />;
      case "shipping-schedule":
        return <ShippingSchedulePage />;
      case "embeddable-signup":
        return <EmbeddableSignupPage />;
      default:
        return <Dashboard />;
    }
  };

  const renderCustomerStep = () => {
    switch (customerStep) {
      case "wine-selection":
        return <WineSelectionReview onNext={handleCustomerNext} />;
      case "upsell":
        return (
          <BonusUpsell 
            onNext={handleCustomerNext}
            onSkip={handleCustomerNext}
          />
        );
      case "delivery":
        return (
          <DeliveryDateConfirmation 
            onNext={handleCustomerNext}
            onBack={handleCustomerBack}
          />
        );
      case "payment-collection":
        return (
          <PaymentCollection
            memberName="John Doe"
            shipmentTotal={180}
            discount={15}
            onPaymentSaved={handlePaymentSaved}
            onSkip={() => setCustomerStep("wine-selection")}
          />
        );
      case "payment":
        return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">Payment Processing</h2>
              <p className="text-gray-600 mb-6">This would integrate with Square Web Payments SDK</p>
              <button 
                onClick={() => setAppMode("admin")}
                className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-serif"
              >
                Return to Admin Panel
              </button>
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-serif text-gray-900 mb-4">Preference Selection</h2>
              <p className="text-gray-600 mb-6">Recurring vs. Surprise selections modal</p>
              <button 
                onClick={() => setAppMode("admin")}
                className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-serif"
              >
                Return to Admin Panel
              </button>
            </div>
          </div>
        );
      default:
        return <WineSelectionReview onNext={handleCustomerNext} />;
    }
  };

  // Auth flow
  // Handle URL-based auth routes
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/auth/callback') {
      setAppMode('auth-callback');
    } else if (path === '/auth/reset-password') {
      setAppMode('reset-password');
    }
  }, []);

  // Auth callback page
  if (appMode === "auth-callback") {
    return <AuthCallback />;
  }

  // Reset password page
  if (appMode === "reset-password") {
    return <ResetPassword />;
  }

  if (appMode === "auth") {
    return (
      <>
        <WelcomeToast />
        <Toaster position="top-right" />
        <AuthPage 
          onAuth={handleAuth} 
          onSignupClick={() => setAppMode("signup")}
          error={authError}
          successMessage={authSuccess}
        />
      </>
    );
  }

  // Embedded signup flow
  if (appMode === "signup") {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
          <div className="max-w-2xl mx-auto mb-4">
            <button
              onClick={() => setAppMode("auth")}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Back to Login
            </button>
          </div>
          <EmbeddedSignup onSignup={handleSignup} wineClubId="1" />
        </div>
      </>
    );
  }

  // Customer portal
  if (appMode === "customer") {
    return (
      <>
        <Toaster position="top-right" />
        {renderCustomerStep()}
      </>
    );
  }

  // Admin portal (authenticated)
  if (appMode === "admin") {
    return (
      <>
        <Toaster position="top-right" />
        {isDemoMode && (
          <div className="bg-red-50 border-b-2 border-red-300 px-4 py-3">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Square API Authentication Error (401)
                  </p>
                  <p className="text-xs text-red-700">
                    Your Square access token is missing or invalid. Click below to fix it in 2 minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange('square-diagnostic')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Fix Authentication →
                </button>
                <button 
                  onClick={refreshDemoMode}
                  disabled={isCheckingDemoMode}
                  className="text-xs text-red-700 hover:text-red-900 underline disabled:opacity-50 px-2"
                >
                  {isCheckingDemoMode ? 'Checking...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>
        )}
        <AdminLayout currentPage={currentPage} onPageChange={handlePageChange} onLogout={handleLogout}>
          {renderAdminPage()}
        </AdminLayout>
      </>
    );
  }

  // Superadmin portal
  if (appMode === "superadmin") {
    return (
      <>
        <Toaster position="top-right" />
        <SuperadminLayout 
          currentPage={currentSuperadminPage} 
          onPageChange={(page) => {
            if (page === "dashboard") {
              setAppMode("admin");
            } else {
              setCurrentSuperadminPage(page as SuperadminPage);
            }
          }} 
          onLogout={handleLogout}
        >
          {renderSuperadminPage()}
        </SuperadminLayout>
      </>
    );
  }

  // Default fallback
  return (
    <>
      <Toaster position="top-right" />
      <AdminLayout currentPage={currentPage} onPageChange={handlePageChange} onLogout={handleLogout}>
        {renderAdminPage()}
      </AdminLayout>
    </>
  );
}
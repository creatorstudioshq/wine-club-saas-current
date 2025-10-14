'use client'

import { useState, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Dashboard } from "../components/Dashboard";
import { MembersPage } from "../components/MembersPage";
import { InventoryPageSimple } from "../components/InventoryPageSimple";
import { PlansPage } from "../components/PlansPage";
import { CustomerPreferencesPage } from "../components/CustomerPreferencesPage";
import { ShipmentBuilderPage } from "../components/ShipmentBuilderPage";
import { SimpleSetupPage } from "../components/SimpleSetupPage";
import { SuperadminDashboard } from "../components/SuperadminDashboard";
import { MarketingIntegration } from "../components/MarketingIntegration";
import { SquareAuthDiagnostic } from "../components/SquareAuthDiagnostic";
import { AuthPage } from "../components/AuthPage";
import { EmbeddedSignup } from "../components/EmbeddedSignup";
import { WineSelectionReview } from "../components/customer/WineSelectionReview";
import { BonusUpsell } from "../components/customer/BonusUpsell";
import { DeliveryDateConfirmation } from "../components/customer/DeliveryDateConfirmation";
import { PaymentCollection } from "../components/customer/PaymentCollection";
import { WelcomeToast } from "../components/WelcomeToast";
import { Toaster } from "../components/ui/sonner";
import { api } from "../utils/api";

type AdminPage = "dashboard" | "members" | "inventory" | "plans" | "preferences" | "shipments" | "client-setup" | "superadmin" | "marketing" | "square-diagnostic";
type CustomerStep = "wine-selection" | "upsell" | "delivery" | "payment" | "preferences" | "payment-collection";
type AppMode = "admin" | "customer" | "auth" | "signup";

export default function HomePage() {
  const [appMode, setAppMode] = useState<AppMode>("auth");
  const [currentPage, setCurrentPage] = useState<AdminPage>("dashboard");
  const [customerStep, setCustomerStep] = useState<CustomerStep>("wine-selection");
  const [isDemoMode, setIsDemoMode] = useState<boolean | null>(null);
  const [isCheckingDemoMode, setIsCheckingDemoMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    
    // Simulate auth logic - in real app, this would call Supabase
    if (email && password) {
      setIsAuthenticated(true);
      setAppMode("admin");
    } else {
      setAuthError("Please check your credentials and try again.");
    }
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
      
      const response = await api.getLiveInventory("550e8400-e29b-41d4-a716-446655440000", 'all', 1);
      clearTimeout(timeoutId);
      setIsDemoMode(!!response.isDemoMode);
    } catch (error) {
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
        
        const response = await api.getLiveInventory("550e8400-e29b-41d4-a716-446655440000", 'all', 1);
        clearTimeout(timeoutId);
        setIsDemoMode(!!response.isDemoMode);
      } catch (error) {
        console.log('Demo mode check failed, assuming demo mode:', error.message);
        setIsDemoMode(true); // Assume demo mode if there's an error
      }
    };
    
    // Small delay to let the app render first
    const timer = setTimeout(checkDemoMode, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderAdminPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "members":
        return <MembersPage />;
      case "inventory":
        return <InventoryPageSimple />;
      case "plans":
        return <PlansPage />;
      case "preferences":
        return <CustomerPreferencesPage />;
      case "shipments":
        return <ShipmentBuilderPage />;
      case "client-setup":
        return <SimpleSetupPage />;
      case "square-diagnostic":
        return <SquareAuthDiagnostic />;
      case "superadmin":
        return <SuperadminDashboard />;
      case "marketing":
        return <MarketingIntegration />;
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
          <EmbeddedSignup onSignup={handleSignup} />
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
      <AdminLayout currentPage={currentPage} onPageChange={handlePageChange}>
        {renderAdminPage()}
      </AdminLayout>
    </>
  );
}

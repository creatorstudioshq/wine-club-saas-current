import { useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { Wine, Sparkles, Users } from "lucide-react";

export function WelcomeToast() {
  useEffect(() => {
    // Show welcome message only once per session
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    
    if (!hasSeenWelcome) {
      setTimeout(() => {
        toast.success("Welcome to Wine Club SaaS!", {
          description: "Click 'Quick Login' to access the admin dashboard or 'Join Wine Club' to sign up as a member.",
          duration: 5000,
          icon: <Wine className="w-5 h-5" />,
        });
        
        sessionStorage.setItem("hasSeenWelcome", "true");
      }, 1000);
    }
  }, []);

  return null;
}
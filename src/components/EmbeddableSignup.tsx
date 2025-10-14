import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Wine, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Embeddable signup form - designed to be embedded on external websites
// This component is optimized for embedding with minimal dependencies

interface EmbeddableSignupProps {
  wineClubId: string;
  clubName?: string;
  clubLogo?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  apiBaseUrl?: string;
}

// Sample plans - in production these would come from the wine club's API
const SAMPLE_PLANS = [
  {
    id: "silver",
    name: "Silver",
    bottles: 3,
    frequency: "Monthly",
    price: 89,
    discount: 15,
    popular: false,
    icon: <Wine className="w-6 h-6" />,
    description: "Perfect for wine enthusiasts who want variety"
  },
  {
    id: "gold", 
    name: "Gold",
    bottles: 6,
    frequency: "Monthly", 
    price: 159,
    discount: 20,
    popular: true,
    icon: <Wine className="w-6 h-6" />,
    description: "Most popular choice for serious wine lovers"
  },
  {
    id: "platinum",
    name: "Platinum", 
    bottles: 12,
    frequency: "Monthly",
    price: 299,
    discount: 25,
    popular: false,
    icon: <Wine className="w-6 h-6" />,
    description: "Premium selection for collectors and connoisseurs"
  }
];

export function EmbeddableSignup({
  wineClubId,
  clubName = "Wine Club",
  clubLogo,
  primaryColor = "#d97706",
  backgroundColor = "#fef3c7",
  textColor = "#1f2937",
  apiBaseUrl = "https://your-api-domain.com"
}: EmbeddableSignupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapPlanId, setSwapPlanId] = useState<string | null>(null);
  
  // Step 2: Preferences
  const [winePreferences, setWinePreferences] = useState<string[]>([]);
  const [deliveryFrequency, setDeliveryFrequency] = useState("monthly");
  
  // Step 3: Personal Info
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const wineCategories = [
    "Red Wine", "White Wine", "Rosé", "Sparkling", "Dessert Wine",
    "Cabernet Sauvignon", "Chardonnay", "Pinot Noir", "Sauvignon Blanc",
    "Merlot", "Riesling", "Syrah", "Pinot Grigio", "Malbec", "Zinfandel"
  ];

  const toggleCardFlip = (planId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const handleSwapPlan = (planId: string) => {
    setSwapPlanId(planId);
    setSwapModalOpen(true);
  };

  const confirmSwap = (newPlanId: string) => {
    setSelectedPlan(newPlanId);
    setSwapModalOpen(false);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const submissionData = {
        wineClubId,
        plan: selectedPlan,
        preferences: winePreferences,
        deliveryFrequency,
        personalInfo: formData,
        timestamp: new Date().toISOString()
      };

      // In production, this would submit to your API
      console.log('Form submission:', submissionData);
      
      // Show success message
      alert('Thank you for joining! We\'ll be in touch soon.');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif mb-2">Choose Your Plan</h2>
              <p className="text-gray-600">Select the perfect wine club membership for you</p>
            </div>
            
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {SAMPLE_PLANS.map((plan) => (
                <div key={plan.id} className="group">
                  <Card 
                    className={`cursor-pointer transition-all w-full overflow-hidden ${
                      selectedPlan === plan.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    style={{ 
                      '--primary': primaryColor,
                      '--background': backgroundColor 
                    } as React.CSSProperties}
                  >
                    <div 
                      className="relative h-80 cursor-pointer"
                      onMouseEnter={() => toggleCardFlip(plan.id)}
                      onMouseLeave={() => toggleCardFlip(plan.id)}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {/* Front of card */}
                      <div className={`absolute inset-0 transition-transform duration-700 ${
                        flippedCards[plan.id] ? 'rotate-y-180' : ''
                      }`} style={{backfaceVisibility: 'hidden'}}>
                        <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 p-6 flex flex-col justify-center items-center">
                          {plan.popular && (
                            <Badge className="mb-4" style={{backgroundColor: primaryColor, color: 'white'}}>Most Popular</Badge>
                          )}
                          <div className="mb-6 mx-auto w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: `${primaryColor}20`}}>
                            {plan.icon}
                          </div>
                          <h3 className="text-xl font-serif mb-2 text-center">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4 text-center">
                            {plan.bottles} bottles, {plan.frequency.toLowerCase()}
                          </p>
                          <p className="text-3xl font-bold mb-2" style={{color: primaryColor}}>
                            ${plan.price}
                          </p>
                          <p className="text-sm text-green-600">
                            {plan.discount}% off retail
                          </p>
                        </div>
                      </div>

                      {/* Back of card - Details */}
                      <div className={`absolute inset-0 transition-transform duration-700 ${
                        flippedCards[plan.id] ? 'rotate-y-0' : ''
                      }`} style={{backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
                        <div className="h-full p-6 text-white flex flex-col justify-center" style={{background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)`}}>
                          <h3 className="text-xl font-serif mb-4 text-center">{plan.name}</h3>
                          
                          <div className="space-y-3 text-sm">
                            <div>
                              <h4 className="font-medium mb-2 opacity-80">What's Included</h4>
                              <p className="opacity-90 leading-relaxed">
                                {plan.bottles} carefully curated bottles delivered {plan.frequency.toLowerCase()}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2 opacity-80">Member Benefits</h4>
                              <p className="opacity-90 leading-relaxed">
                                {plan.discount}% discount on all wines, exclusive tastings, and priority access to limited releases.
                              </p>
                            </div>

                            <div className="text-center mt-4">
                              <p className="text-lg font-bold">
                                ${plan.price} per shipment
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">{plan.frequency}</Badge>
                          <p className="text-sm text-muted-foreground">{plan.bottles} bottles</p>
                        </div>
                        <Dialog open={swapModalOpen && swapPlanId === plan.id} onOpenChange={(open) => {
                          setSwapModalOpen(open);
                          if (open) setSwapPlanId(plan.id);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSwapPlan(plan.id);
                              }}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Swap
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Choose Different Plan</DialogTitle>
                              <DialogDescription>
                                Select an alternative plan for your membership.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 md:grid-cols-3">
                              {SAMPLE_PLANS.filter(p => p.id !== plan.id).map((altPlan) => (
                                <Card 
                                  key={altPlan.id} 
                                  className="cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => confirmSwap(altPlan.id)}
                                >
                                  <CardContent className="p-4 text-center">
                                    <div className="mb-3 mx-auto w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: `${primaryColor}10`}}>
                                      {altPlan.icon}
                                    </div>
                                    <h4 className="font-medium mb-1">{altPlan.name}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{altPlan.bottles} bottles</p>
                                    <Badge variant="outline" className="text-xs">{altPlan.frequency}</Badge>
                                    <p className="text-lg font-bold mt-2" style={{color: primaryColor}}>${altPlan.price}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif mb-2">Wine Preferences</h2>
              <p className="text-gray-600">Tell us about your wine preferences</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-lg font-medium">What types of wine do you enjoy?</Label>
                <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {wineCategories.map((category) => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={winePreferences.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWinePreferences([...winePreferences, category]);
                          } else {
                            setWinePreferences(winePreferences.filter(c => c !== category));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-lg font-medium">Delivery Frequency</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[
                    { value: "monthly", label: "Monthly", desc: "Every month" },
                    { value: "bimonthly", label: "Bi-Monthly", desc: "Every 2 months" },
                    { value: "quarterly", label: "Quarterly", desc: "Every 3 months" },
                    { value: "custom", label: "Custom", desc: "Choose your own schedule" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={deliveryFrequency === option.value}
                        onChange={(e) => setDeliveryFrequency(e.target.value)}
                        className="text-primary"
                      />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        const selectedPlanData = SAMPLE_PLANS.find(p => p.id === selectedPlan);
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif mb-2">Personal Information</h2>
              <p className="text-gray-600">Complete your membership application</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Order Summary */}
            {selectedPlanData && (
              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{selectedPlanData.name} Plan</span>
                      <span className="font-medium">${selectedPlanData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{selectedPlanData.bottles} bottles, {selectedPlanData.frequency.toLowerCase()}</span>
                      <span className="text-green-600">{selectedPlanData.discount}% member discount</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${selectedPlanData.price}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor }}
    >
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {clubLogo ? (
                  <img 
                    src={clubLogo} 
                    alt={`${clubName} Logo`}
                    className="max-h-[300px] w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                    clubLogo ? 'hidden' : ''
                  }`}
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)` }}
                >
                  <Wine className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-serif" style={{color: textColor}}>
                Join {clubName}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Step {currentStep} of 3
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep ? 'text-white' : 'text-gray-400'
                      }`}
                      style={{
                        backgroundColor: step <= currentStep ? primaryColor : '#e5e7eb'
                      }}
                    >
                      {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div 
                        className={`w-16 h-1 mx-2 ${
                          step < currentStep ? 'opacity-100' : 'opacity-30'
                        }`}
                        style={{backgroundColor: step < currentStep ? primaryColor : '#e5e7eb'}}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-8 py-3"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button 
                onClick={handleNextStep}
                size="lg" 
                className="px-12 py-3 text-lg font-serif"
                style={{backgroundColor: primaryColor, color: 'white'}}
                disabled={
                  (currentStep === 1 && !selectedPlan) ||
                  (currentStep === 3 && (!formData.firstName || !formData.lastName || !formData.email))
                }
              >
                {currentStep === 3 ? 'Complete Signup' : 'Continue'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
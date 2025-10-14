import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowLeft, ArrowRight, RotateCcw, Wine, ChevronRight, Plus, Minus, AlertTriangle } from "lucide-react";

// This component represents the customer wine selection confirmation flow  
// In the real system, wines would come from the admin's Shipment Builder assignments
// based on customer preferences and available inventory

const mockWineSelection = [
  {
    id: "DEMO_W001",
    name: "Demo Cabernet Sauvignon 2021",
    region: "Demo Region",
    vintage: "2021",
    type: "Red Wine",
    alcohol: "13.5%",
    price: 37.95,
    quantity: 1,
    minQuantity: 1,
    image: "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=400&h=600&fit=crop",
    tastingNotes: "Demo wine selection - in production this would show wines assigned by the wine club admin based on your preferences.",
    pairings: "Demo pairing - would contain real sommelier notes."
  },
  {
    id: "W002", 
    name: "Cloudy Bay Sauvignon Blanc",
    region: "Marlborough, New Zealand",
    vintage: "2022",
    type: "White Wine", 
    alcohol: "12.5%",
    price: 29.95,
    quantity: 1,
    minQuantity: 1,
    image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=400&h=600&fit=crop",
    tastingNotes: "Crisp and refreshing with vibrant citrus flavors, tropical fruit notes, and a clean mineral finish. Shows classic Marlborough character with gooseberry and passion fruit.",
    pairings: "Excellent with seafood, light salads, goat cheese, or enjoyed as an aperitif."
  },
  {
    id: "W003",
    name: "Barolo Riserva 2017",
    region: "Piedmont, Italy",
    vintage: "2017",
    type: "Red Wine",
    alcohol: "14.0%", 
    price: 33.95,
    quantity: 1,
    minQuantity: 1,
    image: "https://images.unsplash.com/photo-1515779689357-8b5b7faecd84?w=400&h=600&fit=crop",
    tastingNotes: "Elegant and complex with aromas of red roses, tar, and truffle. The palate shows cherry, leather, and spice with firm tannins that soften with time.",
    pairings: "Ideal with truffle dishes, braised meats, mushroom risotto, or aged Parmigiano-Reggiano."
  }
];

const alternativeWines = [
  {
    id: "W004",
    name: "Dom Pérignon Vintage 2012",
    region: "Champagne, France",
    type: "Champagne",
    image: "https://images.unsplash.com/photo-1558346648-9757f2fa4474?w=400&h=600&fit=crop"
  },
  {
    id: "W005",
    name: "Riesling Kabinett 2021", 
    region: "Mosel, Germany",
    type: "White Wine",
    image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=600&fit=crop"
  },
  {
    id: "W006",
    name: "Pinot Noir Reserve 2020",
    region: "Oregon, USA",
    type: "Red Wine",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=600&fit=crop"
  }
];

interface WineSelectionReviewProps {
  onNext: () => void;
}

export function WineSelectionReview({ onNext }: WineSelectionReviewProps) {
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  const [selectedWines, setSelectedWines] = useState(mockWineSelection);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapIndex, setSwapIndex] = useState(0);

  const toggleFlip = (wineId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [wineId]: !prev[wineId]
    }));
  };

  const handleSwap = (index: number, newWine: any) => {
    setSelectedWines(prev => {
      const updated = [...prev];
      updated[index] = { ...newWine, quantity: 1, minQuantity: 1 };
      return updated;
    });
    setSwapModalOpen(false);
  };

  const updateQuantity = (index: number, change: number) => {
    setSelectedWines(prev => {
      const updated = [...prev];
      const wine = updated[index];
      const newQuantity = wine.quantity + change;
      
      if (newQuantity >= wine.minQuantity && newQuantity <= 6) { // Max 6 bottles per wine
        updated[index] = { ...wine, quantity: newQuantity };
      }
      
      return updated;
    });
  };

  const getTotalBottles = () => {
    return selectedWines.reduce((total, wine) => total + wine.quantity, 0);
  };

  const getTotalPrice = () => {
    return selectedWines.reduce((total, wine) => total + (wine.price * wine.quantity), 0);
  };

  const canProceed = () => {
    return getTotalBottles() >= 3; // Minimum 3 bottles for shipment
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=200&h=100&fit=crop"
              alt="King Frosch Wine Club"
              className="h-12 w-24 object-cover rounded"
            />
            <div>
              <h1 className="text-2xl font-serif text-gray-900">King Frosch Wine Club</h1>
              <p className="text-gray-600">Premium Wine Selection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Wine className="h-4 w-4" />
            <span>March 2024 Selection</span>
            <span className="text-gray-400">•</span>
            <Badge variant="outline" className="bg-amber-100 text-amber-800">Gold Plan</Badge>
          </div>
        </div>
      </div>

      {/* Wine Cards */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">
            Your Curated Wine Selection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've carefully selected these three exceptional wines for your March shipment. 
            Hover over each bottle to discover tasting notes, or swap any selection to customize your box.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {selectedWines.map((wine, index) => (
            <div key={wine.id} className="group">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
                <div 
                  className="relative h-96 cursor-pointer"
                  onMouseEnter={() => toggleFlip(wine.id)}
                  onMouseLeave={() => toggleFlip(wine.id)}
                >
                  {/* Front of card */}
                  <div className={`absolute inset-0 backface-hidden transition-transform duration-700 ${
                    flippedCards[wine.id] ? 'rotate-y-180' : ''
                  }`}>
                    <ImageWithFallback
                      src={wine.image}
                      alt={wine.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-serif mb-2">{wine.name}</h3>
                      <p className="text-sm opacity-90">{wine.region}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span>{wine.vintage}</span>
                        <span>•</span>
                        <span>{wine.type}</span>
                        <span>•</span>
                        <span>{wine.alcohol}</span>
                      </div>
                    </div>
                  </div>

                  {/* Back of card - Tasting Notes */}
                  <div className={`absolute inset-0 backface-hidden rotate-y-180 transition-transform duration-700 ${
                    flippedCards[wine.id] ? 'rotate-y-0' : ''
                  }`}>
                    <div className="h-full bg-gradient-to-br from-amber-900 to-orange-900 p-6 text-white flex flex-col justify-center">
                      <h3 className="text-xl font-serif mb-4 text-center">{wine.name}</h3>
                      
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-medium mb-2 text-amber-200">Tasting Notes</h4>
                          <p className="text-amber-50 leading-relaxed">{wine.tastingNotes}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-amber-200">Perfect Pairings</h4>
                          <p className="text-amber-50 leading-relaxed">{wine.pairings}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Badge variant="outline" className="mb-2">{wine.type}</Badge>
                      <p className="text-sm text-gray-600">Vintage {wine.vintage}</p>
                      <p className="text-lg font-semibold text-gray-900">${wine.price}</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, -1)}
                        disabled={wine.quantity <= wine.minQuantity}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{wine.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(index, 1)}
                        disabled={wine.quantity >= 6}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Subtotal: ${(wine.price * wine.quantity).toFixed(2)}
                    </div>
                    <Dialog open={swapModalOpen && swapIndex === index} onOpenChange={(open) => {
                      setSwapModalOpen(open);
                      if (open) setSwapIndex(index);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Swap
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Swap Wine Selection</DialogTitle>
                          <DialogDescription>
                            Choose an alternative wine for position {index + 1}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 md:grid-cols-3">
                          {alternativeWines.map((altWine) => (
                            <Card 
                              key={altWine.id} 
                              className="cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => handleSwap(index, altWine)}
                            >
                              <ImageWithFallback
                                src={altWine.image}
                                alt={altWine.name}
                                className="w-full h-48 object-cover rounded-t"
                              />
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-1">{altWine.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{altWine.region}</p>
                                <Badge variant="outline" className="text-xs">{altWine.type}</Badge>
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

        {/* Order Summary & Confirmation */}
        <div className="text-center">
          {/* Order Summary */}
          <Card className="max-w-md mx-auto mb-6 bg-white/80 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="font-serif text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Bottles:</span>
                  <span className="font-medium">{getTotalBottles()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Member Discount (15%):</span>
                  <span className="font-medium">-${(getTotalPrice() * 0.15).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${(getTotalPrice() * 0.85).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Minimum Validation Alert */}
          {!canProceed() && (
            <Alert className="max-w-md mx-auto mb-6 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Minimum 3 bottles required for shipment. You currently have {getTotalBottles()} bottles.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={onNext}
            size="lg" 
            className="bg-amber-900 hover:bg-amber-800 text-white px-12 py-3 text-lg font-serif"
            disabled={!canProceed()}
          >
            {canProceed() ? 'Continue to Delivery Date' : 'Add More Bottles'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            You can always modify your preferences in your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
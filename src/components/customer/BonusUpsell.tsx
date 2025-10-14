import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Plus, ChevronRight, ChefHat, Clock } from "lucide-react";

const bonusItems = [
  {
    id: "B001",
    name: "Artisan Cheese Selection",
    description: "Curated selection of three premium cheeses that perfectly complement your wine selection. Includes aged cheddar, creamy brie, and tangy goat cheese.",
    price: 24.99,
    originalPrice: 29.99,
    image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=300&fit=crop",
    pairings: ["Château Margaux", "Cloudy Bay"],
    prepTime: "Ready to serve"
  },
  {
    id: "B002",
    name: "Gourmet Charcuterie Board",
    description: "Handcrafted selection of cured meats, olives, nuts, and artisanal crackers. Perfect for creating an elevated wine tasting experience at home.",
    price: 34.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
    pairings: ["All wines"],
    prepTime: "15 minutes assembly"
  },
  {
    id: "B003",
    name: "Dark Chocolate Tasting Set",
    description: "Four premium dark chocolate bars with varying cocoa percentages (60%, 70%, 80%, 90%) sourced from single-origin estates around the world.",
    price: 18.99,
    originalPrice: 22.99,
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop",
    pairings: ["Barolo Riserva", "Château Margaux"],
    prepTime: "Ready to enjoy"
  }
];

interface BonusUpsellProps {
  onNext: () => void;
  onSkip: () => void;
}

export function BonusUpsell({ onNext, onSkip }: BonusUpsellProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const totalPrice = selectedItems.reduce((sum, itemId) => {
    const item = bonusItems.find(b => b.id === itemId);
    return sum + (item?.price || 0);
  }, 0);

  const totalSavings = selectedItems.reduce((sum, itemId) => {
    const item = bonusItems.find(b => b.id === itemId);
    return sum + ((item?.originalPrice || 0) - (item?.price || 0));
  }, 0);

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
        </div>
      </div>

      {/* Upsell Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">
            Complete Your Wine Experience
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enhance your tasting experience with carefully selected food pairings. 
            These artisanal additions are chosen specifically to complement your wine selection.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {bonusItems.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            const discount = ((item.originalPrice - item.price) / item.originalPrice * 100).toFixed(0);
            
            return (
              <Card 
                key={item.id} 
                className={`overflow-hidden transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'ring-2 ring-amber-900 shadow-lg bg-amber-50/50' 
                    : 'hover:shadow-md bg-white/80 backdrop-blur'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="relative">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-600 text-white">
                          {discount}% OFF
                        </Badge>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-900/20 flex items-center justify-center">
                          <div className="bg-amber-900 text-white rounded-full p-2">
                            <Plus className="h-6 w-6" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-serif text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 line-through">
                              ${item.originalPrice}
                            </span>
                            <span className="text-2xl font-serif text-amber-900">
                              ${item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <ChefHat className="h-4 w-4" />
                          <span>Pairs with: {item.pairings.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{item.prepTime}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant={isSelected ? "default" : "outline"}
                        className={isSelected ? "bg-amber-900 hover:bg-amber-800" : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItem(item.id);
                        }}
                      >
                        {isSelected ? "Added to Box" : "Add to Box"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selection Summary */}
        {selectedItems.length > 0 && (
          <Card className="mb-8 bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-gray-900 mb-2">
                    Added to Your Box
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedItems.length} bonus item{selectedItems.length > 1 ? 's' : ''} selected
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-serif text-amber-900 mb-1">
                    +${totalPrice.toFixed(2)}
                  </div>
                  {totalSavings > 0 && (
                    <p className="text-sm text-green-600">
                      You save ${totalSavings.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={onSkip}
            className="px-8 py-3"
          >
            Skip for Now
          </Button>
          <Button 
            onClick={onNext}
            size="lg" 
            className="bg-amber-900 hover:bg-amber-800 text-white px-12 py-3 text-lg font-serif"
          >
            Continue to Delivery
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          These items will be carefully packaged with your wine shipment.
        </p>
      </div>
    </div>
  );
}
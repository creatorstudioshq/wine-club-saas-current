import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { CalendarDays, Truck, Clock, ChevronRight, MapPin, Phone } from "lucide-react";

const unavailableDates = [
  new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Example unavailable date (3 days from now)
  new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Another unavailable date (10 days from now)
];

const deliveryOptions = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "Delivered during business hours (9 AM - 6 PM)",
    price: 0,
    duration: "3-5 business days"
  },
  {
    id: "express",
    name: "Express Delivery", 
    description: "Priority delivery with tracking",
    price: 12.99,
    duration: "1-2 business days"
  },
  {
    id: "scheduled",
    name: "Scheduled Delivery",
    description: "Choose your preferred delivery window",
    price: 8.99,
    duration: "Your selected date"
  }
];

interface DeliveryDateConfirmationProps {
  onNext: () => void;
  onBack: () => void;
}

export function DeliveryDateConfirmation({ onNext, onBack }: DeliveryDateConfirmationProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedOption, setSelectedOption] = useState("standard");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  const isDateUnavailable = (date: Date) => {
    const isSameDay = (date1: Date, date2: Date) => {
      return date1.toDateString() === date2.toDateString();
    };
    const isWeekend = (date: Date) => {
      const day = date.getDay();
      return day === 0 || day === 6; // Sunday = 0, Saturday = 6
    };
    
    return unavailableDates.some(unavailableDate => isSameDay(date, unavailableDate)) ||
           isWeekend(date) ||
           date < new Date(Date.now() + 24 * 60 * 60 * 1000); // Can't deliver today
  };

  const selectedDeliveryOption = deliveryOptions.find(opt => opt.id === selectedOption);
  const canProceed = selectedDate || selectedOption === "standard" || selectedOption === "express";

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

      {/* Delivery Configuration */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">
            Choose Your Delivery Date
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select when you'd like to receive your carefully curated wine selection. 
            We'll ensure your wines arrive in perfect condition.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Delivery Options */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-serif text-gray-900 mb-4">Delivery Options</h3>
              <div className="space-y-3">
                {deliveryOptions.map((option) => (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedOption === option.id 
                        ? 'ring-2 ring-amber-900 bg-amber-50/50' 
                        : 'hover:shadow-md bg-white/80'
                    }`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{option.name}</h4>
                            {option.price === 0 && (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                FREE
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{option.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              <span>Signature required</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          {option.price > 0 ? (
                            <span className="font-medium text-gray-900">
                              +${option.price}
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">
                              Included
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <Card className="bg-white/80">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Delivery Address</h4>
                    <div className="text-sm text-gray-600">
                      <p>John Smith</p>
                      <p>123 Wine Street, Apt 4B</p>
                      <p>San Francisco, CA 94108</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      Change Address
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white/80">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Contact Number</h4>
                    <p className="text-sm text-gray-600 mb-3">(555) 123-4567</p>
                    <p className="text-xs text-gray-500">
                      We'll text you delivery updates and when your driver arrives.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Selection */}
          <div>
            <h3 className="text-xl font-serif text-gray-900 mb-4">
              {selectedOption === "scheduled" ? "Select Delivery Date" : "Estimated Delivery"}
            </h3>
            
            {selectedOption === "scheduled" ? (
              <Card className="bg-white/80">
                <CardContent className="p-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateUnavailable}
                    className="rounded-md border-0"
                  />
                  <div className="mt-4 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-200 rounded"></div>
                      <span>Weekends unavailable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-200 rounded"></div>
                      <span>Holiday/unavailable dates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80">
                <CardContent className="p-6">
                  <div className="text-center">
                    <CalendarDays className="h-12 w-12 text-amber-900 mx-auto mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">Estimated Delivery</h4>
                    <p className="text-gray-600 mb-4">{selectedDeliveryOption?.duration}</p>
                    
                    <div className="bg-amber-50 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        Your order will be processed within 24 hours and shipped via our premium carrier network.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Special Instructions */}
        <Card className="mt-8 bg-white/80">
          <CardContent className="p-6">
            <h4 className="font-medium text-gray-900 mb-3">Special Delivery Instructions (Optional)</h4>
            <textarea
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none text-sm"
              placeholder="Leave at front door, ring doorbell, etc..."
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Summary & Actions */}
        <div className="mt-12 text-center">
          {selectedOption === "scheduled" && selectedDate && (
            <Card className="mb-6 bg-amber-50 border-amber-200 max-w-md mx-auto">
              <CardContent className="p-4">
                <div className="text-center">
                  <CalendarDays className="h-6 w-6 text-amber-900 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">Delivery Confirmed</h4>
                  <p className="text-sm text-gray-600">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {selectedDeliveryOption && selectedDeliveryOption.price > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Additional ${selectedDeliveryOption.price} delivery fee
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="px-8 py-3"
            >
              Back to Selection
            </Button>
            <Button 
              onClick={onNext}
              disabled={!canProceed}
              size="lg" 
              className="bg-amber-900 hover:bg-amber-800 text-white px-12 py-3 text-lg font-serif"
            >
              Continue to Payment
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            All wines are carefully packaged with temperature control during shipping.
          </p>
        </div>
      </div>
    </div>
  );
}
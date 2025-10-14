import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Calendar, Clock, Truck, Save, RefreshCw } from "lucide-react";
import { api } from "../utils/api";

const KING_FROSCH_ID = "550e8400-e29b-41d4-a716-446655440000";

interface ShippingSchedule {
  id: string;
  wine_club_id: string;
  shipping_day_of_week: string; // "wednesday"
  shipping_week_of_month: number; // 3 (3rd week)
  advance_notice_days: number; // 14 (2 weeks)
  available_days: string[]; // ["wednesday"]
  timezone: string;
  created_at: string;
  updated_at: string;
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const WEEKS_OF_MONTH = [
  { value: 1, label: "1st" },
  { value: 2, label: "2nd" },
  { value: 3, label: "3rd" },
  { value: 4, label: "4th" },
  { value: 5, label: "5th (Last)" },
];

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
];

export function ShippingSchedulePage() {
  const [schedule, setSchedule] = useState<ShippingSchedule>({
    id: "",
    wine_club_id: KING_FROSCH_ID,
    shipping_day_of_week: "wednesday",
    shipping_week_of_month: 3,
    advance_notice_days: 14,
    available_days: ["wednesday"],
    timezone: "America/New_York",
    created_at: "",
    updated_at: ""
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await api.getShippingSchedule(KING_FROSCH_ID);
      if (response.schedule) {
        setSchedule(response.schedule);
      }
    } catch (error) {
      console.error('Failed to fetch shipping schedule:', error);
      // Use default schedule if none exists
    } finally {
      setLoading(false);
    }
  };

  const saveSchedule = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      const response = await api.saveShippingSchedule(schedule);
      
      setMessage({
        text: "Shipping schedule saved successfully!",
        type: 'success'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save shipping schedule:', error);
      setMessage({
        text: "Failed to save shipping schedule. Please try again.",
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDayToggle = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter(d => d !== day)
        : [...prev.available_days, day]
    }));
  };

  const calculateNextShipmentDates = () => {
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 3; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const firstDay = new Date(month);
      const dayOfWeek = DAYS_OF_WEEK.findIndex(d => d.value === schedule.shipping_day_of_week);
      
      // Find the nth occurrence of the day in the month
      let targetDate = new Date(firstDay);
      let occurrences = 0;
      
      while (targetDate.getMonth() === month.getMonth()) {
        if (targetDate.getDay() === dayOfWeek) {
          occurrences++;
          if (occurrences === schedule.shipping_week_of_month) {
            break;
          }
        }
        targetDate.setDate(targetDate.getDate() + 1);
      }
      
      dates.push(targetDate);
    }
    
    return dates;
  };

  const calculateAvailableDates = () => {
    const nextShipment = calculateNextShipmentDates()[0];
    const availableDates = [];
    
    // Calculate dates within advance notice period
    for (let i = 0; i < schedule.advance_notice_days; i++) {
      const date = new Date(nextShipment);
      date.setDate(date.getDate() - i);
      
      const dayName = DAYS_OF_WEEK[date.getDay()].value;
      if (schedule.available_days.includes(dayName)) {
        availableDates.push(date);
      }
    }
    
    return availableDates.sort((a, b) => a.getTime() - b.getTime());
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const nextShipmentDates = calculateNextShipmentDates();
  const availableDates = calculateAvailableDates();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipping Schedule</h1>
          <p className="text-muted-foreground">
            Configure when shipments are sent and how far in advance customers can choose delivery dates
          </p>
        </div>
        <Button onClick={fetchSchedule} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Shipping Configuration
            </CardTitle>
            <CardDescription>
              Set your regular shipping schedule and advance notice requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Shipping Day of Week</Label>
              <Select 
                value={schedule.shipping_day_of_week} 
                onValueChange={(value) => setSchedule({...schedule, shipping_day_of_week: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Week of Month</Label>
              <Select 
                value={schedule.shipping_week_of_month.toString()} 
                onValueChange={(value) => setSchedule({...schedule, shipping_week_of_month: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEKS_OF_MONTH.map((week) => (
                    <SelectItem key={week.value} value={week.value.toString()}>
                      {week.label} {schedule.shipping_day_of_week}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Advance Notice (Days)</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={schedule.advance_notice_days}
                onChange={(e) => setSchedule({...schedule, advance_notice_days: parseInt(e.target.value) || 14})}
                placeholder="14"
              />
              <p className="text-sm text-muted-foreground">
                How many days before shipment customers can choose delivery dates
              </p>
            </div>

            <div className="space-y-2">
              <Label>Available Delivery Days</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Which days of the week customers can choose for delivery
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.value}
                      checked={schedule.available_days.includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                    <Label htmlFor={day.value} className="text-sm">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={schedule.timezone} 
                onValueChange={(value) => setSchedule({...schedule, timezone: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={saveSchedule} disabled={saving} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Schedule"}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Schedule Preview
            </CardTitle>
            <CardDescription>
              See how your schedule will work in practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Next Shipment Dates</h4>
                <div className="space-y-2">
                  {nextShipmentDates.map((date, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {index === 0 ? "Next" : index === 1 ? "Following" : "After That"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <Badge variant={index === 0 ? "default" : "outline"}>
                        {DAYS_OF_WEEK[date.getDay()].label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Available Delivery Dates</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  If today was a shipping day, customers could choose from:
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableDates.map((date, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <span className="text-sm">
                        {date.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {DAYS_OF_WEEK[date.getDay()].label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Example:</strong> If today was {schedule.shipping_day_of_week}, 
                  customers could choose delivery dates up to {schedule.advance_notice_days} days in advance, 
                  but only on {schedule.available_days.map(day => DAYS_OF_WEEK.find(d => d.value === day)?.label).join(', ')}.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

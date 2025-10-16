import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Mail, 
  MessageSquare, 
  Users, 
  Send,
  CheckCircle,
  AlertTriangle,
  Settings,
  Zap
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'shipment-notification' | 'approval-reminder' | 'welcome';
  status: 'active' | 'draft';
}

interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  type: 'shipment-notification' | 'approval-reminder';
  status: 'active' | 'draft';
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "1",
    name: "Shipment Ready for Approval",
    subject: "Your {{club_name}} wine selection is ready for review",
    type: "shipment-notification",
    status: "active"
  },
  {
    id: "2", 
    name: "Approval Reminder",
    subject: "Don't miss out - approve your wine selection by {{deadline}}",
    type: "approval-reminder",
    status: "active"
  },
  {
    id: "3",
    name: "Welcome to Wine Club",
    subject: "Welcome to {{club_name}} - your first shipment details",
    type: "welcome",
    status: "draft"
  }
];

const SMS_TEMPLATES: SMSTemplate[] = [
  {
    id: "1",
    name: "Shipment Notification",
    message: "🍷 Your {{club_name}} wine selection is ready! Review & approve: {{approval_link}}",
    type: "shipment-notification",
    status: "active"
  },
  {
    id: "2",
    name: "Approval Reminder", 
    message: "⏰ Reminder: Approve your wine selection by {{deadline}}. Link: {{approval_link}}",
    type: "approval-reminder",
    status: "active"
  }
];

export function MarketingIntegration() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testPhone, setTestPhone] = useState("");

  const handleSendTestEmail = async () => {
    // This would integrate with Square Marketing API
    console.log("Sending test email via Square Marketing API...");
  };

  const handleSendTestSMS = async () => {
    // This would integrate with Square Marketing API
    console.log("Sending test SMS via Square Marketing API...");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-gray-900">Marketing & Communications</h1>
        <p className="text-gray-600 mt-2">
          Configure email and SMS notifications sent through Square Marketing
        </p>
      </div>

      {/* Integration Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Square Email Marketing</p>
                  <p className="text-sm text-muted-foreground">Automated customer emails</p>
                </div>
              </div>
              <Badge variant="default">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Square SMS Marketing</p>
                  <p className="text-sm text-muted-foreground">Text message notifications</p>
                </div>
              </div>
              <Badge variant="secondary">
                Upgrade Required
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Campaign Templates
              </CardTitle>
              <CardDescription>
                Customize email templates sent through Square Marketing API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template List */}
              <div className="space-y-4">
                {EMAIL_TEMPLATES.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.subject}</p>
                      <Badge variant={template.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                        {template.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Preview</Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Email */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Test Email Delivery</h4>
                <div className="flex gap-4">
                  <Input
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSendTestEmail} disabled={!testEmail}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              SMS messaging requires a Square Marketing subscription and customer consent.
              Customers must opt-in to receive text messages.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                SMS Template Management
              </CardTitle>
              <CardDescription>
                Create concise SMS templates for shipment notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template List */}
              <div className="space-y-4">
                {SMS_TEMPLATES.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground font-mono bg-muted/50 p-2 rounded mt-2">
                        {template.message}
                      </p>
                      <Badge variant={template.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                        {template.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Preview</Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Test SMS */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Test SMS Delivery</h4>
                <div className="flex gap-4">
                  <Input
                    placeholder="(555) 123-4567"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSendTestSMS} disabled={!testPhone || !smsEnabled}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Communication Settings
              </CardTitle>
              <CardDescription>
                Configure how and when customers receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send shipment approvals and updates via email
                    </p>
                  </div>
                  <Switch 
                    checked={emailEnabled} 
                    onCheckedChange={setEmailEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send text message reminders (requires Square subscription)
                    </p>
                  </div>
                  <Switch 
                    checked={smsEnabled} 
                    onCheckedChange={setSmsEnabled}
                    disabled={true}
                  />
                </div>
              </div>

              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Square Integration:</strong> All emails and SMS messages are sent through 
                  Square's Marketing API. This ensures deliverability and compliance with regulations.
                  Customers are automatically added to your Square customer directory.
                </AlertDescription>
              </Alert>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Automation Rules</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Shipment Approval</p>
                      <p className="text-xs text-muted-foreground">
                        Send email immediately when shipment is scheduled
                      </p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Approval Reminder</p>
                      <p className="text-xs text-muted-foreground">
                        Send reminder 24 hours before deadline
                      </p>
                    </div>
                    <Badge>Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Welcome Series</p>
                      <p className="text-xs text-muted-foreground">
                        Send welcome email to new members
                      </p>
                    </div>
                    <Badge variant="secondary">Draft</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
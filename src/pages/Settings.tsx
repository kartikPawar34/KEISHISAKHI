import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Languages, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Camera,
  MapPin,
  Phone,
  Mail,
  Sprout,
  Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("hindi");
  const [notifications, setNotifications] = useState({
    weather: true,
    schemes: true,
    mandi: false,
    reminders: true
  });

  const languages = [
    { value: "hindi", label: "हिन्दी" },
    { value: "english", label: "English" },
    { value: "punjabi", label: "ਪੰਜਾਬੀ" },
    { value: "gujarati", label: "ગુજરાતી" },
    { value: "marathi", label: "मराठी" },
    { value: "tamil", label: "தமிழ்" },
    { value: "telugu", label: "తెలుగు" },
    { value: "kannada", label: "ಕನ್ನಡ" },
    { value: "bengali", label: "বাংলা" },
    { value: "odia", label: "ଓଡ଼ିଆ" },
  ];

  const handleSave = () => {
    toast({
      title: language === "hindi" ? "सेटिंग्स सेव हुईं" : "Settings Saved",
      description: language === "hindi" ? "आपकी सेटिंग्स सफलतापूर्वक सेव हो गईं" : "Your settings have been saved successfully"
    });
  };

  const handleLogout = () => {
    toast({
      title: language === "hindi" ? "लॉगआउट" : "Logout",
      description: language === "hindi" ? "सफलतापूर्वक लॉगआउट हो गए" : "Successfully logged out"
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-3 sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => navigate("/farmer-dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">
          {language === "hindi" ? "सेटिंग्स" : "Settings"}
        </h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {language === "hindi" ? "प्रोफ़ाइल जानकारी" : "Profile Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">राजेश कुमार / Rajesh Kumar</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "hindi" ? "किसान • पंजाब" : "Farmer • Punjab"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === "hindi" ? "नाम" : "Name"}
                </Label>
                <Input id="name" defaultValue="राजेश कुमार" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-1" />
                  {language === "hindi" ? "मोबाइल नंबर" : "Mobile Number"}
                </Label>
                <Input id="phone" defaultValue="+91 98765 43210" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {language === "hindi" ? "स्थान" : "Location"}
                </Label>
                <Input id="location" defaultValue="लुधियाना, पंजाब" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="land-size">
                  <Sprout className="h-4 w-4 inline mr-1" />
                  {language === "hindi" ? "भूमि का आकार" : "Land Size"}
                </Label>
                <Select defaultValue="2-5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 एकड़</SelectItem>
                    <SelectItem value="1-2">1-2 एकड़</SelectItem>
                    <SelectItem value="2-5">2-5 एकड़</SelectItem>
                    <SelectItem value="5-10">5-10 एकड़</SelectItem>
                    <SelectItem value="10+">10+ एकड़</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              {language === "hindi" ? "भाषा सेटिंग्स" : "Language Settings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>
                {language === "hindi" ? "पसंदीदा भाषा" : "Preferred Language"}
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              {language === "hindi" ? "नोटिफिकेशन सेटिंग्स" : "Notification Settings"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === "hindi" ? "मौसम अलर्ट" : "Weather Alerts"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === "hindi" ? "बारिश और मौसम की जानकारी" : "Rain and weather updates"}
                </p>
              </div>
              <Switch 
                checked={notifications.weather} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weather: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === "hindi" ? "सरकारी योजनाएं" : "Government Schemes"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === "hindi" ? "नई योजनाओं की जानकारी" : "New scheme notifications"}
                </p>
              </div>
              <Switch 
                checked={notifications.schemes} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, schemes: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === "hindi" ? "मंडी भाव" : "Mandi Rates"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === "hindi" ? "बाजार दर की जानकारी" : "Market price updates"}
                </p>
              </div>
              <Switch 
                checked={notifications.mandi} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, mandi: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>
                  {language === "hindi" ? "कृषि कैलेंडर" : "Farm Reminders"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === "hindi" ? "बुआई और कटाई की याददाश्त" : "Sowing and harvesting reminders"}
                </p>
              </div>
              <Switch 
                checked={notifications.reminders} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reminders: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* About & Support */}
        <Card className="feature-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              {language === "hindi" ? "सहायता और जानकारी" : "Help & Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-3" />
              {language === "hindi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-3" />
              {language === "hindi" ? "संपर्क करें" : "Contact Support"}
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-3" />
              {language === "hindi" ? "गोपनीयता नीति" : "Privacy Policy"}
            </Button>
          </CardContent>
        </Card>

        {/* Save and Logout */}
        <div className="space-y-3">
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" />
            {language === "hindi" ? "सेटिंग्स सेव करें" : "Save Settings"}
          </Button>
          
          <Button variant="outline" onClick={handleLogout} className="w-full" size="lg">
            <LogOut className="h-4 w-4 mr-2" />
            {language === "hindi" ? "लॉगआउट" : "Logout"}
          </Button>
        </div>

        {/* App Version */}
        <div className="text-center text-sm text-muted-foreground pb-4">
          Krishi Sakhi v1.0.0
          <br />
          {language === "hindi" ? "AI-संचालित कृषि सहायक" : "AI-Powered Farming Assistant"}
        </div>
      </div>
    </div>
  );
};

export default Settings;
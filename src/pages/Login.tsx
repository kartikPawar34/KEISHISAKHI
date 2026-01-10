import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sprout, User, GraduationCap, Phone, Mail, MapPin, Languages } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<"farmer" | "expert">("farmer");
  const [isSignup, setIsSignup] = useState(false);
  const [language, setLanguage] = useState("hindi");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "लॉगिन सफल / Login Successful",
      description: "डैशबोर्ड पर रीडायरेक्ट कर रहे हैं / Redirecting to dashboard",
    });
    
    if (loginType === "farmer") {
      navigate("/farmer-dashboard");
    } else {
      navigate("/expert-dashboard");
    }
  };

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

  const soilTypes = ["Clay", "Sandy", "Loamy", "Silt", "Chalky", "Peaty"];
  const landSizes = ["0-1 एकड़", "1-2 एकड़", "2-5 एकड़", "5-10 एकड़", "10+ एकड़"];
  const irrigationTypes = ["Drip", "Canal", "Tubewell", "Rain-fed", "Sprinkler"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(142,45%,88%)] via-[hsl(142,35%,92%)] to-white">
      <div className="flex items-center justify-center min-h-screen p-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <Sprout className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[hsl(142,60%,30%)] mb-3">
              Krishi Sakhi
            </h1>
            <p className="text-base text-[hsl(142,40%,35%)]">
              {language === "hindi" ? "AI-संचालित कृषि सहायक" : "AI-Powered Farming Assistant"}
            </p>
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="w-4 h-4 text-primary" />
              <Label className="font-medium text-[hsl(142,50%,30%)]">
                {language === "hindi" ? "भाषा चुनें" : "Select Language"}
              </Label>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-white border border-gray-300 hover:border-primary transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value} className="hover:bg-primary/10">
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-white border border-gray-200 shadow-md">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-[hsl(142,60%,30%)]">
                {isSignup 
                  ? (language === "hindi" ? "खाता बनाएं" : "Create Account")
                  : (language === "hindi" ? "लॉगिन करें" : "Login")
                }
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {language === "hindi" 
                  ? "अपनी भूमिका चुनें और कृषि यात्रा शुरू करें" 
                  : "Choose your role and start your farming journey"
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <Tabs value={loginType} onValueChange={(v) => setLoginType(v as "farmer" | "expert")}>
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1">
                  <TabsTrigger 
                    value="farmer" 
                    className="flex items-center gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <User className="w-4 h-4" />
                    {language === "hindi" ? "किसान" : "Farmer"}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="expert" 
                    className="flex items-center gap-2 font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <GraduationCap className="w-4 h-4" />
                    {language === "hindi" ? "विशेषज्ञ" : "Expert"}
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleLogin} className="space-y-4">
                  <TabsContent value="farmer" className="space-y-4 mt-0">
                    {isSignup ? (
                      <>
                        {/* Farmer Signup Fields */}
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            {language === "hindi" ? "नाम" : "Name"}
                          </Label>
                          <Input 
                            id="name" 
                            placeholder={language === "hindi" ? "अपना नाम दर्ज करें" : "Enter your name"} 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mobile" className="text-sm font-medium">
                            {language === "hindi" ? "मोबाइल नंबर" : "Mobile Number"}
                          </Label>
                          <Input 
                            id="mobile" 
                            type="tel" 
                            placeholder="+91 XXXXX XXXXX" 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              {language === "hindi" ? "भूमि का आकार" : "Land Size"}
                            </Label>
                            <Select>
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder={language === "hindi" ? "चुनें" : "Select"} />
                              </SelectTrigger>
                              <SelectContent>
                                {landSizes.map((size) => (
                                  <SelectItem key={size} value={size}>{size}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              {language === "hindi" ? "मिट्टी का प्रकार" : "Soil Type"}
                            </Label>
                            <Select>
                              <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder={language === "hindi" ? "चुनें" : "Select"} />
                              </SelectTrigger>
                              <SelectContent>
                                {soilTypes.map((soil) => (
                                  <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            {language === "hindi" ? "सिंचाई प्रकार" : "Irrigation Type"}
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {irrigationTypes.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox id={type} />
                                <Label htmlFor={type} className="text-sm cursor-pointer">{type}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="region" className="text-sm font-medium">
                            {language === "hindi" ? "क्षेत्र/राज्य" : "Region/State"}
                          </Label>
                          <Select>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder={language === "hindi" ? "राज्य चुनें" : "Select state"} />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { value: "Delhi", label: language === "hindi" ? "दिल्ली" : "Delhi" },
                                { value: "Maharashtra", label: language === "hindi" ? "महाराष्ट्र" : "Maharashtra" },
                                { value: "Punjab", label: language === "hindi" ? "पंजाब" : "Punjab" },
                              ].map((state) => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Farmer Login Fields */}
                        <div className="space-y-2">
                          <Label htmlFor="mobile" className="text-sm font-medium">
                            {language === "hindi" ? "मोबाइल नंबर" : "Mobile Number"}
                          </Label>
                          <Input 
                            id="mobile" 
                            type="tel" 
                            placeholder="+91 XXXXX XXXXX" 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="otp" className="text-sm font-medium">
                            {language === "hindi" ? "OTP" : "OTP"}
                          </Label>
                          <Input 
                            id="otp" 
                            placeholder={language === "hindi" ? "OTP दर्ज करें" : "Enter OTP"} 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="expert" className="space-y-4 mt-0">
                    {isSignup ? (
                      <>
                        {/* Expert Signup Fields */}
                        <div className="space-y-2">
                          <Label htmlFor="expert-name" className="text-sm font-medium">
                            {language === "hindi" ? "नाम" : "Name"}
                          </Label>
                          <Input 
                            id="expert-name" 
                            placeholder={language === "hindi" ? "अपना नाम दर्ज करें" : "Enter your name"} 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            {language === "hindi" ? "ईमेल" : "Email"}
                          </Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="expert@example.com" 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium">
                            {language === "hindi" ? "पासवर्ड" : "Password"}
                          </Label>
                          <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••" 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              {language === "hindi" ? "योग्यता" : "Qualification"}
                            </Label>
                            <Input 
                              placeholder={language === "hindi" ? "योग्यता" : "Qualification"} 
                              className="border-gray-300 focus:border-primary"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              {language === "hindi" ? "अनुभव (वर्ष)" : "Experience (Years)"}
                            </Label>
                            <Input 
                              type="number" 
                              placeholder="5" 
                              className="border-gray-300 focus:border-primary"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            {language === "hindi" ? "विशेषता" : "Specialty"}
                          </Label>
                          <Input 
                            placeholder={language === "hindi" ? "कृषि विशेषता" : "Agricultural specialty"} 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Expert Login Fields */}
                        <div className="space-y-2">
                          <Label htmlFor="expert-email" className="text-sm font-medium">
                            {language === "hindi" ? "ईमेल" : "Email"}
                          </Label>
                          <Input 
                            id="expert-email" 
                            type="email" 
                            placeholder="expert@example.com" 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expert-password" className="text-sm font-medium">
                            {language === "hindi" ? "पासवर्ड" : "Password"}
                          </Label>
                          <Input 
                            id="expert-password" 
                            type="password" 
                            placeholder="••••••••" 
                            className="border-gray-300 focus:border-primary"
                          />
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-5 h-auto">
                    {isSignup 
                      ? (language === "hindi" ? "खाता बनाएं" : "Create Account")
                      : (language === "hindi" ? "लॉगिन करें" : "Login")
                    }
                  </Button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setIsSignup(!isSignup)}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      {isSignup 
                        ? (language === "hindi" ? "पहले से खाता है? लॉगिन करें" : "Already have an account? Login")
                        : (language === "hindi" ? "नया खाता बनाएं" : "Create new account")
                      }
                    </button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
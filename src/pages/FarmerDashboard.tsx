import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Cloud, 
  Thermometer, 
  Droplets, 
  Leaf, 
  Sprout, 
  Bot, 
  FileText, 
  TrendingUp, 
  Camera, 
  Calendar, 
  Bell, 
  Settings, 
  Home,
  Info,
  HelpCircle,
  User,
  Languages,
  Sun,
  CloudRain,
  Wind,
  Eye,
  Loader2,
  MapPin,
  ChevronRight,
  Zap,
  IndianRupee,
  Scan,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCropAdvisory, useMandiRates, useGovernmentSchemes } from "@/hooks/useFarmerData";
import { useLanguageHook, Language } from "@/hooks/useLanguage";
import { weatherService, WeatherData } from "@/services/weatherService";

// Import crop images
import wheatImg from "@/assets/crops/wheat.jpg";
import potatoImg from "@/assets/crops/potato.jpg";
import mustardImg from "@/assets/crops/mustard.jpg";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguageHook();
  const [notifications] = useState(3);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("Delhi");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  // Indian states list
  const indianStates = [
    { value: "Delhi", label: language === "hindi" ? "दिल्ली" : "Delhi" },
    { value: "Maharashtra", label: language === "hindi" ? "महाराष्ट्र" : "Maharashtra" },
    { value: "Karnataka", label: language === "hindi" ? "कर्नाटक" : "Karnataka" },
    { value: "Tamil Nadu", label: language === "hindi" ? "तमिल नाडु" : "Tamil Nadu" },
    { value: "West Bengal", label: language === "hindi" ? "पश्चिम बंगाल" : "West Bengal" },
    { value: "Gujarat", label: language === "hindi" ? "गुजरात" : "Gujarat" },
    { value: "Rajasthan", label: language === "hindi" ? "राजस्थान" : "Rajasthan" },
    { value: "Punjab", label: language === "hindi" ? "पंजाब" : "Punjab" },
    { value: "Haryana", label: language === "hindi" ? "हरियाणा" : "Haryana" },
    { value: "Uttar Pradesh", label: language === "hindi" ? "उत्तर प्रदेश" : "Uttar Pradesh" },
    { value: "Bihar", label: language === "hindi" ? "बिहार" : "Bihar" },
    { value: "Odisha", label: language === "hindi" ? "ओडिशा" : "Odisha" },
    { value: "Andhra Pradesh", label: language === "hindi" ? "आंध्र प्रदेश" : "Andhra Pradesh" },
    { value: "Telangana", label: language === "hindi" ? "तेलंगाना" : "Telangana" },
    { value: "Kerala", label: language === "hindi" ? "केरल" : "Kerala" },
    { value: "Madhya Pradesh", label: language === "hindi" ? "मध्य प्रदेश" : "Madhya Pradesh" },
  ];
  
  // Auto-detect location on first load
  useEffect(() => {
    const detectLocation = async () => {
      const coords = await weatherService.getCurrentLocation();
      if (coords) {
        setUseCurrentLocation(true);
        setLocationDetected(true);
        const data = await weatherService.getCurrentWeather(undefined, coords.lat, coords.lon);
        setWeatherData(data);
        setWeatherLoading(false);
        toast({
          title: language === "hindi" ? "स्थान का पता चला" : "Location Detected",
          description: language === "hindi" ? "आपके वर्तमान स्थान के लिए मौसम दिखाया जा रहा है" : `Showing weather for ${data.current.location}`
        });
      } else {
        // Fallback to Delhi
        const data = await weatherService.getCurrentWeather(selectedState);
        setWeatherData(data);
        setWeatherLoading(false);
      }
    };

    detectLocation();
  }, []);

  // Fetch weather when state changes (manual selection)
  useEffect(() => {
    if (locationDetected && !useCurrentLocation) {
      const fetchWeather = async () => {
        setWeatherLoading(true);
        try {
          const data = await weatherService.getCurrentWeather(selectedState);
          setWeatherData(data);
        } catch (error) {
          console.error('Failed to fetch weather:', error);
        }
        setWeatherLoading(false);
      };

      fetchWeather();
    }
  }, [selectedState, useCurrentLocation, locationDetected]);

  const { advisory, loading: advisoryLoading } = useCropAdvisory();
  const { rates, loading: ratesLoading } = useMandiRates();
  const { schemes, loading: schemesLoading } = useGovernmentSchemes();

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'hindi' ? 'english' : 'hindi';
    setLanguage(newLanguage);
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setUseCurrentLocation(false);
    setWeatherLoading(true);
    toast({
      title: language === "hindi" ? "राज्य बदला गया" : "State Changed",
      description: language === "hindi" ? `${value} चुना गया` : `Selected ${value}`
    });
  };

  const features = [
    {
      id: "weather",
      title: t('weather'),
      subtitle: t('weather_forecast'),
      icon: Cloud,
      variant: "sky" as const,
      onClick: () => navigate("/weather")
    },
    {
      id: "soil",
      title: t('soil_health'),
      subtitle: t('soil_testing'),
      icon: Leaf,
      variant: "earth" as const,
      onClick: () => navigate("/soil-health")
    },
    {
      id: "crop",
      title: t('crop_advisory'),
      subtitle: t('crop_selection'),
      icon: Sprout,
      variant: "default" as const,
      onClick: () => navigate("/crop-advisory")
    },
    {
      id: "fertilizer",
      title: language === "hindi" ? "उर्वरक सहायक" : "Fertilizer Assistant",
      subtitle: language === "hindi" ? "उर्वरक की मात्रा और समय" : "Quantity & timing guide",
      icon: Droplets,
      variant: "secondary" as const,
      onClick: () => navigate("/fertilizer-assistant")
    },
    {
      id: "chatbot",
      title: language === "hindi" ? "AI चैटबॉट" : "AI Chatbot",
      subtitle: language === "hindi" ? "कृषि सवाल पूछें" : "Ask farming questions",
      icon: Bot,
      variant: "default" as const,
      onClick: () => navigate("/chat")
    },
    {
      id: "schemes",
      title: language === "hindi" ? "सरकारी योजनाएं" : "Govt Schemes",
      subtitle: language === "hindi" ? "सब्सिडी और योजना" : "Subsidies & programs",
      icon: FileText,
      variant: "secondary" as const,
      onClick: () => navigate("/government-schemes")
    },
    {
      id: "mandi",
      title: language === "hindi" ? "मंडी भाव" : "Mandi Rates",
      subtitle: language === "hindi" ? "बाजार की कीमतें" : "Market prices",
      icon: TrendingUp,
      variant: "sky" as const,
      onClick: () => navigate("/mandi-rates")
    },
    {
      id: "camera",
      title: language === "hindi" ? "फोटो अपलोड" : "Photo Upload",
      subtitle: language === "hindi" ? "पौधे की जांच करें" : "Plant disease detection",
      icon: Camera,
      variant: "earth" as const,
      onClick: () => {
        toast({
          title: language === "hindi" ? "फोटो अपलोड" : "Photo Upload",
          description: language === "hindi" ? "पौधे की फोटो लें और रोग पहचानें" : "Take plant photo for disease detection"
        });
      }
    },
    {
      id: "calendar",
      title: language === "hindi" ? "कृषि कैलेंडर" : "Farm Calendar",
      subtitle: language === "hindi" ? "बुआई और कटाई" : "Sowing & harvesting",
      icon: Calendar,
      variant: "default" as const,
      onClick: () => navigate("/calendar")
    }
  ];

  const quickStats = [
    {
      label: t('todays_temperature'),
      value: weatherLoading ? "..." : `${weatherData?.current?.temperature || 28}°C`,
      icon: Thermometer,
      color: "text-sky"
    },
    {
      label: t('soil_moisture'),
      value: weatherLoading ? "..." : `${weatherData?.current?.humidity || 65}%`,
      icon: Droplets,
      color: "text-earth"
    },
    {
      label: t('wind_speed_stat'),
      value: weatherLoading ? "..." : `${weatherData?.current?.windSpeed || 12} km/h`,
      icon: Wind,
      color: "text-accent"
    }
  ];

  const navItems = [
    { icon: Home, label: t('home'), active: true },
    { icon: Bell, label: t('alerts') },
    { icon: HelpCircle, label: t('support') },
    { icon: Info, label: t('about') },
    { icon: Settings, label: t('settings') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(142,45%,88%)] via-[hsl(142,35%,92%)] to-white">
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-[hsl(142,45%,65%)] text-white">
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-800">
                {t('hello')}, राजेश जी 👋
              </h2>
              <p className="text-sm text-gray-600">
                {t('good_day')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 text-gray-700">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[hsl(142,45%,65%)] text-white">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100 text-gray-700"
              onClick={toggleLanguage}
            >
              <Languages className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Weather Section */}
      <div className="relative p-4 bg-gradient-to-r from-[hsl(142,45%,75%)] to-[hsl(142,35%,80%)] overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {weatherData ? (
                <img 
                  src={`https:${weatherData.current.icon}`} 
                  alt={weatherData.current.condition}
                  className="h-12 w-12 drop-shadow-lg"
                />
              ) : (
                <Sun className="h-12 w-12 text-yellow-300 drop-shadow-lg" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-2xl text-white drop-shadow-md">
                {weatherLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('loading')}
                  </div>
                ) : (
                  `${t('today')} ${weatherData?.current?.condition || "Sunny"}`
                )}
              </h3>
              <p className="text-white/90 drop-shadow-sm">
                {weatherLoading ? "..." : `${t('max')} ${weatherData?.current?.temperature || 28}°C, ${t('feels_like')} ${weatherData?.current?.feelsLike || 15}°C`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* State Selection Dropdown */}
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger className="w-[140px] bg-white border-gray-200 text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <SelectValue placeholder={language === "hindi" ? "राज्य चुनें" : "Select State"} />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 z-50">
                {indianStates.map((state) => (
                  <SelectItem 
                    key={state.value} 
                    value={state.value}
                    className="hover:bg-gray-100"
                  >
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              size="sm" 
              className="bg-white text-[hsl(142,45%,65%)] hover:bg-gray-50 border border-gray-200"
              onClick={() => navigate("/weather")}
            >
              <Eye className="h-4 w-4 mr-2" />
              {t('details')}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Quick Stats with Animations */}
      <div className="relative px-4 pb-4 grid grid-cols-3 gap-3">
        {quickStats.map((stat, index) => (
          <Card 
            key={index} 
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up opacity-0"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            <CardContent className="p-3 text-center">
              <div className="relative mb-2">
                <stat.icon className="h-6 w-6 mx-auto text-[hsl(142,45%,65%)]" />
              </div>
              <p className="text-lg font-bold text-gray-800">
                {stat.value}
              </p>
              <p className="text-xs text-gray-600 mt-1 leading-tight">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile-Friendly Main Features Grid */}
      <div className="relative px-4 pb-24">
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          {t('main_features')}
        </h3>
        
        {/* Enhanced Feature Cards for Soil, Crop, Fertilizer */}
        <div className="space-y-3 mb-4">
          {/* Soil Health Card */}
          <div
            onClick={() => navigate("/soil-health")}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center p-4 gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                <Leaf className="h-8 w-8 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-base text-gray-800">{t('soil_health')}</h4>
                  <Badge className="bg-green-100 text-green-700 text-[10px] px-1.5">
                    {language === 'hindi' ? 'अच्छा' : 'Good'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-2">{t('soil_testing')}</p>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    pH: 6.8
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    N: {language === 'hindi' ? 'मध्यम' : 'Medium'}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    P: {language === 'hindi' ? 'उच्च' : 'High'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Crop Advisory Card with Real Images */}
          <div
            onClick={() => navigate("/crop-advisory")}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center p-4 gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <Sprout className="h-8 w-8 text-green-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-base text-gray-800">{t('crop_advisory')}</h4>
                  <Badge className="bg-blue-100 text-blue-700 text-[10px] px-1.5">
                    {language === 'hindi' ? 'रबी मौसम' : 'Rabi Season'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-2">{t('crop_selection')}</p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src={wheatImg} alt="Wheat" className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm" />
                    <img src={potatoImg} alt="Potato" className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm" />
                    <img src={mustardImg} alt="Mustard" className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm" />
                  </div>
                  <span className="text-[11px] text-gray-600 font-medium">
                    {language === 'hindi' ? '3 फसलें सुझाई गईं' : '3 crops recommended'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Fertilizer Assistant Card */}
          <div
            onClick={() => navigate("/fertilizer-assistant")}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center p-4 gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                <Droplets className="h-8 w-8 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-base text-gray-800">
                    {language === "hindi" ? "उर्वरक सहायक" : "Fertilizer Assistant"}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {language === "hindi" ? "उर्वरक की मात्रा और समय" : "Quantity & timing guide"}
                </p>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                    {language === 'hindi' ? 'जैविक' : 'Organic'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                    {language === 'hindi' ? 'रासायनिक' : 'Chemical'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">
                    {language === 'hindi' ? 'जैव' : 'Bio'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Enhanced Feature Cards Grid - Real World Style */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Weather Card */}
          <div
            onClick={() => navigate("/weather")}
            className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '550ms', animationFillMode: 'forwards' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-sky-200/70 flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-sky-700" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-sky-500" />
              </div>
              <h4 className="font-bold text-sm text-gray-800 mb-1">{t('weather')}</h4>
              <p className="text-[11px] text-gray-600 mb-2">{t('weather_forecast')}</p>
              <div className="flex items-center gap-1 text-[10px] text-sky-700 font-medium">
                <Zap className="w-3 h-3" />
                {language === 'hindi' ? 'लाइव अपडेट' : 'Live updates'}
              </div>
            </div>
          </div>

          {/* AI Chatbot Card */}
          <div
            onClick={() => navigate("/chat")}
            className="bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-200/70 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-violet-700" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] text-green-600 font-medium">
                    {language === 'hindi' ? 'ऑनलाइन' : 'Online'}
                  </span>
                </div>
              </div>
              <h4 className="font-bold text-sm text-gray-800 mb-1">
                {language === "hindi" ? "AI चैटबॉट" : "AI Chatbot"}
              </h4>
              <p className="text-[11px] text-gray-600 mb-2">
                {language === "hindi" ? "कृषि सवाल पूछें" : "Ask farming questions"}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-violet-700 font-medium">
                <Zap className="w-3 h-3" />
                {language === 'hindi' ? 'AI संचालित' : 'AI Powered'}
              </div>
            </div>
          </div>

          {/* Govt Schemes Card */}
          <div
            onClick={() => navigate("/government-schemes")}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '650ms', animationFillMode: 'forwards' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-200/70 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-orange-700" />
                </div>
                <Badge className="bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5">
                  {language === 'hindi' ? 'नया' : 'New'}
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-gray-800 mb-1">
                {language === "hindi" ? "सरकारी योजनाएं" : "Govt Schemes"}
              </h4>
              <p className="text-[11px] text-gray-600 mb-2">
                {language === "hindi" ? "सब्सिडी और योजना" : "Subsidies & programs"}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-orange-700 font-medium">
                <IndianRupee className="w-3 h-3" />
                {language === 'hindi' ? '₹50,000 तक' : 'Up to ₹50,000'}
              </div>
            </div>
          </div>

          {/* Mandi Rates Card */}
          <div
            onClick={() => navigate("/mandi-rates")}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-200/70 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-medium">
                  <span className="text-green-500">↑</span> 5%
                </div>
              </div>
              <h4 className="font-bold text-sm text-gray-800 mb-1">
                {language === "hindi" ? "मंडी भाव" : "Mandi Rates"}
              </h4>
              <p className="text-[11px] text-gray-600 mb-2">
                {language === "hindi" ? "बाजार की कीमतें" : "Market prices"}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                <Clock className="w-3 h-3" />
                {language === 'hindi' ? 'आज अपडेट' : 'Updated today'}
              </div>
            </div>
          </div>

          {/* Photo Upload / Disease Detection Card */}
          <div
            onClick={() => {
              toast({
                title: language === "hindi" ? "फोटो अपलोड" : "Photo Upload",
                description: language === "hindi" ? "पौधे की फोटो लें और रोग पहचानें" : "Take plant photo for disease detection"
              });
            }}
            className="bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '750ms', animationFillMode: 'forwards' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-rose-200/70 flex items-center justify-center">
                  <Camera className="h-5 w-5 text-rose-700" />
                </div>
                <Scan className="w-4 h-4 text-rose-500" />
              </div>
              <h4 className="font-bold text-sm text-gray-800 mb-1">
                {language === "hindi" ? "रोग पहचान" : "Disease Detection"}
              </h4>
              <p className="text-[11px] text-gray-600 mb-2">
                {language === "hindi" ? "फोटो से जांच करें" : "Scan plant photos"}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-rose-700 font-medium">
                <Zap className="w-3 h-3" />
                {language === 'hindi' ? 'तुरंत परिणाम' : 'Instant results'}
              </div>
            </div>
          </div>

          {/* Farm Calendar Card */}
          <div
            onClick={() => navigate("/calendar")}
            className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-200/70 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-700" />
                </div>
                <Badge className="bg-amber-200 text-amber-700 text-[9px] px-1.5 py-0.5">
                  {language === 'hindi' ? '2 कार्य' : '2 tasks'}
                </Badge>
              </div>
              <h4 className="font-bold text-sm text-gray-800 mb-1">
                {language === "hindi" ? "कृषि कैलेंडर" : "Farm Calendar"}
              </h4>
              <p className="text-[11px] text-gray-600 mb-2">
                {language === "hindi" ? "बुआई और कटाई" : "Sowing & harvesting"}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                <Clock className="w-3 h-3" />
                {language === 'hindi' ? 'आज: सिंचाई' : 'Today: Irrigation'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 gap-1 px-2 py-3">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center h-14 text-xs gap-1 rounded-lg transition-all ${
                item.active 
                  ? 'text-[hsl(142,45%,65%)] bg-[hsl(142,45%,95%)]' 
                  : 'text-gray-600 hover:text-[hsl(142,45%,65%)] hover:bg-gray-50'
              }`}
              onClick={() => {
                if (item.label.includes("Settings") || item.label.includes("सेटिंग्स")) {
                  navigate("/settings");
                } else {
                  toast({
                    title: item.label,
                    description: t('coming_soon')
                  });
                }
              }}
            >
              <item.icon className="h-5 w-5" />
              <span className={item.active ? 'font-semibold' : 'font-medium'}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Enhanced space for bottom nav */}
      <div className="h-24"></div>
    </div>
  );
};

export default FarmerDashboard;
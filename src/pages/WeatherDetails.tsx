import { ArrowLeft, Cloud, Sun, CloudRain, Wind, Droplets, Eye, Gauge, MapPin, Sunrise, Sunset, Loader2, RefreshCw, MapPinned, Calendar, Share2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { weatherService, WeatherData } from "@/services/weatherService";
import { useLanguageHook } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Indian States and Districts Data
const indianStates = {
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
};

const WeatherDetails = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguageHook();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [useAutoLocation, setUseAutoLocation] = useState(true);

  const fetchWeather = async (locationOverride?: string) => {
    setLoading(true);
    try {
      let data: WeatherData | undefined;

      if (locationOverride) {
        data = await weatherService.getCurrentWeather(locationOverride);
        toast({
          title: language === 'hindi' ? 'स्थान चयनित' : 'Location Selected',
          description: locationOverride,
        });
      } else if (useAutoLocation) {
        const coords = await weatherService.getCurrentLocation();
        if (coords) {
          data = await weatherService.getCurrentWeather(undefined, coords.lat, coords.lon);
          toast({
            title: language === 'hindi' ? 'स्थान का पता लगाया गया' : 'Location Detected',
            description: data.current.location,
          });
        }
      }

      // Always ensure we have data (prevents stuck / blank states)
      if (!data) {
        data = await weatherService.getCurrentWeather('Delhi');
        toast({
          title: language === 'hindi' ? 'डिफ़ॉल्ट स्थान' : 'Default Location',
          description: 'Delhi, India',
        });
      }

      setWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      toast({
        title: language === 'hindi' ? 'त्रुटि' : 'Error',
        description: language === 'hindi' ? 'मौसम डेटा लोड करने में विफल' : 'Failed to load weather data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = language === 'hindi' ? 'मौसम • Krishi Sakhi' : 'Weather • Krishi Sakhi';
  }, [language]);

  useEffect(() => {
    fetchWeather();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      setUseAutoLocation(false);
      fetchWeather(selectedDistrict);
    }
  }, [selectedDistrict]);

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return Sun;
      case 'cloudy':
      case 'partly cloudy':
        return Cloud;
      case 'rainy':
      case 'rain':
        return CloudRain;
      default:
        return Sun;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gradient-sky)] flex items-center justify-center">
        <div className="text-center text-sky-foreground">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3" />
          <p className="text-base font-semibold">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center">
        <div className="text-center text-white">
          <Cloud className="h-12 w-12 mx-auto mb-4" />
          <p className="text-xl font-semibold">No weather data available</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleRefresh = () => {
    fetchWeather(selectedDistrict || undefined);
  };

  const handleShareReport = () => {
    const report = `Weather Report - ${weatherData?.current.location}\nTemp: ${weatherData?.current.temperature}°C\nCondition: ${weatherData?.current.condition}\nHumidity: ${weatherData?.current.humidity}%`;
    navigator.share?.({ title: 'Weather Report', text: report }).catch(() => {
      navigator.clipboard.writeText(report);
      toast({ title: language === 'hindi' ? 'रिपोर्ट कॉपी की गई' : 'Report Copied' });
    });
  };

  const handleVoiceSummary = () => {
    if (!weatherData) return;
    const text = language === 'hindi' 
      ? `${weatherData.current.location} में मौसम ${weatherData.current.condition} है। तापमान ${weatherData.current.temperature} डिग्री सेल्सियस है।`
      : `Weather in ${weatherData.current.location} is ${weatherData.current.condition}. Temperature is ${weatherData.current.temperature} degrees celsius.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
    speechSynthesis.speak(utterance);
  };

  // Prepare chart data
  const chartData = weatherData?.forecast.slice(0, 5).map(day => ({
    date: formatDate(day.date),
    temp: day.maxTemp,
    humidity: day.humidity,
  })) || [];

  return (
    <main className="min-h-screen bg-hero-pattern pb-6">
      {/* Header */}
      <header className="bg-card/70 backdrop-blur-lg border-b border-border/40 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/farmer-dashboard')}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-bold text-foreground">
              {language === 'hindi' ? 'मौसम विवरण' : 'Weather Details'}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-5 w-5" />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleVoiceSummary}>
              <Volume2 className="h-5 w-5" />
              <span className="sr-only">Voice summary</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShareReport}>
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share report</span>
            </Button>
          </div>
        </div>

        {/* Location Selector */}
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <MapPinned className="h-4 w-4" />
            <span>{language === 'hindi' ? 'स्थान चुनें' : 'Select Location'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={selectedState}
              onValueChange={(val) => {
                setSelectedState(val);
                setSelectedDistrict("");
              }}
            >
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder={language === 'hindi' ? 'राज्य' : 'State'} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(indianStates).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedState}>
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder={language === 'hindi' ? 'जिला' : 'District'} />
              </SelectTrigger>
              <SelectContent>
                {selectedState &&
                  indianStates[selectedState as keyof typeof indianStates]?.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <section className="p-4 space-y-4" aria-label="Weather overview">
        {/* Current Weather Hero Card */}
        <article className="relative overflow-hidden rounded-3xl bg-[var(--gradient-sky)] p-6 shadow-[var(--shadow-magical)]">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-sky-light/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            {/* Left: location + temp */}
            <div className="flex-1">
              <p className="text-sky-foreground/90 text-sm flex items-center gap-1.5 mb-3">
                <MapPin className="h-4 w-4" />
                {weatherData.current.location}
              </p>
              <h2 className="text-7xl font-extrabold tracking-tight text-sky-foreground drop-shadow-lg">
                {weatherData.current.temperature}°
              </h2>
              <p className="text-sky-foreground text-xl font-medium mt-1">
                {weatherData.current.condition}
              </p>
              <p className="text-sky-foreground/70 text-sm mt-2">
                {t('feels_like')} {weatherData.current.feelsLike}°C
              </p>
            </div>

            {/* Right: icon */}
            <img
              src={weatherData.current.icon}
              alt={weatherData.current.condition}
              className="h-28 w-28 drop-shadow-2xl animate-float"
              loading="lazy"
            />
          </div>

          {/* Quick Stats Row */}
          <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 pt-5 border-t border-sky-foreground/20">
            <div className="text-center">
              <Droplets className="h-5 w-5 mx-auto mb-1 text-sky-foreground/80" />
              <p className="text-sky-foreground/60 text-xs">{t('humidity')}</p>
              <p className="text-sky-foreground font-bold text-lg">{weatherData.current.humidity}%</p>
            </div>
            <div className="text-center">
              <Wind className="h-5 w-5 mx-auto mb-1 text-sky-foreground/80" />
              <p className="text-sky-foreground/60 text-xs">{t('wind_speed')}</p>
              <p className="text-sky-foreground font-bold text-lg">{weatherData.current.windSpeed} km/h</p>
            </div>
            <div className="text-center">
              <Eye className="h-5 w-5 mx-auto mb-1 text-sky-foreground/80" />
              <p className="text-sky-foreground/60 text-xs">{t('visibility')}</p>
              <p className="text-sky-foreground font-bold text-lg">{weatherData.current.visibility} km</p>
            </div>
          </div>

          {/* Sunrise / Sunset Row */}
          {weatherData.current.sunrise && weatherData.current.sunset && (
            <div className="relative z-10 grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-sky-foreground/20">
              <div className="flex items-center gap-3">
                <Sunrise className="h-6 w-6 text-amber-300" />
                <div>
                  <p className="text-sky-foreground/60 text-xs">{t('sunrise')}</p>
                  <p className="text-sky-foreground font-bold">
                    {new Date(weatherData.current.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="text-sky-foreground/60 text-xs">{t('sunset')}</p>
                  <p className="text-sky-foreground font-bold">
                    {new Date(weatherData.current.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <Sunset className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          )}
        </article>

        {/* Hourly Forecast */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('hourly_temp')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {weatherData.hourly.slice(0, 12).map((hour, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center min-w-[70px] p-3 rounded-xl bg-gradient-to-b from-sky-50 to-blue-50 border border-sky-200"
                >
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {hour.time}:00
                  </p>
                  <div className="h-10 w-10 mb-2">
                    {hour.precipitation > 50 ? (
                      <CloudRain className="h-8 w-8 text-blue-500" />
                    ) : hour.precipitation > 20 ? (
                      <Cloud className="h-8 w-8 text-gray-400" />
                    ) : (
                      <Sun className="h-8 w-8 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-lg font-bold text-gray-900">{Math.round(hour.temp)}°</p>
                  <p className="text-xs text-blue-600 mt-1">{hour.precipitation}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Day-wise Forecast */}
        <Card className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-[var(--shadow-card)] border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {language === 'hindi'
                ? `दिन अनुसार पूर्वानुमान (${Math.min(7, weatherData.forecast.length)} दिन)`
                : `Day-wise Forecast (${Math.min(7, weatherData.forecast.length)} Days)`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weatherData.forecast.slice(0, 7).map((day, index) => (
              <article
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-background/60 hover:bg-background/80 transition-[var(--transition-smooth)] border border-border/50"
              >
                <div className="flex items-center gap-3 flex-1">
                  <img src={day.icon} alt={`${day.condition} weather icon`} className="h-12 w-12" loading="lazy" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {index === 0 ? t('today') : formatDate(day.date)}
                    </p>
                    <p className="text-sm text-muted-foreground">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">
                    {day.maxTemp}° <span className="text-muted-foreground text-base">{day.minTemp}°</span>
                  </p>
                  <p className="text-xs text-sky flex items-center gap-1 justify-end mt-1">
                    <Droplets className="h-3 w-3" />
                    {day.precipitation}%
                  </p>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>

        {/* More Details */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{language === 'hindi' ? 'अधिक विवरण' : 'More Details'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
                <Gauge className="h-6 w-6 mb-2 text-purple-600" />
                <p className="text-sm text-gray-600">{t('pressure')}</p>
                <p className="text-xl font-bold text-gray-900">{weatherData.current.pressure} mb</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                <Sun className="h-6 w-6 mb-2 text-orange-600" />
                <p className="text-sm text-gray-600">UV Index</p>
                <p className="text-xl font-bold text-gray-900">{weatherData.current.uvIndex}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5-Day Forecast Graph */}
        <Card className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-sky" />
              {language === 'hindi' ? '5-दिन का पूर्वानुमान' : '5-Day Forecast'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--foreground))' }}
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--foreground))' }}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  name={language === 'hindi' ? 'तापमान (°C)' : 'Temp (°C)'}
                  dot={{ fill: 'hsl(var(--accent))', r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="hsl(var(--sky))" 
                  strokeWidth={3}
                  name={language === 'hindi' ? 'आर्द्रता (%)' : 'Humidity (%)'}
                  dot={{ fill: 'hsl(var(--sky))', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Farming Advisory */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary flex items-center gap-2">
              <Sun className="h-5 w-5" />
              {language === 'hindi' ? 'कृषि सलाह' : 'Farming Advisory'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherData.current.condition.toLowerCase().includes('sunny') || weatherData.current.condition.toLowerCase().includes('clear') ? (
              <div className="flex gap-3 p-4 rounded-xl bg-white/90 border border-primary/20 shadow-sm">
                <Sun className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    {language === 'hindi' ? 'धूप का मौसम' : 'Sunny Weather'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'hindi' 
                      ? 'कटाई और खेत के काम के लिए बेहतरीन मौसम। फसलों के लिए पर्याप्त सिंचाई सुनिश्चित करें। आज सुबह 6-9 बजे और शाम 4-6 बजे सिंचाई करना सबसे अच्छा है।'
                      : 'Perfect weather for harvesting and field work. Ensure adequate irrigation for crops. Best time to irrigate is early morning (6-9 AM) or evening (4-6 PM).'}
                  </p>
                </div>
              </div>
            ) : null}
            
            {weatherData.current.condition.toLowerCase().includes('cloud') && (
              <div className="flex gap-3 p-4 rounded-xl bg-white/90 border border-primary/20 shadow-sm">
                <Cloud className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    {language === 'hindi' ? 'बादल छाए हुए हैं' : 'Cloudy Conditions'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'hindi'
                      ? 'रोपाई के लिए अच्छी स्थिति। कम पानी वाष्पीकरण का मतलब कम सिंचाई की आवश्यकता। आज खाद डालने का अच्छा समय है।'
                      : 'Good conditions for transplanting. Reduced water evaporation means less irrigation needed. Good time to apply fertilizer today.'}
                  </p>
                </div>
              </div>
            )}

            {weatherData.forecast[0].precipitation > 30 && (
              <div className="flex gap-3 p-4 rounded-xl bg-white/90 border border-sky/30 shadow-sm">
                <CloudRain className="h-6 w-6 text-sky flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    {language === 'hindi' ? 'बारिश की संभावना' : 'Rain Expected'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'hindi'
                      ? 'अगले 2 दिनों में सिंचाई की आवश्यकता नहीं। छिड़काव गतिविधियों से बचें। फसल कटाई स्थगित करें।'
                      : 'No irrigation needed for next 2 days. Avoid spraying activities. Postpone harvesting operations.'}
                  </p>
                </div>
              </div>
            )}
            
            {weatherData.current.humidity > 70 && (
              <div className="flex gap-3 p-4 rounded-xl bg-white/90 border border-sky/30 shadow-sm">
                <Droplets className="h-6 w-6 text-sky flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    {language === 'hindi' ? 'उच्च आर्द्रता चेतावनी' : 'High Humidity Alert'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'hindi'
                      ? 'फसलों में फंगल रोगों की संभावना। निवारक फफूंदनाशक का छिड़काव करें। पत्ती झुलसा और ब्लास्ट रोग से सावधान रहें।'
                      : 'Risk of fungal diseases in crops. Apply preventive fungicide spray. Watch for leaf blight and blast disease.'}
                  </p>
                </div>
              </div>
            )}
            
            {weatherData.current.windSpeed > 15 && (
              <div className="flex gap-3 p-4 rounded-xl bg-white/90 border border-primary/20 shadow-sm">
                <Wind className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    {language === 'hindi' ? 'तेज हवा चेतावनी' : 'Strong Wind Alert'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'hindi'
                      ? 'ग्रीनहाउस संरचनाओं और लंबी फसलों को सुरक्षित करें। छिड़काव कार्यों को स्थगित करें। टमाटर और बैंगन के पौधों को सहारा दें।'
                      : 'Secure greenhouse structures and tall crops. Postpone spraying operations. Provide support to tomato and brinjal plants.'}
                  </p>
                </div>
              </div>
            )}

            {weatherData.current.temperature > 35 && (
              <div className="flex gap-3 p-4 rounded-xl bg-white/90 border border-accent/30 shadow-sm">
                <Sun className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">
                    {language === 'hindi' ? 'उच्च तापमान सावधानी' : 'High Temperature Caution'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'hindi'
                      ? 'फसलों को गर्मी के तनाव से बचाएं। दिन में दो बार सिंचाई करें। मल्चिंग का उपयोग करें।'
                      : 'Protect crops from heat stress. Irrigate twice a day. Use mulching to conserve moisture.'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default WeatherDetails;
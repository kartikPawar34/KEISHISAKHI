import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'hindi' | 'english';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageHook = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'hindi';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const translations = {
    // Weather translations
    'weather': { hindi: 'मौसम', english: 'Weather' },
    'weather_forecast': { hindi: '7-दिन पूर्वानुमान', english: '7-day forecast' },
    'weather_details': { hindi: 'मौसम विवरण', english: 'Weather Details' },
    'temperature': { hindi: 'तापमान', english: 'Temperature' },
    'humidity': { hindi: 'नमी', english: 'Humidity' },
    'wind_speed': { hindi: 'हवा की गति', english: 'Wind Speed' },
    'pressure': { hindi: 'दबाव', english: 'Pressure' },
    'visibility': { hindi: 'दृश्यता', english: 'Visibility' },
    'uv_index': { hindi: 'यूवी सूचकांक', english: 'UV Index' },
    'feels_like': { hindi: 'महसूस हो रहा', english: 'Feels Like' },
    'forecast': { hindi: 'पूर्वानुमान', english: 'Forecast' },
    'hourly_temp': { hindi: 'घंटेवार तापमान', english: 'Hourly Temperature' },
    'rain_chance': { hindi: 'बारिश की संभावना', english: 'Rain Chance' },
    'sunrise': { hindi: 'सूर्योदय', english: 'Sunrise' },
    'sunset': { hindi: 'सूर्यास्त', english: 'Sunset' },
    
    // Dashboard translations
    'hello': { hindi: 'नमस्ते', english: 'Hello' },
    'good_day': { hindi: 'आज का दिन शुभ हो', english: 'Have a great day' },
    'main_features': { hindi: '🌾 मुख्य सुविधाएं', english: '🌾 Main Features' },
    'today': { hindi: 'आज', english: 'Today' },
    'max': { hindi: 'अधिकतम', english: 'Max' },
    'min': { hindi: 'न्यूनतम', english: 'Min' },
    'details': { hindi: 'विस्तार', english: 'Details' },
    'loading': { hindi: 'लोड हो रहा...', english: 'Loading...' },
    
    // Feature translations
    'soil_health': { hindi: 'मिट्टी स्वास्थ्य', english: 'Soil Health' },
    'soil_testing': { hindi: 'मिट्टी परीक्षण और सुझाव', english: 'Soil testing & advisory' },
    'crop_advisory': { hindi: 'फसल सलाह', english: 'Crop Advisory' },
    'crop_selection': { hindi: 'फसल चुनने में मदद', english: 'Crop selection guide' },
    'fertilizer_assistant': { hindi: 'उर्वरक सहायक', english: 'Fertilizer Assistant' },
    'fertilizer_guide': { hindi: 'उर्वरक की मात्रा और समय', english: 'Quantity & timing guide' },
    'ai_chatbot': { hindi: 'AI चैटबॉट', english: 'AI Chatbot' },
    'ask_questions': { hindi: 'कृषि सवाल पूछें', english: 'Ask farming questions' },
    'govt_schemes': { hindi: 'सरकारी योजनाएं', english: 'Govt Schemes' },
    'subsidies': { hindi: 'सब्सिडी और योजना', english: 'Subsidies & programs' },
    'mandi_rates': { hindi: 'मंडी भाव', english: 'Mandi Rates' },
    'market_prices': { hindi: 'बाजार की कीमतें', english: 'Market prices' },
    'photo_upload': { hindi: 'फोटो अपलोड', english: 'Photo Upload' },
    'disease_detection': { hindi: 'पौधे की जांच करें', english: 'Plant disease detection' },
    'farm_calendar': { hindi: 'कृषि कैलेंडर', english: 'Farm Calendar' },
    'sowing_harvesting': { hindi: 'बुआई और कटाई', english: 'Sowing & harvesting' },
    
    // Navigation
    'home': { hindi: 'होम', english: 'Home' },
    'alerts': { hindi: 'अलर्ट', english: 'Alerts' },
    'support': { hindi: 'सहायता', english: 'Support' },
    'about': { hindi: 'जानकारी', english: 'About' },
    'settings': { hindi: 'सेटिंग्स', english: 'Settings' },
    'coming_soon': { hindi: 'जल्द ही उपलब्ध', english: 'Coming soon' },
    
    // Stats
    'todays_temperature': { hindi: 'आज का तापमान', english: "Today's Temperature" },
    'soil_moisture': { hindi: 'मिट्टी की नमी', english: 'Soil Moisture' },
    'wind_speed_stat': { hindi: 'हवा की गति', english: 'Wind Speed' },
  };

  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    return translation ? translation[language] : key;
  };

  return { language, setLanguage, t };
};
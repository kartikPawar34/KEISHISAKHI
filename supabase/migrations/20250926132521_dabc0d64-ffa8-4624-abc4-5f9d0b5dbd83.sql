-- Create weather data table
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  temperature_max DECIMAL(5,2),
  temperature_min DECIMAL(5,2),
  humidity INTEGER,
  wind_speed DECIMAL(5,2),
  weather_condition TEXT,
  forecast_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crop advisory table
CREATE TABLE public.crop_advisory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  advisory_text TEXT NOT NULL,
  advisory_text_hindi TEXT,
  season TEXT NOT NULL,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mandi rates table
CREATE TABLE public.mandi_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  market_name TEXT NOT NULL,
  price_per_quintal DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create government schemes table
CREATE TABLE public.government_schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_name TEXT NOT NULL,
  scheme_name_hindi TEXT,
  description TEXT NOT NULL,
  description_hindi TEXT,
  eligibility TEXT,
  application_link TEXT,
  subsidy_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farmer profiles table
CREATE TABLE public.farmer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  land_size TEXT,
  soil_type TEXT,
  irrigation_type TEXT,
  preferred_language TEXT DEFAULT 'hindi',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plant disease detection table
CREATE TABLE public.plant_disease_detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES public.farmer_profiles(id) ON DELETE CASCADE,
  image_url TEXT,
  disease_detected TEXT,
  confidence_score DECIMAL(5,2),
  treatment_advice TEXT,
  treatment_advice_hindi TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_advisory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_disease_detections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public data (weather, advisory, rates, schemes)
CREATE POLICY "Weather data is viewable by everyone" 
ON public.weather_data FOR SELECT USING (true);

CREATE POLICY "Crop advisory is viewable by everyone" 
ON public.crop_advisory FOR SELECT USING (true);

CREATE POLICY "Mandi rates are viewable by everyone" 
ON public.mandi_rates FOR SELECT USING (true);

CREATE POLICY "Government schemes are viewable by everyone" 
ON public.government_schemes FOR SELECT USING (true);

-- Create RLS policies for farmer profiles
CREATE POLICY "Farmers can view their own profile" 
ON public.farmer_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Farmers can create their own profile" 
ON public.farmer_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Farmers can update their own profile" 
ON public.farmer_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for plant disease detections
CREATE POLICY "Farmers can view their own disease detections" 
ON public.plant_disease_detections FOR SELECT 
USING (farmer_id IN (SELECT id FROM public.farmer_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Farmers can create their own disease detections" 
ON public.plant_disease_detections FOR INSERT 
WITH CHECK (farmer_id IN (SELECT id FROM public.farmer_profiles WHERE user_id = auth.uid()));

-- Insert sample data
INSERT INTO public.weather_data (location, temperature_max, temperature_min, humidity, wind_speed, weather_condition, forecast_date)
VALUES 
  ('Delhi', 28.5, 15.2, 65, 12.3, 'Sunny', CURRENT_DATE),
  ('Mumbai', 32.1, 22.8, 78, 8.5, 'Partly Cloudy', CURRENT_DATE),
  ('Punjab', 26.3, 12.1, 58, 15.2, 'Clear', CURRENT_DATE);

INSERT INTO public.crop_advisory (crop_name, advisory_text, advisory_text_hindi, season, region)
VALUES 
  ('Wheat', 'Plant wheat seeds in November for best yield. Use quality seeds and proper fertilizer.', 'सर्वोत्तम उत्पादन के लिए नवंबर में गेहूं के बीज बोएं। गुणवत्तापूर्ण बीज और उचित उर्वरक का उपयोग करें।', 'Rabi', 'North India'),
  ('Rice', 'Transplant rice seedlings during monsoon. Maintain proper water levels in fields.', 'मानसून के दौरान धान के पौधे रोपें। खेतों में उचित जल स्तर बनाए रखें।', 'Kharif', 'All India'),
  ('Cotton', 'Sow cotton seeds in May-June. Use BT cotton varieties for better pest resistance.', 'मई-जून में कपास के बीज बोएं। बेहतर कीट प्रतिरोध के लिए बीटी कपास किस्मों का उपयोग करें।', 'Kharif', 'Central India');

INSERT INTO public.mandi_rates (crop_name, market_name, price_per_quintal)
VALUES 
  ('Wheat', 'Azadpur Mandi', 2100.00),
  ('Rice', 'Karnal Mandi', 1850.00),
  ('Cotton', 'Akola Mandi', 5200.00),
  ('Sugarcane', 'Muzaffarnagar Mandi', 350.00);

INSERT INTO public.government_schemes (scheme_name, scheme_name_hindi, description, description_hindi, eligibility, subsidy_amount, application_link)
VALUES 
  ('PM-KISAN', 'प्रधानमंत्री किसान सम्मान निधि', 'Direct income support to farmers', 'किसानों को प्रत्यक्ष आय सहायता', 'Small and marginal farmers', 6000.00, 'https://pmkisan.gov.in'),
  ('Pradhan Mantri Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना', 'Crop insurance scheme for farmers', 'किसानों के लिए फसल बीमा योजना', 'All farmers', NULL, 'https://pmfby.gov.in'),
  ('Soil Health Card Scheme', 'मृदा स्वास्थ्य कार्ड योजना', 'Free soil testing and health cards', 'मुफ्त मिट्टी परीक्षण और स्वास्थ्य कार्ड', 'All farmers', NULL, 'https://soilhealth.dac.gov.in');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_weather_data_updated_at
  BEFORE UPDATE ON public.weather_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crop_advisory_updated_at
  BEFORE UPDATE ON public.crop_advisory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmer_profiles_updated_at
  BEFORE UPDATE ON public.farmer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
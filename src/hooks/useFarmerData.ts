import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  location: string;
  temperature_max: number;
  temperature_min: number;
  humidity: number;
  wind_speed: number;
  weather_condition: string;
  forecast_date: string;
}

export interface CropAdvisory {
  crop_name: string;
  advisory_text: string;
  advisory_text_hindi: string;
  season: string;
  region: string;
}

export interface MandiRate {
  crop_name: string;
  market_name: string;
  price_per_quintal: number;
  date: string;
}

export interface GovernmentScheme {
  scheme_name: string;
  scheme_name_hindi: string;
  description: string;
  description_hindi: string;
  eligibility: string;
  application_link: string;
  subsidy_amount: number;
}

export const useWeatherData = (location: string = 'Delhi') => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      const { data } = await supabase
        .from('weather_data')
        .select('*')
        .eq('location', location)
        .eq('forecast_date', new Date().toISOString().split('T')[0])
        .single();
      
      setWeather(data);
      setLoading(false);
    };

    fetchWeather();
  }, [location]);

  return { weather, loading };
};

export const useCropAdvisory = () => {
  const [advisory, setAdvisory] = useState<CropAdvisory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisory = async () => {
      const { data } = await supabase
        .from('crop_advisory')
        .select('*')
        .limit(3);
      
      setAdvisory(data || []);
      setLoading(false);
    };

    fetchAdvisory();
  }, []);

  return { advisory, loading };
};

export const useMandiRates = () => {
  const [rates, setRates] = useState<MandiRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      const { data } = await supabase
        .from('mandi_rates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRates(data || []);
      setLoading(false);
    };

    fetchRates();
  }, []);

  return { rates, loading };
};

export const useGovernmentSchemes = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      const { data } = await supabase
        .from('government_schemes')
        .select('*')
        .eq('is_active', true)
        .limit(5);
      
      setSchemes(data || []);
      setLoading(false);
    };

    fetchSchemes();
  }, []);

  return { schemes, loading };
};
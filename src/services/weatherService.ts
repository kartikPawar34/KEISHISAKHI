import { supabase } from '@/integrations/supabase/client';

export interface CurrentWeather {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  sunrise?: number; // Unix timestamp
  sunset?: number;  // Unix timestamp
}

export interface WeatherForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: WeatherForecast[];
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
    precipitation: number;
  }>;
}

class WeatherService {
  async getCurrentWeather(location?: string, lat?: number, lon?: number): Promise<WeatherData> {
    try {
      const body: Record<string, unknown> = {};
      if (lat && lon) {
        body.lat = lat;
        body.lon = lon;
      } else if (location) {
        body.location = location;
      } else {
        body.location = 'Delhi';
      }

      const { data, error } = await supabase.functions.invoke('get-weather', {
        body
      });

      if (error) {
        console.error('Weather API error:', error);
        throw error;
      }

      if (data.error) {
        console.error('Weather data error:', data.error);
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Weather fetch error:', error);
      return this.getFallbackWeatherData();
    }
  }

  async getCurrentLocation(): Promise<{ lat: number; lon: number } | null> {
    // In some environments (iframes/headless), geolocation may never resolve.
    // We hard-timeout to avoid an infinite loading state.
    return await Promise.race([
      new Promise<{ lat: number; lon: number } | null>((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          () => resolve(null),
          {
            timeout: 6000,
            enableHighAccuracy: false,
          }
        );
      }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 6500)),
    ]);
  }

  private generateMockWeatherData(location: string): WeatherData {
    const locations = {
      'Delhi': { name: 'Delhi', region: 'India', baseTemp: 28 },
      'Mumbai': { name: 'Mumbai', region: 'Maharashtra', baseTemp: 32 },
      'Bangalore': { name: 'Bangalore', region: 'Karnataka', baseTemp: 25 },
      'Chennai': { name: 'Chennai', region: 'Tamil Nadu', baseTemp: 30 },
      'Kolkata': { name: 'Kolkata', region: 'West Bengal', baseTemp: 29 },
      'Pune': { name: 'Pune', region: 'Maharashtra', baseTemp: 26 },
      'Hyderabad': { name: 'Hyderabad', region: 'Telangana', baseTemp: 27 }
    };

    const locationData = locations[location as keyof typeof locations] || locations['Delhi'];
    const currentTemp = locationData.baseTemp + (Math.random() * 6 - 3); // ±3°C variation
    
    const conditions = [
      { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
      { text: 'Partly Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
      { text: 'Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/119.png' },
      { text: 'Light Rain', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' },
      { text: 'Clear', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' }
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    const currentWeather: CurrentWeather = {
      location: `${locationData.name}, ${locationData.region}`,
      temperature: Math.round(currentTemp),
      humidity: Math.round(50 + Math.random() * 40), // 50-90%
      windSpeed: Math.round(5 + Math.random() * 20), // 5-25 km/h
      condition: randomCondition.text,
      icon: randomCondition.icon,
      pressure: Math.round(1000 + Math.random() * 40), // 1000-1040 mb
      visibility: Math.round(8 + Math.random() * 7), // 8-15 km
      uvIndex: Math.round(3 + Math.random() * 8), // 3-11
      feelsLike: Math.round(currentTemp + Math.random() * 4 - 2)
    };

    // Generate 7-day forecast
    const forecastData: WeatherForecast[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayTemp = locationData.baseTemp + (Math.random() * 8 - 4);
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      return {
        date: date.toISOString().split('T')[0],
        maxTemp: Math.round(dayTemp + 3),
        minTemp: Math.round(dayTemp - 5),
        condition: condition.text,
        icon: condition.icon,
        humidity: Math.round(50 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 20),
        precipitation: Math.round(Math.random() * 50)
      };
    });

    // Generate 24-hour hourly data
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hourTemp = currentTemp + (Math.random() * 6 - 3);
      return {
        time: i.toString(),
        temp: Math.round(hourTemp),
        condition: conditions[Math.floor(Math.random() * conditions.length)].text,
        precipitation: Math.round(Math.random() * 30)
      };
    });

    return {
      current: currentWeather,
      forecast: forecastData,
      hourly: hourlyData
    };
  }

  private getFallbackWeatherData(): WeatherData {
    return {
      current: {
        location: 'Delhi, India',
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        condition: 'Partly Cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        pressure: 1013,
        visibility: 10,
        uvIndex: 6,
        feelsLike: 32
      },
      forecast: [
        {
          date: new Date().toISOString().split('T')[0],
          maxTemp: 28,
          minTemp: 15,
          condition: 'Partly Cloudy',
          icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
          humidity: 65,
          windSpeed: 12,
          precipitation: 10
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          maxTemp: 30,
          minTemp: 17,
          condition: 'Sunny',
          icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          humidity: 60,
          windSpeed: 15,
          precipitation: 0
        }
      ],
      hourly: Array.from({ length: 24 }, (_, i) => ({
        time: i.toString(),
        temp: 20 + Math.random() * 15,
        condition: 'Clear',
        precipitation: Math.random() * 30
      }))
    };
  }
}

export const weatherService = new WeatherService();
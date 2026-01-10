import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { location, lat, lon } = await req.json();
    
    if (!location && (!lat || !lon)) {
      throw new Error('Location or coordinates (lat, lon) are required');
    }

    const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');
    console.log('OpenWeather API key status:', OPENWEATHER_API_KEY ? 'Present' : 'Missing');
    
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key not configured');
    }

    // Build API URLs based on input type
    let currentWeatherUrl, forecastUrl;
    if (lat && lon) {
      console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else {
      console.log(`Fetching weather for location: ${location}`);
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    }

    // Get current weather
    const currentResponse = await fetch(currentWeatherUrl);

    if (!currentResponse.ok) {
      const errorText = await currentResponse.text();
      console.error('OpenWeather API error:', errorText);
      throw new Error(`OpenWeather API error: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    // Get forecast
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      console.error('OpenWeather forecast API error:', errorText);
      throw new Error(`OpenWeather forecast API error: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();

    // Format current weather
    const current = {
      location: `${currentData.name}, ${currentData.sys.country}`,
      temperature: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      condition: currentData.weather[0].main,
      icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
      pressure: currentData.main.pressure,
      visibility: Math.round(currentData.visibility / 1000), // Convert m to km
      uvIndex: 0, // OpenWeather free tier doesn't include UV index
      feelsLike: Math.round(currentData.main.feels_like),
      sunrise: currentData.sys.sunrise, // Unix timestamp
      sunset: currentData.sys.sunset    // Unix timestamp
    };

    // Format 7-day forecast (using 3-hour intervals from forecast API)
    const dailyForecasts = new Map();
    forecastData.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          date,
          temps: [],
          conditions: [],
          icons: [],
          humidity: [],
          windSpeed: [],
          precipitation: []
        });
      }
      const day = dailyForecasts.get(date);
      day.temps.push(item.main.temp);
      day.conditions.push(item.weather[0].main);
      day.icons.push(item.weather[0].icon);
      day.humidity.push(item.main.humidity);
      day.windSpeed.push(item.wind.speed * 3.6);
      day.precipitation.push(item.pop * 100); // Convert probability to percentage
    });

    const forecast = Array.from(dailyForecasts.values()).slice(0, 7).map(day => ({
      date: day.date,
      maxTemp: Math.round(Math.max(...day.temps)),
      minTemp: Math.round(Math.min(...day.temps)),
      condition: day.conditions[0],
      icon: `https://openweathermap.org/img/wn/${day.icons[0]}@2x.png`,
      humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b) / day.humidity.length),
      windSpeed: Math.round(day.windSpeed.reduce((a: number, b: number) => a + b) / day.windSpeed.length),
      precipitation: Math.round(day.precipitation.reduce((a: number, b: number) => a + b) / day.precipitation.length)
    }));

    // Format hourly forecast (next 24 hours)
    const hourly = forecastData.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).getHours().toString(),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      precipitation: Math.round(item.pop * 100)
    }));

    return new Response(
      JSON.stringify({ current, forecast, hourly }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Weather error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

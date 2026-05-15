import axios from 'axios';
import type { WeatherData, WeatherToolInput } from '../types/weather';

const GEO_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function getWeatherOpenMeteo(input: WeatherToolInput): Promise<WeatherData> {
  try {
    const city = input.city?.trim();
    if (!city) {
      throw new Error('City is required.');
    }

    const geoResp = await axios.get(GEO_BASE_URL, {
      params: {
        name: city,
        count: 1
      }
    });

    const results = geoResp.data?.results;
    const first = Array.isArray(results) ? results[0] : undefined;

    if (!first || typeof first.latitude !== 'number' || typeof first.longitude !== 'number') {
      throw new Error(`City not found for '${city}'.`);
    }

    const latitude = first.latitude as number;
    const longitude = first.longitude as number;
    const country = (first.country as string) || '';

    const weatherResp = await axios.get(WEATHER_BASE_URL, {
      params: {
        latitude,
        longitude,
        current_weather: true,
        hourly: ['relativehumidity_2m', 'uv_index'],
        wind_speed_unit: 'ms'
      }
    });

    const current = weatherResp.data?.current_weather;
    const hourly = weatherResp.data?.hourly;

    const temperature = current?.temperature;
    const feelsLike = current?.apparent_temperature;
    const windSpeed = current?.windspeed;
    const weatherCode = current?.weathercode;

    const hourlyTimes: unknown[] = Array.isArray(hourly?.time) ? hourly.time : [];
    const humidityValues: unknown[] = Array.isArray(hourly?.relativehumidity_2m)
      ? hourly.relativehumidity_2m
      : [];
    const uvValues: unknown[] = Array.isArray(hourly?.uv_index) ? hourly.uv_index : [];

    // Use the current time index if possible; otherwise fall back to first element.
    const currentTime = current?.time;
    const timeIndex = hourlyTimes.findIndex((t) => t === currentTime);
    const idx = timeIndex >= 0 ? timeIndex : 0;

    const humidity = humidityValues[idx];
    const uvIndex = uvValues[idx];

    const description = `Weather code ${weatherCode}`;
    const icon = String(weatherCode ?? '');

    if (typeof temperature !== 'number') {
      throw new Error(`Weather data unavailable for '${city}'.`);
    }

    return {
      city,
      country,
      temperature,
      feelsLike: typeof feelsLike === 'number' ? feelsLike : temperature,
      humidity: typeof humidity === 'number' ? humidity : 0,
      windSpeed: typeof windSpeed === 'number' ? windSpeed : 0,
      description,
      icon,
      uvIndex: typeof uvIndex === 'number' ? uvIndex : 0,
      airQuality: null,
      timestamp: new Date(current?.time ?? Date.now())
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // Keep the "city not found" signal descriptive.
    if (/not found/i.test(message)) {
      throw new Error(`Open-Meteo error: ${message}`);
    }

    throw new Error(`Open-Meteo error: ${message}`);
  }
}


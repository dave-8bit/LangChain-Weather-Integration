 
import type { WeatherData } from '../types/weather';

export function formatTemperature(temp: number, units: string): string {
  const normalized = units.toLowerCase();

  switch (normalized) {
    case 'metric':
      return `${temp}°C`;
    case 'imperial':
      return `${temp}°F`;
    case 'standard':
      return `${temp}K`;
    default:
      return `${temp}°C`;
  }
}

export function formatWeatherReport(data: WeatherData): string {
  const airQuality = data.airQuality === null ? 'N/A' : String(data.airQuality);

  return [
    `Weather for ${data.city}, ${data.country}`,
    `Temperature: ${data.temperature}°C (${data.feelsLike}°C feels like)`,
    `Humidity: ${data.humidity}%`,

    `Wind Speed: ${data.windSpeed} m/s`,
    `Description: ${data.description}`,

    `UV Index: ${data.uvIndex}`,
    `Air Quality: ${airQuality}`
  ].join('\n');
}


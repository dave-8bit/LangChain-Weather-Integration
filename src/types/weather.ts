export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  uvIndex: number;
  airQuality: number | null;
  timestamp: Date;
}

export interface WeatherToolInput {
  city: string;
  units?: 'metric' | 'imperial' | 'standard';
}

export interface WeatherError {
  message: string;
  code: string;
  city: string;
}


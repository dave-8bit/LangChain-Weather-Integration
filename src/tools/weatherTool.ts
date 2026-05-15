import { Tool } from '@langchain/core/tools';

import { getWeatherOpenMeteo } from './openmeteo';
import { formatWeatherReport } from '../utils/formatter';
import type { WeatherToolInput } from '../types/weather';

export class WeatherTool extends Tool {
  name = 'weather';
  description =
    "Fetches real-time weather data for any city. Input should be a city name like 'London' or 'Lagos'. Returns temperature, humidity, wind speed, UV index and more.";

  async _call(input: string): Promise<string> {
    const city = input?.trim();

    if (!city) {
      return 'Unable to fetch weather: city name is required.';
    }

    const toolInput: WeatherToolInput = { city };

    try {
      const data = await getWeatherOpenMeteo(toolInput);
      return formatWeatherReport(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (/city not found/i.test(message)) {
        return `Unable to fetch weather: could not find the city '${city}'.`;
      }

      return `Unable to fetch weather right now. ${message}`;
    }
  }
}


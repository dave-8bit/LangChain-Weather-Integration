# LangChain Weather Integration

LangChain Weather Integration is a **LangChain Tool** that fetches **real-time weather** for any city using the **Open-Meteo API** (free, no API key needed).

## Features

- Real-time weather
- Temperature in **Celsius (°C)**
- Humidity
- Wind speed
- UV index
- Human-readable weather descriptions
- Works as a LangChain Tool (`WeatherTool`)

## Installation

```bash
npm install langchain-weather-integration
```

## Quick Start

```ts
import { WeatherTool } from 'langchain-weather-integration';

async function main() {
  const tool = new WeatherTool();
  const report = await tool.call('London');
  console.log(report);
}

main();
```

## Available Data

The tool returns a formatted multi-line weather report. Under the hood, the following fields are produced:

- `city: string`
- `country: string`
- `temperature: number` (°C)
- `feelsLike: number` (°C)
- `humidity: number` (%)
- `windSpeed: number` (m/s)
- `description: string` (human-readable)
- `icon: string`
- `uvIndex: number`
- `airQuality: number | null` (currently `null`)
- `timestamp: Date`

## Built With

- TypeScript
- Open-Meteo API
- LangChain

## License

MIT


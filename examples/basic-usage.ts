import { WeatherTool } from '../src/index';

async function main() {
  const tool = new WeatherTool();

  try {
    const london = await tool.call('London');
    console.log(london);

    const lagos = await tool.call('Lagos');
    console.log(lagos);
  } catch (err) {
    console.error(err);
  }
}

main();


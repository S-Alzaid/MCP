import { z } from "zod";

// Tool schemas
export const SearchWebSchema = z.object({
  query: z.string().describe("The search query to execute"),
  maxResults: z.number().optional().describe("Maximum number of results to return"),
});

export const GetWeatherSchema = z.object({
  location: z.string().describe("The location to get weather for"),
  units: z.enum(["celsius", "fahrenheit"]).optional().describe("Temperature units"),
});

export const CalculateSchema = z.object({
  expression: z.string().describe("Mathematical expression to evaluate"),
});

// Tool implementations
export async function handleSearchWeb(args: z.infer<typeof SearchWebSchema>) {
  const { query, maxResults = 5 } = args;
  
  console.log(`Searching for: ${query} (max results: ${maxResults})`);
  
  // Mock implementation - replace with actual web search logic
  return {
    content: [
      {
        type: "text" as const,
        text: `Search results for "${query}":\n\n1. Example result 1\n2. Example result 2\n3. Example result 3`,
      },
    ],
  };
}

export async function handleGetWeather(args: z.infer<typeof GetWeatherSchema>) {
  const { location, units = "celsius" } = args;
  
  console.log(`Getting weather for: ${location} (units: ${units})`);
  
  // Mock weather data - replace with actual weather API call
  return {
    content: [
      {
        type: "text" as const,
        text: `Weather for ${location}:\nTemperature: 22°${units === "celsius" ? "C" : "F"}\nCondition: Sunny\nHumidity: 65%`,
      },
    ],
  };
}

export async function handleCalculate(args: z.infer<typeof CalculateSchema>) {
  const { expression } = args;
  
  try {
    // Note: Using eval is generally not recommended for production
    // Consider using a safer math expression parser like mathjs
    const result = eval(expression);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `${expression} = ${result}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Invalid mathematical expression: ${expression}`);
  }
}

// Tool definitions for registration
export const tools = [
  {
    name: "search_web",
    description: "Search the web for information",
    inputSchema: SearchWebSchema,
  },
  {
    name: "get_weather",
    description: "Get current weather information for a location",
    inputSchema: GetWeatherSchema,
  },
  {
    name: "calculate",
    description: "Perform mathematical calculations",
    inputSchema: CalculateSchema,
  },
]; 
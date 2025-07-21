import { z } from "zod";

// Example of more advanced tool schemas
export const FileReadSchema = z.object({
  path: z.string().describe("Path to the file to read"),
  encoding: z.enum(["utf8", "base64"]).optional().describe("File encoding"),
});

export const FileWriteSchema = z.object({
  path: z.string().describe("Path to the file to write"),
  content: z.string().describe("Content to write to the file"),
  encoding: z.enum(["utf8", "base64"]).optional().describe("File encoding"),
});

export const HttpRequestSchema = z.object({
  url: z.string().describe("URL to make the request to"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]).describe("HTTP method"),
  headers: z.record(z.string()).optional().describe("HTTP headers"),
  body: z.string().optional().describe("Request body"),
});

export const DatabaseQuerySchema = z.object({
  query: z.string().describe("SQL query to execute"),
  database: z.string().describe("Database name"),
});

// Advanced tool implementations
export async function handleFileRead(args: z.infer<typeof FileReadSchema>) {
  const { path, encoding = "utf8" } = args;
  
  try {
    const fs = await import("fs/promises");
    const content = await fs.readFile(path, encoding);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `File content from ${path}:\n\n${content}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to read file ${path}: ${error}`);
  }
}

export async function handleFileWrite(args: z.infer<typeof FileWriteSchema>) {
  const { path, content, encoding = "utf8" } = args;
  
  try {
    const fs = await import("fs/promises");
    await fs.writeFile(path, content, encoding);
    
    return {
      content: [
        {
          type: "text" as const,
          text: `Successfully wrote content to ${path}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to write file ${path}: ${error}`);
  }
}

export async function handleHttpRequest(args: z.infer<typeof HttpRequestSchema>) {
  const { url, method, headers = {}, body } = args;
  
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    
    const responseText = await response.text();
    
    return {
      content: [
        {
          type: "text" as const,
          text: `HTTP ${method} ${url}\nStatus: ${response.status}\nResponse:\n\n${responseText}`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`HTTP request failed: ${error}`);
  }
}

export async function handleDatabaseQuery(args: z.infer<typeof DatabaseQuerySchema>) {
  const { query, database } = args;
  
  // This is a mock implementation - replace with actual database connection
  console.log(`Executing query on database ${database}: ${query}`);
  
  return {
    content: [
      {
        type: "text" as const,
        text: `Query executed on ${database}:\n${query}\n\nResult: Mock data returned`,
      },
    ],
  };
}

// Advanced tool definitions
export const advancedTools = [
  {
    name: "file_read",
    description: "Read content from a file",
    inputSchema: FileReadSchema,
  },
  {
    name: "file_write",
    description: "Write content to a file",
    inputSchema: FileWriteSchema,
  },
  {
    name: "http_request",
    description: "Make HTTP requests",
    inputSchema: HttpRequestSchema,
  },
  {
    name: "database_query",
    description: "Execute database queries",
    inputSchema: DatabaseQuerySchema,
  },
]; 
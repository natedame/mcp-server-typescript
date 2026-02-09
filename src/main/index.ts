#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DataForSEOClient, DataForSEOConfig } from '../core/client/dataforseo.client.js';
import { EnabledModulesSchema, isModuleEnabled, defaultEnabledModules } from '../core/config/modules.config.js';
import { BaseModule, ToolDefinition } from '../core/modules/base.module.js';
import { z } from 'zod';
import { ModuleLoaderService } from "../core/utils/module-loader.js";
import { initializeFieldConfiguration } from '../core/config/field-configuration.js';
import { name, version } from '../core/utils/version.js';
import { initMcpServer } from "./init-mcp-server.js";

// Initialize field configuration if provided
initializeFieldConfiguration();
console.error('Starting DataForSEO MCP Server...');
console.error(`Server name: ${name}, version: ${version}`);

// Support both DATAFORSEO_TOKEN (base64) and separate USERNAME/PASSWORD
let username = process.env.DATAFORSEO_USERNAME;
let password = process.env.DATAFORSEO_PASSWORD;

if (!username && !password && process.env.DATAFORSEO_TOKEN) {
  const decoded = atob(process.env.DATAFORSEO_TOKEN);
  const colonIndex = decoded.indexOf(':');
  if (colonIndex !== -1) {
    username = decoded.substring(0, colonIndex);
    password = decoded.substring(colonIndex + 1);
  }
}

const server = initMcpServer(username, password);

// Start the server
async function main() {
  const transport = new StdioServerTransport(); 
  console.error('Starting server');
  await server.connect(transport);
  console.error("DataForSEO MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

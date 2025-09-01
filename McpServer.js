#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import mongoose from "mongoose";
import TransactionsModel from "./models/TransactionsModel.js";
import connectDB from "./utils/dbConnect.js";
import dotenv from "dotenv";

dotenv.config();
// Create MCP Server instance
const server = new Server(
  {
    name: "expense-tracker",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "getAllTransactions",
        description: "Fetch all expenses from the database",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Maximum number of expenses to return (optional)",
            },
            sortBy: {
              type: "string",
              description: "Field to sort by (default: date)",
              enum: ["date", "amount", "category"],
            },
            sortOrder: {
              type: "string",
              description: "Sort order (default: desc)",
              enum: ["asc", "desc"],
            },
          },
        },
      },
      {
        name: "addTransaction",
        description: "Add a new transaction to the database",
        inputSchema: {
          type: "object",
          properties: {
            amount: {
              type: "number",
              description: "Amount of the Transaction",
            },
            txnType: {
              type: "string",
              description: "Type of Transaction i.e Income or Expense",
            },
            category: {
              type: "string",
              description: "Category of the Transaction",
            },
            description: {
              type: "string",
              description: "Description of the transaction",
            },
            date: {
              type: "string",
              description: "Date of the expense (ISO format)",
            },
          },
          required: ["amount", "txnType", "category", "description"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Ensure database connection
    await connectDB();

    switch (name) {
      case "getAllExpenses": {
        const { limit = 100, sortBy = "date", sortOrder = "desc" } = args || {};
        const sortDirection = sortOrder === "desc" ? -1 : 1;
        let query = TransactionsModel.find(
          {},
          { txnType: 1, amount: 1, Category: 1, description: 1, date: 1 }
        ).sort({ date: -1 });
        if (limit) {
          query = query.limit(limit);
        }
        const expenses = await query.exec();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  count: expenses.length,
                  expenses: expenses,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "addExpense": {
        const { amount, txnType, category, description, date } = args;

        if (!amount || !category || !description) {
          throw new McpError(
            ErrorCode.InvalidParams,
            "Missing required fields: amount, category, and description are required"
          );
        }

        const expenseData = {
          amount: parseFloat(amount),
          txnType,
          category,
          description,
          date: date ? new Date(date) : new Date(),
        };

        const newExpense = new TransactionsModel(expenseData);
        const savedExpense = await newExpense.save();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: "Expense added successfully",
                  expense: savedExpense,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`Tool execution error for ${name}:`, error);

    if (error instanceof McpError) {
      throw error;
    }

    throw new McpError(
      ErrorCode.InternalError,
      `Failed to execute tool ${name}: ${error.message}`
    );
  }
});

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Expense Tracker MCP Server running on stdio");
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

main();

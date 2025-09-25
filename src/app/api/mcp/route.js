import { randomUUID } from "node:crypto";
import { Server as McpServer } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
  isInitializeRequest,
} from "@modelcontextprotocol/sdk/types.js";
import TransactionsModel from "../../../../models/TransactionsModel";
import CategoriesModel from "../../../../models/CategoriesModel.js";
import { authenticate } from "./auth.js";
import connectDB from "../../../../utils/dbConnect";


// sessions: sessionId -> { transport, server, userId }
const sessions = new Map();

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers":
      "Content-Type, authorization, mcp-session-id, MCP-Session-Id",
    "Access-Control-Expose-Headers": "Mcp-Session-Id",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  };
}

function unauthorized(origin, bodyId = null) {
  return new Response(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32001, message: "Unauthorized" },
      id: bodyId,
    }),
    { status: 401, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
  );
}

export async function OPTIONS(req) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

// Build server bound to a fixed userId
function buildServerForUser(userId) {
  const server = new McpServer(
    { name: "expense-tracker", version: "2.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // same tool definitions as before
        {
          name: "getAllTransactions",
          description: "Fetch all expenses from the database for current user",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "addTransaction",
          description: "Add a new transaction for the current user",
          inputSchema: {
            type: "object",
            properties: {
              amount: { type: "number" },
              txnType: { type: "string" },
              category: { type: "string" },
              description: { type: "string" },
              date: { type: "string" },
            },
            required: ["amount", "txnType", "category", "description"],
          },
        },
        {
          name: "getAllCategories",
          description: "Fetch user's categories",
          inputSchema: { type: "object", properties: {} },
        },
        {
          name: "addCategory",
          description: "Add a new category for the current user",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string" },
              type: { type: "string" },
              budget: { type: "number" },
            },
            required: ["name", "type"],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      await connectDB();

      switch (name) {
        case "getAllTransactions": {
          const txns = await TransactionsModel.find(
            { userId }, // scope by user
            { txnType: 1, amount: 1, category: 1, description: 1, date: 1 }
          ).sort({ date: -1 });
          return { content: [{ type: "text", text: JSON.stringify({ success: true, count: txns.length, expenses: txns }, null, 2) }] };
        }
        case "addTransaction": {
          const { amount, txnType, category, description, date } = args || {};
          if (!amount || !category || !description) {
            throw new McpError(ErrorCode.InvalidParams, "Missing required fields: amount, category, description");
          }
          const saved = await new TransactionsModel({
            userId, // owner
            amount: parseFloat(amount),
            txnType,
            category,
            description,
            date: date ? new Date(date) : new Date(),
          }).save();
          return { content: [{ type: "text", text: JSON.stringify({ success: true, message: "Expense added", expense: saved }, null, 2) }] };
        }
        case "getAllCategories": {
          const cats = await CategoriesModel.find({ userId }).select("_id name type budget");
          return { content: [{ type: "text", text: JSON.stringify({ success: true, message: "Categories fetched", categories: cats }, null, 2) }] };
        }
        case "addCategory": {
          const { name, type, budget } = args || {};
          if (!name || !type) {
            throw new McpError(ErrorCode.InvalidParams, "Missing required fields: name and type");
          }
          const saved = await new CategoriesModel({ userId, name, type, budget }).save();
          return { content: [{ type: "text", text: JSON.stringify({ success: true, message: "Category added", category: saved }, null, 2) }] };
        }
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (err) {
      if (err instanceof McpError) throw err;
      throw new McpError(ErrorCode.InternalError, `Failed to execute tool ${name}: ${err?.message || "unknown error"}`);
    }
  });

  return server;
}

async function createSession(userId) {
  const sessionId = randomUUID();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => sessionId,
  });
  const server = buildServerForUser(userId);
  await server.connect(transport);
  transport.onclose = () => sessions.delete(sessionId);
  sessions.set(sessionId, { transport, server, userId });
  return { sessionId, transport };
}

function getSession(sessionId) {
  return sessionId ? sessions.get(sessionId) : undefined;
}

export async function POST(req) {
  const origin = req.headers.get("origin");
  const authn = await authenticate(req);
  let body = null;
  try { body = await req.json(); } catch {}

  // Require auth for all POSTs (including initialize)
  if (!authn) return unauthorized(origin, body?.id ?? null);

  const sessionId =
    req.headers.get("mcp-session-id") || req.headers.get("Mcp-Session-Id");

  if (!sessionId) {
    // initialize for this user
    if (body && isInitializeRequest(body)) {
      const { sessionId: newId, transport } = await createSession(authn.userId);
      const res = new Response(null, {
        headers: {
          ...corsHeaders(origin),
          "Mcp-Session-Id": newId,
          "Content-Type": "application/json",
        },
      });
      return transport.handleRequest(req, res, body);
    }
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "No session; send initialize first" },
        id: body?.id ?? null,
      }),
      { status: 400, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
    );
  }

  const ctx = getSession(sessionId);
  if (!ctx || ctx.userId !== authn.userId) {
    // prevent session fixation/cross-user access
    return unauthorized(origin, body?.id ?? null);
  }

  const res = new Response(null, {
    headers: {
      ...corsHeaders(origin),
      "Mcp-Session-Id": sessionId,
      "Content-Type": "application/json",
    },
  });
  return ctx.transport.handleRequest(req, res, body);
}

export async function GET(req) {
  const origin = req.headers.get("origin");
  const authn = await authenticate(req);
  if (!authn) return unauthorized(origin, null);

  const sessionId =
    req.headers.get("mcp-session-id") || req.headers.get("Mcp-Session-Id");
  const ctx = getSession(sessionId || undefined);
  if (!ctx || ctx.userId !== authn.userId) {
    return unauthorized(origin, null);
  }
  const res = new Response(null, {
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Mcp-Session-Id": sessionId,
    },
  });
  return ctx.transport.handleRequest(req, res);
}

export async function DELETE(req) {
  const origin = req.headers.get("origin");
  const authn = await authenticate(req);
  if (!authn) return unauthorized(origin, null);

  const sessionId =
    req.headers.get("mcp-session-id") || req.headers.get("Mcp-Session-Id");
  const ctx = getSession(sessionId || undefined);
  if (!ctx || ctx.userId !== authn.userId) {
    return unauthorized(origin, null);
  }
  sessions.delete(sessionId);
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

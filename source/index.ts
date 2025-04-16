import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import cors from "cors";

const server = new McpServer({
    name: "mcp_youtube",
    version: "1.0.0"
});

const app = express();
let transport: SSEServerTransport;

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        credentials: false
    })
);

/**
 * TOOLS DO MCP
 */

server.tool(
    "hellow",
    { name: z.string() },
    async ({ name }) => ({
        content: [
            {
                type: "text",
                text: `Olá ${name}, seja bem vindo ao servidor!`
            }
        ]
    })
);

/**
 * ROTAS DO EXPRESS
 */

app.get("/", (req, res) => {
    res.json({
        name: "MCP Youtube Server",
        version: "1.0.0",
        status: "running",
        endpoints: {
            "/": "Informações do servidor",
            "/sse": "Server Sent Events rota da conexão MCP",
            "/messages": "Rota POST das mensagens do servidor MCP"
        },
        tools: [
            {
                name: "hellow",
                description: "Retorna um seja bem vindo para o usuário"
            }
        ]
    });
});

app.get("/sse", async (req, res) => {
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3535;
app.listen(PORT, () => {
    console.log("MCP Youtube Server Rodando na porta " + PORT);
});
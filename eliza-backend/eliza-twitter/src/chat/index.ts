import { elizaLogger, settings } from "@elizaos/core";
import express from "express";
import { Router } from "express";


// Create Express router instead of directly using app
const router = Router();

async function handleUserInput(input, agentId) {
  if (!input) {
    return { error: "No input provided" };
  }

  try {
    const serverPort = parseInt(settings.SERVER_PORT || "3000");

    const response = await fetch(
      `http://localhost:${serverPort}/${agentId}/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          userId: "user",
          userName: "User",
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching response:", error);
    return { error: "Error fetching response" };
  }
}

export function startChat(characters) {
  // Create Express server
  const app = express();
  app.use(express.json());
  
  // Define the chat handler using router
  router.post('/chat', chatHandler);
  
  // Mount the router
  app.use('/', router);
  
  // Define chat handler function separately
  async function chatHandler(req, res) {
    try {
      const { text } = req.body;

      
      const prompt = text
      const agentId = characters[0]?.name ?? "Agent";
      const responseData = await handleUserInput(prompt, agentId);

      // Handle case where responseData might not be an array
      const responses = Array.isArray(responseData) ? responseData : [responseData];
      const texts = responses.map(m => (m?.text || "").toUpperCase());
      elizaLogger.info(`Received response from agent ${agentId}:`, texts.join("  ,  "));
           
      
      // Return the agent's response as JSON
      res.json({ 
        agent: agentId, 
        responses: Array.isArray(responseData) 
          ? responseData.map(message => message.text) 
          : [responseData.text || "No response"]
      });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
  // Function to start the server
  return function startServer(port = 4001) {
    return app.listen(port, () => {
      console.log(`Chat API server running on port ${port}`);
      console.log(`Send POST requests to http://localhost:${port}/chat with JSON body: { "marketName": "...", "options": [...], "deadline": "..." }`);
    });
  };
}
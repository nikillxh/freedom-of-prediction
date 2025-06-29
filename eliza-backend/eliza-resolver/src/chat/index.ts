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
    const serverPort = parseInt("3001");

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

    // Check if response is successful before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      elizaLogger.error(`Error from agent server: ${errorText}`);
      return { error: `Server error: ${response.status} - ${errorText || response.statusText}` };
    }

    // Try to parse JSON response
    try {
      const data = await response.json();
      return data;
    } catch (parseError) {
      const rawText = await response.text();
      elizaLogger.error(`Failed to parse JSON: ${parseError.message}. Raw response: ${rawText}`);
      return { text: rawText, error: "Invalid JSON response from server" };
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    return { error: `Error fetching response: ${error.message}` };
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
    const { marketName, options, deadline } = req.body;

    if (!marketName || !Array.isArray(options) || !deadline) {
      return res.status(400).json({
        error: "Missing required fields: marketName, options[], deadline"
      });
    }

    // Log available agents for debugging
    elizaLogger.info(`Available agents: ${JSON.stringify(characters.map(c => c.name))}`);
    
    // Use the first agent instead of the second
    const agentId = characters[0]?.name ?? "Agent";
    
    // Check if we have a valid agent
    if (!agentId || agentId === "Agent") {
      elizaLogger.error("No valid agent found in characters array");
      return res.status(500).json({
        error: "No agent available",
        characters: characters.length
      });
    }
    
    const prompt = `Market: ${marketName}. Options: ${options.join(", ")}. Deadline: ${deadline}.`;
    
    elizaLogger.info(`Sending request to agent "${agentId}" with prompt: "${prompt}"`);
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
  return function startServer(port = 4002) {
    return app.listen(port, () => {
      console.log(`Chat API server running on port ${port}`);
      console.log(`Send POST requests to http://localhost:${port}/chat with JSON body: { "marketName": "...", "options": [...], "deadline": "..." }`);
    });
  };
}
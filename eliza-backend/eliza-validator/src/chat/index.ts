import { elizaLogger, settings } from "@elizaos/core";
import express from "express";
import { Router } from "express";

// Create Express router
const router = Router();

async function handleUserInput(input, agentId) {
  if (!input) return { error: "No input provided" };

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
  const app = express();
  app.use(express.json());

  router.post("/chat", chatHandler);
  app.use("/", router);

  async function chatHandler(req, res) {
    try {
      const { marketName, options, deadline } = req.body;

      if (!marketName || !Array.isArray(options) || !deadline) {
        return res.status(400).json({
          error: "Missing required fields: marketName, options[], deadline",
        });
      }

      const optionsJoined = options.join(", ");
      const prompt = `Market: ${marketName}. Options: ${optionsJoined}. Deadline: ${deadline}.`;

      const agentId = characters[0]?.name ?? "Agent";
      const responseData = await handleUserInput(prompt, agentId);

      const responses = Array.isArray(responseData)
        ? responseData
        : [responseData];

      const texts = responses.map((m) => (m?.text || "").toUpperCase());
      const isValid = texts.some((text) => text.startsWith("VALID"));

      elizaLogger.info(`Agent ${agentId} response: ${texts.join(" | ")}`);
      elizaLogger.info(
        `Processed market: ${marketName}, options: ${optionsJoined}, deadline: ${deadline}. Valid: ${isValid}`
      );

      if (isValid) {
        
        const twitterText = `Processed market: ${marketName},\n options: ${optionsJoined},\n deadline: ${deadline}.`;

        elizaLogger.info("Extracted Twitter post:", twitterText);

        if (twitterText) {
          try {
            const twitterPort = 4001;
            const postResp = await fetch(
              `http://localhost:${twitterPort}/chat`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  marketName: marketName,
                  options: options,
                  deadline: deadline,
                  text: twitterText,
                  userId: "predictorx",
                  userName: "predictorx",
                }),
              }
            );

            const postResult = await postResp.json();
            elizaLogger.info("Forwarded post to xposter:", postResult);
          } catch (postError) {
            // elizaLogger.error("Error sending to xposter:", postError);
          }
        } else {
          elizaLogger.warn("VALID response received, but no Twitter post found.");
        }
      }

      res.json({
        agent: agentId,
        isValid: isValid,
        responses: responses.map((m) => m.text || "No response")
      });
      
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  return function startServer(port = 4000) {
    return app.listen(port, () => {
      console.log(`Chat API server running on port ${port}`);
      console.log(
        `POST to http://localhost:${port}/chat with JSON: { "marketName": "...", "options": [...], "deadline": "..." }`
      );
    });
  };
}

import fetch from "node-fetch";

async function sendToValidator(): Promise<void> {
  const markets = [
    {
      marketName: "Who will win the 2026 US Election?",
      options: ["Biden", "Trump", "Kennedy"],
      deadline: "820261104"
    },
    {
      marketName: "Which team will win the 2025 ICC World Cup?",
      options: ["India", "Australia", "England"],
      deadline: "720651015"
    },
    {
      marketName: "Who will not win the Ballon d'Or 2025?",
      options: ["Messi", "Ronaldo", "Mbappe"],
      deadline: "660251241"
    }
  ];

  for (const market of markets) {
    try {
      const res = await fetch("http://localhost:4000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(market)
      });

      const data = await res.json();
      console.log(`\nValidator Response for market: ${market.marketName}`);
      console.log(data);
    } catch (err) {
      console.error("Validator Agent Error:", err);
    }
  }
}

async function sendToResolver(): Promise<void> {
  const resolutions = [
    {
      marketName: "Who will win IPL 2026?",
      options: ["RCB", "MI", "CSK"],
      deadline: "47328957",
      userId: "predictorx",
      userName: "predictorx"
    },
    {
      marketName: "Who will win the 2028 US Presidential Election?",
      options: ["Joe Biden", "Donald Trump", "Robert F. Kennedy Jr."],
      deadline: "934763400",
      userId: "predictorx",
      userName: "predictorx"
    },
    {
      marketName: "Winner of Euro 2024?",
      options: ["France", "Spain", "Germany"],
      deadline: "634620034",
      userId: "predictorx",
      userName: "predictorx"
    }
  ];

  for (const resolution of resolutions) {
    try {
      const res = await fetch("http://localhost:4002/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resolution)
      });

      const data = await res.json();
      console.log(`\nResolver Response for market: ${resolution.marketName}`);
      console.log(data);
    } catch (err) {
      console.error("Resolver Agent Error:", err);
    }
  }
}

async function run(): Promise<void> {
  console.log("\n--- Sending to Validator Agent (4000) ---");
  await sendToValidator();

  console.log("\n--- Sending to Resolver Agent (4002) ---");
  await sendToResolver();
}

run();

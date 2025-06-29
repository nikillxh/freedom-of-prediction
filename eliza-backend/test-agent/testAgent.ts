import fetch from "node-fetch";

async function sendToValidator(): Promise<void> {
  try {
    const res = await fetch("http://localhost:4000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marketName: "Who will win the 2026 US Election?",
        options: ["Biden", "Trump", "Kennedy"],
        deadline: "2026-11-04"
      })
    });

    const data = await res.json();
    console.log("\nValidator Agent Response:");
    console.log(data);
  } catch (err) {
    console.error("Validator Agent Error:", err);
  }
}

async function sendToResolver(): Promise<void> {
  try {
    const res = await fetch("http://localhost:4002/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        marketName: "Who will win the 2024 US Presidential Election?",
        options: ["Joe Biden", "Donald Trump", "Robert F. Kennedy Jr."],
        deadline: "2024-11-05",
        text: "📊 New Market: Who will win the 2024 US Presidential Election?\nOptions: Joe Biden, Donald Trump, Robert F. Kennedy Jr.\nDeadline: 2024-11-05",
        userId: "predictorx",
        userName: "predictorx"
      })
    });

    const data = await res.json();
    console.log("\nResolver Agent Response:");
    console.log(data);
  } catch (err) {
    console.error("Resolver Agent Error:", err);
  }
}

async function run(): Promise<void> {
  console.log("\n--- Sending to Validator Agent (4000) ---");
  await sendToValidator();

  console.log("\n--- Sending to Resolver Agent (4002) ---");
  await sendToResolver();
}

run();


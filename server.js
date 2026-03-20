const express = require("express");
const app = express();

const GLOSSARY_URL =
  "https://raw.githubusercontent.com/mvictoriareggiardo-hue/nexhealth-glossary/refs/heads/main/NexHealth_Glossary.json";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/define", async (req, res) => {
  const input = (req.body.text || "").trim();

  if (!input) {
    return res.json({
      response_type: "ephemeral",
      text: "Please provide a term. Usage: `/define <term>`",
    });
  }

  try {
    const response = await fetch(GLOSSARY_URL);
    const glossary = await response.json();
    const inputLower = input.toLowerCase();

    // Exact match first
    let match = glossary.find((e) => e.term.toLowerCase() === inputLower);

    // Fuzzy fallback
    if (!match) {
      match = glossary.find(
        (e) =>
          inputLower.includes(e.term.toLowerCase()) ||
          e.term.toLowerCase().includes(inputLower)
      );
    }

    if (match) {
      return res.json({
        response_type: "ephemeral",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `📖 *${match.term}*${match.category ? `  |  _${match.category}_` : ""}\n${match.definition}`,
            },
          },
        ],
      });
    } else {
      return res.json({
        response_type: "ephemeral",
        text: `❓ *"${input}"* was not found in the NexHealth glossary.`,
      });
    }
  } catch (err) {
    return res.json({
      response_type: "ephemeral",
      text: "⚠️ Could not reach the glossary right now. Please try again later.",
    });
  }
});

app.get("/", (req, res) => res.send("NexHealth Glossary Bot is running ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

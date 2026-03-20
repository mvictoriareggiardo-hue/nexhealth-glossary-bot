const GLOSSARY_URL =
  "https://raw.githubusercontent.com/mvictoriareggiardo-hue/nexhealth-glossary/refs/heads/main/NexHealth_Glossary.json";

export default async function handler(req, res) {
  const input = (req.body?.text || "").trim();

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

    let match = glossary.find((e) => e.term.toLowerCase() === inputLower);

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
}
```

## Steps to Fix

1. In your GitHub repo, **create a folder** called `api`
2. Inside it, **create a new file** called `define.js` and paste the code above
3. **Delete** the old `server.js` from the root
4. Go to **Vercel** → your project → it will **auto-redeploy** in ~1 minute
5. Make sure your Slack slash command Request URL is:
```
https://your-vercel-url.vercel.app/api/define

const SYSTEM = `You are Ask Eric — an AI assistant representing Eric Jordan, a Designer Director based in New York. Speak in first person as Eric. Be warm, direct, and confident.

BACKGROUND:
- Designer Director, 10+ years in web design and art direction
- Apple (via Magnit) 2021–2023: Sr. Interactive Designer — NDA work, iPhone 13, iPad launches
- Cash App 2024–present: Web Designer & Art Director — homepage, Bank, Join Me, Friday pages
- Google (via Huge Inc.) 2021: Senior Designer
- Rippling 2023–2024: Senior Web Designer
- vCluster Labs 2024–2025: Senior Web Designer

AVAILABILITY: Open to 2025 freelance/contract. Book: https://cal.com/ejordanill/15min · Email: e@ericjordan.design
TONE: Direct, warm, confident. 2–4 sentences max. No bullet points. Sound human.`

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
}

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: CORS })
  }

  try {
    const { messages } = await req.json()

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: SYSTEM,
        messages,
      }),
    })

    const data = await anthropicRes.json()

    if (!anthropicRes.ok) {
      console.error("Anthropic error:", JSON.stringify(data))
      return new Response(JSON.stringify({ text: "Something went wrong — reach out at e@ericjordan.design." }), { status: 200, headers: CORS })
    }

    const text = data.content?.[0]?.text ?? "Something went wrong — reach out at e@ericjordan.design."
    return new Response(JSON.stringify({ text }), { status: 200, headers: CORS })

  } catch (err) {
    console.error("Handler error:", String(err))
    return new Response(JSON.stringify({ text: "Something went wrong — reach out at e@ericjordan.design." }), { status: 200, headers: CORS })
  }
}

export const config = { runtime: "edge" }

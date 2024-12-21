export default async function handler(req, res) {
    if (req.method === "POST") {
      const { prompt } = req.body;
  
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
  
      const apiKey = process.env.COHERE_API_KEY;
      const apiUrl = "https://api.cohere.ai/generate";
  
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            model: "command-xlarge-nightly",
            max_tokens: 50,
          }),
        });
  
        const data = await response.json();
  
        if (data.error) {
          return res.status(500).json({ error: data.error.message });
        }
  
        res.status(200).json({ generatedText: data.generations[0]?.text || "" });
      } catch (error) {
        console.error("Error calling Cohere API:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  
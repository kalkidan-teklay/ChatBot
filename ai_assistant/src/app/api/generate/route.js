export async function POST(req) {
    const { prompt } = await req.json();
  
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
      });
    }
  
    const apiKey = process.env.COHERE_API_KEY;
    const apiUrl = "https://api.cohere.ai/v1/generate";
  
    const payload = {
      model: "command-a-03-2025",
      prompt,
      max_tokens: 100,
      temperature: 0.7,
      k: 0,
      p: 1,
      stop_sequences: ["--END--"],
      return_likelihoods: "NONE",
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Cohere API Response:", data); 
  
      if (data.error) {
        return new Response(
          JSON.stringify({ error: data.error.message || "Unknown error" }),
          { status: 500 }
        );
      }
  
      const generatedText =
        data.generations?.[0]?.text || "No content generated.";
      return new Response(JSON.stringify({ generatedText }), { status: 200 });
    } catch (error) {
      console.error("Error calling Cohere API:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  }
  

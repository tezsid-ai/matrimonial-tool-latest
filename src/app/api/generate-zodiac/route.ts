import { NextRequest } from "next/server";

interface ZodiacRequest {
  cityOfBirth: string;
  timeOfBirth: string;
  dateOfBirth: string;
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  // Parse request body
  let body: ZodiacRequest;
  try {
    body = await request.json();
  } catch (err: any) {
    console.error("[generate-zodiac] Payload parsing error:", err);
    return Response.json({ error: true, message: "Invalid request payload" }, { status: 400 });
  }

  // If no API key, fail immediately
  if (!GEMINI_API_KEY) {
    console.error("[generate-zodiac] Error: GEMINI_API_KEY environment variable is not defined.");
    return Response.json({ error: true, message: "Gemini API key is not configured" }, { status: 500 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const prompt = `You are an astrology and personality profiler. Based on the following birth details, generate a personalized astrological profile in JSON format.

Birth Details:
- Date: ${body.dateOfBirth}
- City: ${body.cityOfBirth}
- Time: ${body.timeOfBirth}

Respond ONLY with a JSON object matching this exact structure:
{
  "sign": "string (zodiac sign name)",
  "element": "string (Fire, Earth, Air, or Water)",
  "traits": ["string", "string", "string", "string"],
  "compatibility": "string (relationship insight, 150-200 characters)",
  "advice": "string (guidance for their journey, 150-200 characters)"
}

Guidelines:
- Sign: The sun sign based on the birth date
- Element: The classical element associated with that sign
- Traits: 4 key personality characteristics
- Compatibility: How this sign typically approaches relationships
- Advice: Personalized guidance for their marriage readiness journey

Keep the tone warm, insightful, and encouraging.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[generate-zodiac] Google API Error (Status ${response.status}):`, errText);
      
      let clientMsg = `API responded with status ${response.status}`;
      try {
        const errObj = JSON.parse(errText);
        if (errObj.error?.message) {
          clientMsg = errObj.error.message;
        }
      } catch {}
      
      return Response.json({ error: true, message: clientMsg }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("[generate-zodiac] Error: No text content returned in candidates. Response data:", JSON.stringify(data));
      return Response.json({ error: true, message: "Empty response content from AI provider" }, { status: 500 });
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    
    let profile;
    try {
      profile = JSON.parse(jsonStr);
    } catch (err: any) {
      console.error("[generate-zodiac] Error: Failed to parse JSON from AI text response. Raw text:", text, err);
      return Response.json({ error: true, message: "AI response failed JSON structure requirements" }, { status: 500 });
    }

    // Validate required fields
    if (!profile.sign || !profile.element || !profile.traits || !profile.compatibility || !profile.advice) {
      console.error("[generate-zodiac] Error: Missing expected schema fields in parsed JSON:", profile);
      return Response.json({ error: true, message: "AI response missed required zodiac schema fields" }, { status: 500 });
    }

    return Response.json(profile);
  } catch (error: any) {
    console.error("[generate-zodiac] Catch block exception encountered:", error);
    return Response.json({ error: true, message: error?.message || "Internal server error during processing" }, { status: 500 });
  }
}

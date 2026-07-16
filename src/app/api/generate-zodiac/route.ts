import { NextRequest } from "next/server";
import { FALLBACK_ZODIAC } from "@/data/fallback-zodiac";

export const dynamic = "force-static";

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
  } catch {
    return Response.json(FALLBACK_ZODIAC);
  }

  // If no API key, return fallback immediately
  if (!GEMINI_API_KEY) {
    return Response.json(FALLBACK_ZODIAC);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
      return Response.json(FALLBACK_ZODIAC);
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return Response.json(FALLBACK_ZODIAC);
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    
    let profile;
    try {
      profile = JSON.parse(jsonStr);
    } catch {
      return Response.json(FALLBACK_ZODIAC);
    }

    // Validate required fields
    if (!profile.sign || !profile.element || !profile.traits || !profile.compatibility || !profile.advice) {
      return Response.json(FALLBACK_ZODIAC);
    }

    return Response.json(profile);
  } catch {
    // Any error returns fallback
    return Response.json(FALLBACK_ZODIAC);
  }
}

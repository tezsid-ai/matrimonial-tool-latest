import { NextRequest } from "next/server";
import { FALLBACK_INSIGHTS } from "@/data/fallback-insights";

export const dynamic = "force-static";

interface InsightsRequest {
  answers: Record<string, { value: string | string[] | number; touched: boolean }>;
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  // Parse request body
  let body: InsightsRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json(FALLBACK_INSIGHTS);
  }

  // If no API key, return fallback immediately
  if (!GEMINI_API_KEY) {
    return Response.json(FALLBACK_INSIGHTS);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const prompt = `You are a thoughtful marriage readiness counselor. Analyze the following reflection answers and provide personalized insights in JSON format.

Reflection Answers:
${JSON.stringify(body.answers, null, 2)}

Respond ONLY with a JSON object matching this exact structure:
{
  "strengths": ["string", "string", "string"],
  "growthAreas": ["string", "string", "string"],
  "discussionAreas": ["string", "string", "string"],
  "risks": {
    "level": "low" | "medium" | "high",
    "items": ["string"]
  },
  "recommendations": [
    { "text": "string", "checked": false },
    { "text": "string", "checked": false },
    { "text": "string", "checked": false },
    { "text": "string", "checked": false },
    { "text": "string", "checked": false }
  ]
}

Guidelines:
- Strengths: What the person does well in relationships
- GrowthAreas: Areas for improvement, framed positively
- DiscussionAreas: Topics they should discuss with their partner
- Risks: Any concerns (level: low/medium/high), with actionable items
- Recommendations: 5 specific, actionable next steps

Keep all text concise (under 100 characters per item) and supportive in tone.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return Response.json(FALLBACK_INSIGHTS);
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return Response.json(FALLBACK_INSIGHTS);
    }

    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    
    let insights;
    try {
      insights = JSON.parse(jsonStr);
    } catch {
      return Response.json(FALLBACK_INSIGHTS);
    }

    // Validate required fields
    if (!insights.strengths || !insights.growthAreas || !insights.discussionAreas || !insights.risks || !insights.recommendations) {
      return Response.json(FALLBACK_INSIGHTS);
    }

    // Ensure recommendations have checked property
    insights.recommendations = insights.recommendations.map((rec: { text: string; checked?: boolean }) => ({
      text: rec.text,
      checked: rec.checked ?? false,
    }));

    return Response.json(insights);
  } catch {
    // Any error returns fallback
    return Response.json(FALLBACK_INSIGHTS);
  }
}

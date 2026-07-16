import { NextRequest } from "next/server";

interface InsightsRequest {
  answers: Record<string, { value: string | string[] | number; touched: boolean }>;
}

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  // Parse request body
  let body: InsightsRequest;
  try {
    body = await request.json();
  } catch (err: any) {
    console.error("[generate-insights] Payload parsing error:", err);
    return Response.json({ error: true, message: "Invalid request payload" }, { status: 400 });
  }

  // If no API key, fail immediately
  if (!GEMINI_API_KEY) {
    console.error("[generate-insights] Error: GEMINI_API_KEY environment variable is not defined.");
    return Response.json({ error: true, message: "Gemini API key is not configured" }, { status: 500 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
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
      const errText = await response.text();
      console.error(`[generate-insights] Google API Error (Status ${response.status}):`, errText);
      
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
      console.error("[generate-insights] Error: No text content returned in candidates. Response data:", JSON.stringify(data));
      return Response.json({ error: true, message: "Empty response content from AI provider" }, { status: 500 });
    }

    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    
    let insights;
    try {
      insights = JSON.parse(jsonStr);
    } catch (err: any) {
      console.error("[generate-insights] Error: Failed to parse JSON from AI text response. Raw text:", text, err);
      return Response.json({ error: true, message: "AI response failed JSON structure requirements" }, { status: 500 });
    }

    // Validate required fields
    if (!insights.strengths || !insights.growthAreas || !insights.discussionAreas || !insights.risks || !insights.recommendations) {
      console.error("[generate-insights] Error: Missing expected schema fields in parsed JSON:", insights);
      return Response.json({ error: true, message: "AI response missed required insights schema fields" }, { status: 500 });
    }

    // Ensure recommendations have checked property
    insights.recommendations = insights.recommendations.map((rec: { text: string; checked?: boolean }) => ({
      text: rec.text,
      checked: rec.checked ?? false,
    }));

    return Response.json(insights);
  } catch (error: any) {
    console.error("[generate-insights] Catch block exception encountered:", error);
    return Response.json({ error: true, message: error?.message || "Internal server error during processing" }, { status: 500 });
  }
}

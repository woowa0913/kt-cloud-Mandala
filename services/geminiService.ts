import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not set in the environment variables.");
  }
  return new GoogleGenerativeAI(apiKey);
};

export const generateMandalaContent = async (
  goalText: string,
  type: 'sub-goal' | 'action-plan',
  contextGoal?: string
): Promise<string[]> => {
  // Define prompt components locally to reuse
  let taskDescription = "";
  if (type === 'sub-goal') {
    taskDescription = `
      The user has a Main Year Goal: "${goalText}".
      Generate exactly 8 key sub-areas or sub-goals required to achieve this.
      These will form the surrounding blocks of a Mandala chart.
      Strings must be very concise (under 15 characters).
    `;
  } else {
    taskDescription = `
      The user has a specific Sub-Goal: "${goalText}" (which supports the Main Goal: "${contextGoal}").
      Generate exactly 8 specific, concrete action plans.
      IMPORTANT: The list must include a mix of:
      - Daily habits (e.g. "Read 30m daily")
      - Monthly goals (e.g. "Read 1 book/mo")
      - Next Quarter goals
      - Year-end goals
      Keep them very concise (max 12 characters).
    `;
  }

  const prompt = `
    Context: You are a mentor for a new employee at 'kt cloud'.
    Tone: Encouraging, professional, growth-oriented.
    Constraint: Return ONLY a JSON object with a property "items" containing 8 strings.
    
    ${taskDescription}
  `;

  // Define schema
  const responseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      items: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING }
      }
    },
    required: ["items"]
  };

  try {
    const genAI = getClient();

    // Attempt 1: Try gemini-1.5-flash-001 (Specific version)
    // Alias 'gemini-1.5-flash' sometimes causes 404 in certain environments/SDK versions
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-001",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.7,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        const parsed = JSON.parse(text);
        if (parsed.items && Array.isArray(parsed.items)) return parsed.items.slice(0, 8);
      }
    } catch (primaryError: any) {
      // Only fallback if the error is 404 (Not Found) or 400 (Bad Request - unlikely for model name)
      if (primaryError.message && (primaryError.message.includes('404') || primaryError.message.includes('not found'))) {
        console.warn("Primary model (gemini-1.5-flash-001) not found, falling back to gemini-pro...");

        // Attempt 2: Fallback to gemini-pro (Stable 1.0)
        // gemini-pro often needs more prompt engineering for JSON as it doesn't strictly support responseSchema in all regions
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const fallbackResult = await fallbackModel.generateContent(prompt + "\n\nIMPORTANT: Output PURE JSON ONLY. No markdown, no blocks.");
        const fallbackResponse = await fallbackResult.response;
        const fallbackText = fallbackResponse.text();

        // Extract JSON from potential markdown blocks
        const jsonMatch = fallbackText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.items && Array.isArray(parsed.items)) return parsed.items.slice(0, 8);
        }
      } else {
        throw primaryError; // Re-throw other errors
      }
    }

    return [];

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

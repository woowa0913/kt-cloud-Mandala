import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not set in the environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMandalaContent = async (
  goalText: string, 
  type: 'sub-goal' | 'action-plan',
  contextGoal?: string
): Promise<string[]> => {
  try {
    const ai = getClient();
    
    // Wrapping in an object is often more stable for JSON mode than a top-level array
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        items: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    };

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

    // Add a timeout to prevent infinite loading state
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 15000)
    );

    const apiCall = ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const response = await Promise.race([apiCall, timeoutPromise]) as any;

    const text = response.text;
    if (!text) return [];

    const result = JSON.parse(text);
    if (result.items && Array.isArray(result.items)) {
      return result.items.slice(0, 8);
    }
    return [];

  } catch (error) {
    console.error("Error generating content:", error);
    // Return fallback strings so the UI doesn't break
    const fallback = type === 'sub-goal' ? "세부목표" : "실천계획";
    return Array(8).fill(fallback);
  }
};

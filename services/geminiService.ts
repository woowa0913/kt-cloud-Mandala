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
  try {
    const genAI = getClient();

    // Define the schema for structured JSON output
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

    // Initialize the model - gemini-1.5-flash is stable and fast
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    // Add a timeout to prevent infinite loading state
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out after 15 seconds")), 15000)
    );

    const apiCall = model.generateContent(prompt);

    const result = await Promise.race([apiCall, timeoutPromise]) as any;
    const response = await result.response;
    const text = response.text();

    if (!text) return [];

    const parsed = JSON.parse(text);
    if (parsed.items && Array.isArray(parsed.items)) {
      return parsed.items.slice(0, 8);
    }
    return [];

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not set in the environment variables.");
  }
  return new GoogleGenerativeAI(apiKey);
};

// Simple in-memory cache to reduce API calls
const cache = new Map<string, { data: string[], timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Mock data for quota exceeded scenarios
const getMockData = (type: 'sub-goal' | 'action-plan', goalText: string): string[] => {
  if (type === 'sub-goal') {
    return [
      '기술 역량 강화',
      '업무 프로세스 이해',
      '팀워크 향상',
      '자기계발',
      '네트워킹',
      '문제해결 능력',
      '커뮤니케이션',
      '리더십 기초'
    ];
  } else {
    return [
      '매일 30분 학습',
      '월 1회 세미나',
      '분기별 프로젝트',
      '주간 회고록',
      '멘토링 참여',
      '기술 블로그 작성',
      '온라인 강의',
      '연말 목표 달성'
    ];
  }
};

export const generateMandalaContent = async (
  goalText: string,
  type: 'sub-goal' | 'action-plan',
  contextGoal?: string
): Promise<string[]> => {
  // Check cache first
  const cacheKey = `${type}-${goalText}-${contextGoal || ''}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Returning cached result');
    return cached.data;
  }

  // Define prompt components
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

    // Try API call
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
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
        if (parsed.items && Array.isArray(parsed.items)) {
          const items = parsed.items.slice(0, 8);
          // Cache the result
          cache.set(cacheKey, { data: items, timestamp: Date.now() });
          return items;
        }
      }
    } catch (primaryError: any) {
      // Check if it's a quota error (429)
      if (primaryError.message && primaryError.message.includes('429')) {
        console.warn('API quota exceeded, using mock data');
        const mockData = getMockData(type, goalText);
        // Cache mock data with shorter duration
        cache.set(cacheKey, { data: mockData, timestamp: Date.now() });

        // Throw a user-friendly error
        throw new Error('AI 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.\n(임시 데이터가 표시됩니다)');
      }

      // Check for 404 errors
      if (primaryError.message && (primaryError.message.includes('404') || primaryError.message.includes('not found'))) {
        console.warn("Primary model not found, falling back...", primaryError);

        const fallbackModel = genAI.getGenerativeModel({
          model: "gemini-flash-latest",
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.7,
          }
        });
        const fallbackResult = await fallbackModel.generateContent(prompt);
        const fallbackResponse = await fallbackResult.response;
        const fallbackText = fallbackResponse.text();

        if (fallbackText) {
          const parsed = JSON.parse(fallbackText);
          if (parsed.items) {
            const items = parsed.items.slice(0, 8);
            cache.set(cacheKey, { data: items, timestamp: Date.now() });
            return items;
          }
        }
      } else {
        throw primaryError;
      }
    }

    return [];

  } catch (error: any) {
    console.error("Error generating content:", error);

    // If quota exceeded, return mock data instead of failing completely
    if (error.message && error.message.includes('429')) {
      return getMockData(type, goalText);
    }

    throw error;
  }
};

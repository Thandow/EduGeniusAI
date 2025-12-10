import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { GenerationParams, GeneratedContent, PerformanceMetrics, ContentTemplate, QuizData } from '../types';
import { TEMPLATES, GEMINI_MODEL, GEMINI_IMAGE_MODEL, COST_PER_1K_INPUT, COST_PER_1K_OUTPUT } from '../constants';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-types' });
  }

  async generateImage(topic: string, subject: string): Promise<string | undefined> {
    try {
        // Enhanced prompt for better educational visuals
        const prompt = `Create a high-quality, educational illustration or infographic for the topic: "${topic}" in the subject of "${subject}". The image should be clear, engaging, and suitable for a classroom setting. Avoid text if possible, focusing on visual representation.`;
        
        const response = await this.ai.models.generateContent({
            model: GEMINI_IMAGE_MODEL,
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9",
                    // imageSize is not supported for gemini-2.5-flash-image, removing it to prevent errors
                }
            }
        });

        // Find the image part
        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
             for (const part of parts) {
                if (part.inlineData) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        return undefined;
    } catch (e) {
        console.warn("Image generation failed", e);
        return undefined; // Fail silently for images, main content is priority
    }
  }

  async generateContent(params: GenerationParams, onProgress?: (stage: string) => void): Promise<GeneratedContent> {
    // 1. Input Validation
    if (!params.topic || params.topic.length > 200) {
        throw new Error("Invalid input: Topic must be between 1 and 200 characters.");
    }

    const startTime = performance.now();
    const templateConfig = TEMPLATES[params.template];
    
    // 2. Generate Text Content
    if (onProgress) onProgress("Drafting educational content...");
    
    const systemInstruction = templateConfig.systemPrompt;
    const userPrompt = templateConfig.userPromptTemplate(params);

    // Config options
    let config: any = {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
        maxOutputTokens: 4096, 
    };

    if (params.template === ContentTemplate.QUIZ) {
      config = {
        ...config,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
              },
            },
          },
        },
      };
    }

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: userPrompt,
        config: config
      });

      const text = response.text || "No content generated.";
      let quizData: QuizData | undefined;

      if (params.template === ContentTemplate.QUIZ) {
        try {
          quizData = JSON.parse(text) as QuizData;
        } catch (e) {
          console.warn("Failed to parse quiz JSON", e);
        }
      }

      // 3. Generate Image (Parallel or Sequential)
      if (onProgress) onProgress("Generating visual aids...");
      const imageUrl = await this.generateImage(params.topic, params.subject);

      const endTime = performance.now();
      const durationMs = endTime - startTime;

      
      // 4. Output Filtering / Validation (Basic check for refusal)
      const refusedPatterns = ["I cannot generate", "I am unable to", "against my policies"];
      if (refusedPatterns.some(p => text.toLowerCase().includes(p.toLowerCase()))) {
          throw new Error("Content generation refused by AI safety filters.");
      }

      const usage = response.usageMetadata;
      const inputTokens = usage?.promptTokenCount || 0;
      const outputTokens = usage?.candidatesTokenCount || 0;
      const totalTokens = usage?.totalTokenCount || 0;

      // Calculate estimated cost
      const estimatedCost = 
        (inputTokens / 1000) * COST_PER_1K_INPUT + 
        (outputTokens / 1000) * COST_PER_1K_OUTPUT;

      const metrics: PerformanceMetrics = {
        durationMs,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCost
      };

      return {
        id: crypto.randomUUID(),
        params,
        content: text,
        imageUrl,
        quizData,
        timestamp: Date.now(),
        metrics
      };

    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.message?.includes("429")) {
        errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
      } else if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
        errorMessage = "The content generation was blocked due to safety settings. Please modify your topic.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  }
}

export const geminiService = new GeminiService();
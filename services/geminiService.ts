import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

// Access the key from the environment variable (Vite style)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("⚠️ Gemini API Key is missing! Make sure you have VITE_GEMINI_API_KEY in your .env file.");
}

// Initialize the client only if the key exists to prevent immediate crash
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateQuizFromTopic = async (topic: string, videoUrl: string): Promise<QuizQuestion[]> => {
  if (!ai) {
      throw new Error("Gemini API Key is missing. Please check your app configuration.");
  }

  try {
    const prompt = `
      You are an educational expert. Create a multiple-choice quiz about the following topic found in a video.
      Video Topic/Description: "${topic}"
      Video URL context: "${videoUrl}"
      
      Generate exactly 5 questions.
      For each question, provide 4 options and the index of the correct answer (0-3).
      The difficulty should be moderate, testing understanding of the topic.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER }
            },
            required: ["question", "options", "correctAnswerIndex"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No data returned from AI");
    }
    
    const quizData = JSON.parse(text) as QuizQuestion[];
    return quizData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate quiz. Please try again.");
  }
};
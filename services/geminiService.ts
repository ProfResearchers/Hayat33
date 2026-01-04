import { GoogleGenAI, Type } from "@google/genai";
import { NutriScanResult } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the Hayat 33 persona
const SYSTEM_INSTRUCTION = `
You are "Hayat", an advanced AI health companion for the Hayat 33 application in Dubai.
Your goal is to extend the "Healthspan" of residents by encouraging natural movement and social connection (Moai).
You are aware of Dubai's extreme climate and suggest indoor alternatives (Malls, covered tracks) when it is hot.
You embody a "Futurism meets Biophilia" tone: encouraging, scientific yet warm, and culturally respectful of Dubai's diverse population.
You prioritize "Blue Zones" principles: Move Naturally, Right Tribe, Outlook, Eat Wisely.
Keep responses concise and actionable.
`;

export const getHealthCoaching = async (
  userMessage: string, 
  history: { role: string; parts: { text: string }[] }[]
) => {
  try {
    const model = 'gemini-3-flash-preview';
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history,
    });

    const response = await chat.sendMessage({
      message: userMessage,
    });

    return response.text || "I apologize, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the health network right now. Please try again later.";
  }
};

export const suggestIndoorRoutes = async (userLocation: string, timeOfDay: string) => {
  try {
    const prompt = `
      Suggest 3 indoor walking routes in or near ${userLocation} suitable for ${timeOfDay}.
      Focus on Dubai's major malls or indoor walkways (e.g., Dubai Mall, Mall of the Emirates, City Walk indoor parts).
      Return JSON data with the following structure:
      [
        {
          "name": "Name of the route",
          "location": "Venue Name",
          "distance": "Distance in km",
          "duration": "Duration in min",
          "crowdLevel": "Low/Moderate/High",
          "features": ["Air Conditioned", "Greenery", "Quiet"]
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              distance: { type: Type.STRING },
              duration: { type: Type.STRING },
              crowdLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
              features: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    });

    let text = response.text;
    if (!text) return [];

    // Clean any potential markdown code blocks if the model adds them despite MIME type
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Gemini Route Error:", error);
    // Fallback data
    return [
      {
        name: "Zabeel Extension Loop",
        location: "Dubai Mall",
        distance: "2.5 km",
        duration: "30 min",
        crowdLevel: "Moderate",
        features: ["Art Installations", "AC", "Spacious"]
      },
      {
        name: "Ski View Morning Walk",
        location: "Mall of the Emirates",
        distance: "1.8 km",
        duration: "25 min",
        crowdLevel: "Low",
        features: ["Snow Views", "Coffee Spots"]
      }
    ];
  }
};

export const analyzeFoodImage = async (base64Image: string): Promise<NutriScanResult | null> => {
  try {
    const prompt = `
      Analyze this food image for "Biological Aging Impact".
      
      Tasks:
      1. Identify the food.
      2. Estimate Glycemic Load (Low/Medium/High).
      3. Identify potential preservatives or inflammatory ingredients visible or typical for this food.
      4. Assign an "Aging Score" from 1 to 10 (1 = Anti-aging/Blue Zone Friendly, 10 = Pro-inflammatory/Aging Accelerator).
      5. SUGGESTION: Suggest a specific LOCAL alternative available in Dubai/UAE. Prefer organic, unprocessed options (e.g., Camel meat, Hammour, local dates, Emirates Bio Farm produce).

      Return strict JSON.
    `;

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            agingScore: { type: Type.INTEGER, description: "1 to 10 scale" },
            glycemicLoad: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            preservatives: { type: Type.ARRAY, items: { type: Type.STRING } },
            analysis: { type: Type.STRING, description: "Short explanation of the score" },
            suggestion: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING },
                location: { type: Type.STRING, description: "Example local market or farm in Dubai" }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    // Cleanup markdown if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as NutriScanResult;

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
};
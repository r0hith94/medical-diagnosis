import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export interface DiagnosisResult {
  disease: string;
  confidence: number;
  explanation: string;
  contributingSymptoms: { symptom: string; weight: number }[];
}

export interface RAGResult {
  description: string;
  causes: string;
  treatments: string[];
  precautions: string[];
}

export async function diagnoseSymptoms(symptoms: string): Promise<DiagnosisResult> {
  const prompt = `
    You are a medical diagnosis assistant. Analyze the following symptoms and provide a potential diagnosis.
    Symptoms: ${symptoms}

    Return the result in JSON format with the following structure:
    {
      "disease": "Name of the disease",
      "confidence": 0.0 to 1.0,
      "explanation": "Brief explanation in simple language",
      "contributingSymptoms": [
        { "symptom": "symptom name", "weight": 0.0 to 1.0 }
      ]
    }
    
    Disclaimer: This is for educational purposes only. Not a medical diagnosis.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getMedicalInfo(disease: string): Promise<RAGResult> {
  const prompt = `
    You are a medical knowledge assistant. Provide detailed information about the following disease.
    Disease: ${disease}

    Return the result in JSON format with the following structure:
    {
      "description": "Detailed description",
      "causes": "Common causes",
      "treatments": ["Treatment 1", "Treatment 2"],
      "precautions": ["Precaution 1", "Precaution 2"]
    }
    
    Disclaimer: This is for educational purposes only. Not a medical diagnosis.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

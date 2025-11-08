import { GoogleGenAI, Type } from "@google/genai";
import { Language } from '../types';

const prompts = {
  en: "Generate a single, common category name for a word association party game. The response must be in English. Examples: Countries, Animals, Professions, Car Brands.",
  pt: "Gere um único nome de categoria comum para um jogo de festa de associação de palavras. A resposta deve ser em Português. Exemplos: Países, Animais, Profissões, Marcas de Carros."
};

const fallbackThemes = {
  en: ["Fruits", "Vegetables", "Movies", "Superheroes", "Board Games"],
  pt: ["Frutas", "Legumes", "Filmes", "Super-heróis", "Jogos de Tabuleiro"]
}

export async function getGameTheme(lang: Language): Promise<string> {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using fallback theme.");
    return "Famous Cities";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompts[lang],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: {
              type: Type.STRING,
              description: "The name of the game category."
            }
          },
          required: ["theme"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result.theme;

  } catch (error) {
    console.error("Error fetching theme from Gemini API:", error);
    const themes = fallbackThemes[lang];
    return themes[Math.floor(Math.random() * themes.length)];
  }
}
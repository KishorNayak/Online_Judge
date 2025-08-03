const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getaireview = async (code) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `give me a review for the following code ${code}`,
  });
    console.log(response.text);
    return response.text;
};

module.exports = { getaireview };

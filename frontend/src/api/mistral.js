import axios from 'axios';

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_API_KEY = "MlQpO64ZF27xYuS5cs0YL4qbOfGubnlL"; // ⚠️ Move this to a secure backend

export const askMistral = async (messages) => {
  try {
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-medium", // 🔁 upgraded model
        messages,
        temperature: 0,          // 🔁 stable deterministic output
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const message = response.data?.choices?.[0]?.message || {
      role: "assistant",
      content: "AI didn't respond properly.",
    };

    // Optional: log full message
    console.log("AI RESPONSE:", message);

    return message;
  } catch (err) {
    console.error("Mistral API Error", err.response?.data || err.message);
    return {
      role: "assistant",
      content: "❌ AI error occurred. Please try again or adjust your prompt.",
    };
  }
};

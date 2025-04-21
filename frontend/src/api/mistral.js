import axios from 'axios';

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_API_KEY = "MlQpO64ZF27xYuS5cs0YL4qbOfGubnlL"; // Frontend me mat rakhna long-term ke liye

export const askMistral = async (messages) => {
  try {
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-small",
        messages: messages,
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

    return message;
  } catch (err) {
    console.error("Mistral API Error", err);
    return { role: "assistant", content: "Something went wrong with AI response." };
  }
};

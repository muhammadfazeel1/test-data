require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this matches your API key
});

const openai = new OpenAIApi(configuration);

const chatWithGPT = async (message) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4", // Use "gpt-3.5-turbo" if needed
      messages: [{ role: "user", content: message }],
    });

    // Extract the assistant's reply
    const reply = response.data.choices[0].message.content;
    console.log("ChatGPT Reply:", reply);
    return reply;
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    if (error.response) {
      console.error("Error Response:", error.response.data);
    }
    throw error;
  }
};

// Test the function
chatWithGPT("Hello! How do I fix 404 errors?")
  .then((reply) => console.log(reply))
  .catch((err) => console.error("Error:", err));

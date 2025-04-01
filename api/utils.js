import Groq from "groq-sdk";

const MODEL="llama-3.3-70b-versatile"

const groq = new Groq();

export async function getGroqChatCompletion (transcript, model=MODEL) {
  const systemPrompt = `
  You are an expert at formatting raw audio transcripts into well-structured WhatsApp messages. 

  Your task is to improve readability while maintaining the original intent of the message by following these guidelines:

  1. **Improve Readability:**  
     - Insert **two line breaks** (\`\\n\\n\`) between distinct sections to create a clear separation.
     - Use **punctuation** and adjust phrasing to make the message more natural.

  2. **Use Lists When Appropriate:**  
     - Convert **unordered information** into **bulleted lists (\`- Item\`)**.  
     - Convert **step-by-step instructions** into **numbered lists (\`1. Step\`)**.

  **Important:**  
  - Output **only** the formatted message without any extra explanations.  
  - Do not include phrases like "Here is the formatted message" or "Cleaned message:".
  `;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `
Here is the raw audio transcript:

\`\`\`
${transcript}
\`\`\`

Format it into a well-structured WhatsApp message following the guidelines.

Cleaned message:\n
`,
      },
    ],
    model: model
  });
  console.log('transcript', transcript)
  const text = response.choices[0]?.message?.content || "";
  console.log('text', text)
  return text;
};

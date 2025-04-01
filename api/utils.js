import Groq from "groq-sdk";

const MODEL="llama-3.3-70b-versatile"

const groq = new Groq();

export async function getGroqChatCompletion (transcript, model=MODEL) {
  const systemPrompt = `
You are an expert at formatting text into a well-structured WhatsApp message. 
Your task is to take raw audio transcripts and format them into clear, readable messages by:
- Adding **line breaks** for better readability.
- Using **bulleted lists** for unordered items.
- Using **numbered lists** for step-by-step instructions.
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
`,
      },
    ],
    model: model
  });

  const text = response.choices[0]?.message?.content || "";
  console.log('text', text)
  return text;
};

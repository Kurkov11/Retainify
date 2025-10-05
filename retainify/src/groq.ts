"use server";

import Groq from "groq-sdk";

const GROQ = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion({
  selectedFragment,
  bookContext,
}: {
  selectedFragment: string;
  bookContext: string;
}) {
  const response = await GROQ.chat.completions.create({
    model: "moonshotai/kimi-k2-instruct-0905",
    messages: [
      {
        role: "system",
        content:
          "Extract a quiz from a book fragment supported by given book context. Each answer should be max 45 characters.",
      },
      {
        role: "user",
        content: `
        selectedFragment: "${selectedFragment}",
        bookContext: "${bookContext}"
        `,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "book_quiz",
        schema: {
          type: "array",
          description: "5 Quizzes based on book fragment",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              possible_answers: {
                type: "array",
                items: { type: "string" },
              },
              correct_answer_index: { type: "number" },
            },
            additionalProperties: false,
            required: ["question", "possible_answers", "correct_answer_index"],
          },
        },
      },
    },
  });
  const result = JSON.parse(response.choices[0].message.content || "{}");
  console.log(result);
  return result;
}

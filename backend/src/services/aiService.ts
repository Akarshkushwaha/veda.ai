import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { IAssignment } from '../models/Assignment';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateQuestionPaper = async (assignment: IAssignment) => {
  const prompt = `
You are an expert teacher creating an assessment. Create a structured question paper based on the following parameters:
- Question Types: ${assignment.questionTypes.join(', ')}
- Total Questions: ${assignment.numberOfQuestions}
- Total Marks: ${assignment.totalMarks}
- Additional Instructions: ${assignment.instructions}

The output MUST be a valid JSON object matching the following structure exactly. Do not include any other text or markdown formatting outside the JSON object.

{
  "sections": [
    {
      "title": "Section Name (e.g., Section A - Multiple Choice)",
      "instruction": "Instructions for this section",
      "questions": [
        {
          "questionText": "The text of the question",
          "difficulty": "Easy", // Must be "Easy", "Moderate", or "Hard"
          "marks": 5 // Must be a number
        }
      ]
    }
  ]
}

Ensure the sum of all question marks equals exactly ${assignment.totalMarks}, and the total number of questions is exactly ${assignment.numberOfQuestions}.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from Groq API");
    }

    const parsedOutput = JSON.parse(responseContent);
    return parsedOutput;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

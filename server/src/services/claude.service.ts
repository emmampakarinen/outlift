import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN,
  baseURL: process.env.ANTHROPIC_BASE_URL,
});

type GenerateWorkoutInput = {
  location: {
    name: string;
    description?: string;
  };
  equipment: {
    name: string;
    type: string;
  }[];
  exercises: {
    name: string;
    id: number;
  }[];
  preferences: {
    duration: number;
    intensity: string;
    workoutType: string;
    muscleGroup: string;
  };
};

export async function generateWorkout(input: GenerateWorkoutInput) {
  const equipmentList = input.equipment
    .map((item) => `- ${item.name} (${item.type})`)
    .join("\n");

  const exerciseList = input.exercises
    .map((exercise) => `- ${exercise.id}: ${exercise.name}`)
    .join("\n");

  const prompt = `
    Create a workout for the following location.

    Location:
    ${input.location.name}

    Available equipment:
    ${equipmentList}

    Available exercises:
    ${exerciseList}

    User preferences:
    - Duration: ${input.preferences.duration} minutes
    - Intensity: ${input.preferences.intensity}
    - Workout type: ${input.preferences.workoutType}
    - Muscle group: ${input.preferences.muscleGroup}

    Rules:
    - Only use exercises from the available exercises list.
    - Only choose exercises that can be performed with the available equipment.
    - Return the exercise id for every selected exercise.
    - Return ONLY valid JSON.
    - Do not use markdown code fences.
    - Do not include any text outside the JSON.

    Return this structure:

    {
      "name": "string",
      "description": "string",
      "duration": 30,
      "exercises": [
        {
          "exerciseId": 1,
          "sets": 3,
          "reps": 10,
          "restSeconds": 60
        }
      ]
    }
    `;

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL!,
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");

  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude did not return text");
  }

  const cleanedText = textBlock.text
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleanedText);
}

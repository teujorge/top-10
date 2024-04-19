import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  // Extract the `messages` from the body of the request

  const { list, guess, category } = await req.json();

  const errMsg = "Required 'list' and 'guess' OR 'category'";

  if (!list && !guess && !category) {
    return new NextResponse("1" + errMsg, {
      status: 400,
    });
  }

  if (list && !guess) {
    return new NextResponse("2" + errMsg, {
      status: 400,
    });
  }

  if (!list && guess) {
    return new NextResponse("3" + errMsg, {
      status: 400,
    });
  }

  if (list && guess && category) {
    return new NextResponse("4" + errMsg, {
      status: 400,
    });
  }

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages:
      list && guess
        ? [
            {
              role: "system",
              content: `
        You are the game host. You will match the users response to the list of ${category} you will provide. The list will be the correct answers that users will have to guess. If the user is right enough (let's try to accept answers with typos) provide a response with "True". Else if the user is wrong provide a response with "False". Else the user input is not a real word, then respond with what you think they meant to type, a list of suggested words.
        
        Here is the json format i want:
        
        {
        correct : True | False | null
        suggestions : string[] | null
        }
        
        Only reply with a json response. The json should only include one non-null field.`,
            },
            {
              role: "system",
              content: `List:\n${list.join("\n")}`,
            },
            {
              role: "user",
              content: guess,
            },
          ]
        : [
            {
              role: "system",
              content: `
        You are the game host. To start the game, please create a list of 10 famous ${category} in the following json format: {list: string[]}`,
            },
          ],
    response_format: { type: "json_object" },
  });

  return new NextResponse(JSON.stringify(response), {
    status: 200,
  });
}


import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyCx84e6fnNvWjhL7E_GbJHOdUp8S0JTPwk";
const modelName = "imagen-3.0-generate-001";

async function test() {
    console.log("Testing API with model:", modelName);
    const ai = new GoogleGenAI({ apiKey });

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: {
                parts: [
                    {
                        text: "Generate a simple image of a cat.",
                    },
                ],
            },
        });

        console.log("Success!");
        console.log(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

test();

import { GoogleGenAI } from "@google/genai";

const summarize = async (req, res) => {;
    const ai = new GoogleGenAI({});
    const {text} = req.body;

    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: text,
    });

    res.json({
        summary: interaction.output_text
    });
}

export {summarize};
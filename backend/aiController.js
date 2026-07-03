import { GoogleGenAI } from "@google/genai";

const summarize = async (req, res) => {;
    const ai = new GoogleGenAI({});
    const {text, type, length} = req.body;
    const rules = `Only give an output, Do not include extra titles, labels, or questions.

                    Formatting Rules:

                    If the format is paragraphs: 
                    - Short = 1 paragraph (3-5 sentences)
                    - Medium = 1-2 paragraphs
                    - Long = 3-5 paragraphs. 

                    If the format is bullet points: 
                    - Short = 3-5 bullets
                    - Medium = 5-8 bullets
                    - Long = 10+ bullets`

    const prompt = rules + `Your task is to summarize the following text with these conditions: 

                    Format: ${type}
                    Length: ${length}

                    Here is the text: ${text}`

    try {
        const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
    });
    } catch (error) {
        return res.status(500).json({message: "AI is not working right now, try again later"})
    }

    res.json({
        summary: interaction.output_text
    });
}

export {summarize};
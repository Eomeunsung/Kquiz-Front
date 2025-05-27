import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}` });

export async function gemini(data) {
    try{
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: "문제 힌트만 알려주세요 문제 제목: "+data.title+", 지문: "+data.content+" 답은 알려주시면 안됩니다."
        });
        console.log("Ai 호출"+response.text);
        return response.text
    }catch (err){
        console.log("오류 "+err)
        throw err;
    }

}



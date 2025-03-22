import openai from "@/services/openai";
import db from "@/services/db";

export async function GET(req) {
    const vocabList = [];

    const vocabRef = db.collection('vocab-ai');
    // 使用 orderBy 方法，依照 createdAt 欄位降序排序
    const snapshot = await vocabRef.orderBy('createdAt', 'desc').get();
    
    snapshot.forEach(doc => {
        vocabList.push(doc.data());
    });

    return Response.json(vocabList);
}

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);

    // 分別取出body物件內的userInput 和 language
    const { userInput, language } = body;
    console.log("userInput:", userInput);
    console.log("language:", language);
    // TODO: 透過gpt-4o-mini模型讓AI回傳相關單字
    // 文件連結：https://platform.openai.com/docs/guides/text-generation/chat-completions-api?lang=node.js
    // JSON Mode: https://platform.openai.com/docs/guides/text-generation/json-mode?lang=node.js
    const systemPrompt = 
    `請作為一個單字聯想AI根據所提供的單字聯想5個相關單字
    例如：
    主題：水果
    語言：英文
    輸出JSON格式：
    {
        wordList: ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
        zhWordList: ["蘋果", "香蕉", "櫻桃", "棗子", "接骨木"],
    }`;
    const propmpt = `聯想主題：${userInput} 語言：${language}`;

    const openAIReqBody = {
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": propmpt }
        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" }
    };
    const completion = await openai.chat.completions.create(openAIReqBody);
    const payload = completion.choices[0].message.content;
    console.log("payload:", payload);

    const result = (
    {
        // 使用者輸入的主題
        title: userInput,
        // AI回傳的單字列表，使用JSON.parse()將字串轉為物件
        payload: JSON.parse(payload),
        // 使用者選擇的語言
        language: language,
        // 資料建立的時間戳記(毫秒)
        createdAt: Date.now()
    }

    );

    // 將資料存入Firebase
    await db.collection("vocab-ai").add(result);
    // 回傳給前端的資料
    return Response.json(result);
}
import openai from "@/services/openai";
import db from "@/services/db";

export async function GET(req) {
    const visionList = [];

    const visionRef = db.collection('vision-ai');
    // 使用 orderBy 方法，依照 createdAt 欄位降序排序
    const snapshot = await visionRef.orderBy('createdAt', 'desc').get();
    
    snapshot.forEach(doc => {
        visionList.push(doc.data());
    });

    return Response.json(visionList);
}

export async function POST(req) {
    const body = await req.json();
    // console.log("body:", body);
    const { base64 } = body;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    { 
                        type: "text", 
                        text: `請簡短分析這張圖片（不超過20個中文字）並用JSON格式回答，格式如下：
輸出JSON格式範例：
{
  aiText: 簡短的中文描述（20字內）,
  wordList: ["相關英文單字1", "相關英文單字2", "相關英文單字3", "相關英文單字4", "相關英文單字5"],
  zhWordList: ["單字1中文", "單字2中文", "單字3中文", "單字4中文", "單字5中文"]
}`
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: base64
                        }
                    }
                ],
            },
        ],
        max_tokens: 500,
        response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(response.choices[0].message.content);

    const result = {
        title: aiResponse.aiText,
        language: "English",
        createdAt: Date.now(),
        payload: {
            wordList: aiResponse.wordList,
            zhWordList: aiResponse.zhWordList
        }
    };

    // 儲存結果到 Firestore
    await db.collection("vision-ai").add(result);

    console.log("result:", result);

    return Response.json(result);
}
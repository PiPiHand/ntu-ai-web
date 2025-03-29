import openai from "@/services/openai";
import axios from "axios";
import db from "@/services/db";

export async function GET(req) {
    const cardList = [];

    // 從firesotre 撈取 image-ai 集合的資料 並將每筆資料加入 cardList 內 按照createAt 由大到小排序
    const snapshot = await db.collection("image-ai").orderBy("createdAt", "desc").get();
    snapshot.forEach(doc => {
        cardList.push(doc.data());
    });

    return Response.json(cardList);
}

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    const { userInput } = body;
    console.log("route userInput:", userInput);
    // 文件連結: https://platform.openai.com/docs/guides/images/usage

    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: userInput,
        n: 1,
        size: "1024x1024",
      });
      
      // 取得openai的圖片連結 這時的
      const openAIImageURL = response.data[0].url;
      console.log(openAIImageURL);

      // 將openai的圖片連結上傳到imgur
      const imgurResponse = await axios.post("https://api.imgur.com/3/image", {
        image: openAIImageURL,
        type: 'url',
      }, {
        headers: {
            'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`
        }
      });

      const imgurURL = imgurResponse.data.data.link;
      console.log("imgurURL:", imgurURL);
      

    const data = {
        imageURL:imgurURL,
        prompt: userInput,
        createdAt: new Date().getTime(),
    }

    // 將圖片生成結果加入到firestore的image-ai集合中
    db.collection("image-ai").add(data);

    //console.log("route data:", data);

    return Response.json(data);
}
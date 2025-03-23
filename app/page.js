"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import VocabGenResultCard from "@/components/VocabGenResultCard";
import VocabGenResultPlaceholder from "@/components/VocabGenResultPlaceholder";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("English");
  // 所有的單字生成結果清單 會動態更新的資料
  const [vocabList, setVocabList] = useState([]);
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);

  const languageList = ["English", "Japanese", "Korean", "Spanish", "French", "German", "Italia", "Norwegian", "Arabic"];

  // 在組件載入時獲取歷史資料
  useEffect(() => {
    // 設置載入狀態
    setIsWaiting(true);
    
    axios.get('/api/vocab-ai')
      .then(response => {
        console.log("成功獲取歷史資料:", response.data);
        // 將資料按照時間戳記排序（新的在前）
        const sortedList = response.data.sort((a, b) => b.createdAt - a.createdAt);
        setVocabList(sortedList);
      })
      .catch(error => {
        console.error("獲取歷史資料失敗:", error);
      })
      .finally(() => {
        setIsWaiting(false);
      });
  }, []); // 空依賴陣列表示只在組件首次載入時執行

  const submitHandler = (e) => {
    // 防止頁面跳轉 重整
    e.preventDefault();
    console.log("User Input: ", userInput);
    console.log("Language: ", language);
   // 作為準備傳遞給後端的資料 -> {} 物件 常用於傳地給後端資料的格式
    const body = { userInput, language };
    console.log("body:", body);
    // TODO: 將body POST到 /api/vocab-ai { userInput: "", language: "" }
    // 透過axious將body post 到 /api/vocab-ai
    // 屏使用then 以及 catch 的方式分別印出後端的回應

    setIsWaiting(true);
    axios.post('/api/vocab-ai', body)
      // 成功接收後端回應
      .then(response => {
        console.log("成功接收後端回應:", response.data);
        // 將新的單字卡加入 vocabList
        setVocabList(prevList => [response.data, ...prevList]);
        setIsWaiting(false);
      })
      // 接收錯誤後端回應
      .catch(error => {
        console.error("Error:", error);
        setIsWaiting(false);
      });
  }

  return (
    <>
      <CurrentFileIndicator filePath="/app/page.js" />
      <PageHeader title="AI單字卡產生器" icon={faEarthAmericas} />
      <section>
        <div className="container mx-auto">
          <form onSubmit={submitHandler}>
            <div className="flex">
              <div className="w-3/5 px-2">
                <input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  type="text"
                  className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                  placeholder="請輸入想樣學習的關鍵字"
                  required
                />
              </div>
              <div className="w-1/5 px-2">
                <select
                  className="border-2 w-full block p-3 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  {
                    languageList.map(language => <option key={language} value={language}>{language}</option>)
                  }
                </select>
              </div>
              <div className="w-1/5 px-2">
                <GeneratorButton />
              </div>
            </div>
          </form>
        </div>
      </section>
      <section>
        <div className="container mx-auto">
          {/* 等待後端回應時要顯示的載入畫面 */}
          {isWaiting ? <VocabGenResultPlaceholder /> : null}
          
          {/* 顯示所有單字卡 */}
          {vocabList.map((result, index) => (
            <VocabGenResultCard
              key={result.createdAt + index}
              result={result}
            />
          ))}
        </div>
      </section>
    </>
  );
}

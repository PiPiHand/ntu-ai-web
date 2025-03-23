"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import ImageGenCard from "@/components/ImageGenCard"; // 圖像產生器卡片
import ImageGenPlaceholder from "@/components/ImageGenPlaceholder"; // 圖像生成等待時間的卡片

export default function ImgGen() {
    const [userInput, setUserInput] = useState("");
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);

    // 所有的圖片生成結果清單
    const [cardList, setCardList] = useState([]);

    // 在組件載入時獲取歷史圖片資料
    useEffect(() => {
        setIsWaiting(true);
        
        axios.get('/api/image-ai')
            .then(response => {
                console.log("成功獲取歷史圖片:", response.data);
                setCardList(response.data);
            })
            .catch(error => {
                console.error("獲取歷史圖片失敗:", error);
            })
            .finally(() => {
                setIsWaiting(false);
            });
    }, []); // 空依賴陣列表示只在組件首次載入時執行

    const submitHandler = (e) => {
        e.preventDefault();
        //console.log("User Input: ", userInput);
        const body = { userInput };
        console.log("body:", body);
        // TODO: 將body POST到 /api/image-ai { userInput: "" }
        setIsWaiting(true);

        setUserInput("");

        axios.post("/api/image-ai", body)
            .then(response => {
                console.log("response:", response.data);
                // 將新生成的圖片加入到 cardList 的最前面
                setCardList(prevList => [response.data, ...prevList]);
                setIsWaiting(false);
            })
            .catch(error => {
                console.error("error:", error);
                alert("圖片生成失敗，請重新嘗試");
                setIsWaiting(false);
            });
    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/image-generator/page.js" />
            <PageHeader title="AI 圖像產生器" icon={faImage} />
            <section>
                <div className="container mx-auto">
                    <form onSubmit={submitHandler}>
                        <div className="flex">
                            <div className="w-4/5 px-2">
                                <input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    type="text"
                                    className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                                    placeholder="Enter a word or phrase"
                                    required
                                />
                            </div>
                            <div className="w-1/5 px-2">
                                <GeneratorButton />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section>
                <div className="container mx-auto grid grid-cols-4">
                    {isWaiting && <ImageGenPlaceholder />}   

                    {/* 渲染 cardList 中的所有圖片 */}
                    {cardList.map((card, index) => (
                        <ImageGenCard 
                            key={card.createdAt + index}
                            imageURL={card.imageURL}
                            prompt={card.prompt}
                            createdAt={card.createdAt}
                        />
                    ))}
                </div>
            </section>
        </>
    )
}
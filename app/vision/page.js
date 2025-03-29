"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import { faEye, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VocabGenResultCard from "@/components/VocabGenResultCard";

export default function Vision() {
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);
    // 儲存圖片的狀態
    const [image, setImage] = useState(null);
    // 儲存 AI 回應文字的狀態
    const [visionResult, setVisionResult] = useState(null);
    const [visionList, setVisionList] = useState([]);  // 新增歷史記錄狀態

    // 在組件載入時獲取歷史資料
    useEffect(() => {
        setIsWaiting(true);
        
        axios.get('/api/vision-ai')
            .then(response => {
                console.log("成功獲取歷史記錄:", response.data);
                setVisionList(response.data);
            })
            .catch(error => {
                console.error("獲取歷史記錄失敗:", error);
            })
            .finally(() => {
                setIsWaiting(false);
            });
    }, []); // 空依賴陣列表示只在組件首次載入時執行

    const changeHandler = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        if (!file) return;

        // 立即預覽圖片
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);

        // 建立FileReader實例
        const reader = new FileReader();
        
        reader.onloadend = () => {
            const base64String = reader.result;
            setIsWaiting(true);

            // 發送 base64 圖片到後端
            axios.post('/api/vision-ai', { base64: base64String })
                .then(response => {
                    console.log("AI 回應:", response.data);
                    setVisionResult(response.data);
                    // 將新結果加入歷史記錄列表
                    setVisionList(prevList => [response.data, ...prevList]);
                    setIsWaiting(false);
                })
                .catch(error => {
                    console.error("Error:", error);
                    setIsWaiting(false);
                });
        };

        reader.readAsDataURL(file);
    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/vision/page.js" />
            <PageHeader title="AI Vision" icon={faEye} />
            <section>
                <div className="container mx-auto">
                    <label htmlFor="imageUploader" 
                           className="inline-block bg-yellow-200 p-2 rounded-md hover:bg-yellow-300 cursor-pointer"
                    >
                        Upload Image
                    </label>
                    <input
                        className="hidden"
                        id="imageUploader"
                        type="file"
                        onChange={changeHandler}
                        accept=".jpg, .jpeg, .png"
                    />

                    {/* 圖片預覽區域 */}
                    {image && (
                        <div className="mt-4 relative">
                            <img 
                                src={image} 
                                alt="Preview" 
                                className="max-w-md rounded-lg shadow-lg"
                            />
                            {/* 載入動畫覆蓋在圖片上 */}
                            {isWaiting && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                    <FontAwesomeIcon 
                                        icon={faSpinner} 
                                        className="text-4xl text-white animate-spin" 
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* 顯示所有結果（包含最新產生的和歷史記錄） */}
                    <div className="mt-8">
                        {visionList.map((result, index) => (
                            <div key={result.createdAt + index} className="mb-4">
                                <VocabGenResultCard result={result} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
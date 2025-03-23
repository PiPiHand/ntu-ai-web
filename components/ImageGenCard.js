import Image from "next/image";

export default function ImageGenCard({ imageURL, prompt, createdAt }) {
    // 格式化時間
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/\//g, '年').replace(/,/, '日');
    }

    return (
        <div className="shadow-sm rounded-md overflow-hidden bg-white">
            <img
                src={imageURL}
                alt={prompt}
                width={1024}
                height={1024}
                className="w-full"
            />
            <div className="p-3">
                <h3 className="text-md">{prompt}</h3>
                <p className="text-slate-400 text-sm mt-2">{formatDate(createdAt)}</p>
            </div>
        </div>
    )
}
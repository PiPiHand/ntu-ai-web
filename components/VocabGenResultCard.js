import moment from 'moment';
import { faCommentDots, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function VocabGenResultCard({ result, setUserInput, onCopySuccess }) {
    const { wordList, zhWordList } = result.payload;
    
    const handleCopy = (zhWord) => {
        setUserInput(zhWord);
        onCopySuccess(zhWord);
    };

    const wordItems = wordList.map((word, idx) => {
        return (
            // 這是一個單字卡
            <div className="p-3 border-2 border-slate-300 rounded-md" key={idx}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-700">{word}</h3>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-orange-100 rounded-md transition-colors">
                            <FontAwesomeIcon icon={faCommentDots} className="text-orange-500" />
                        </button>
                        <button 
                            onClick={() => handleCopy(zhWordList[idx])}
                            className="w-8 h-8 flex items-center justify-center hover:bg-orange-100 rounded-md transition-colors"
                            title="複製到輸入框"
                        >
                            <FontAwesomeIcon icon={faCopy} className="text-orange-500" />
                        </button>
                    </div>
                </div>
                <p className="text-slate-400 mt-3">{zhWordList[idx]}</p>
            </div>
        )
    })
    return (
        <div className="bg-white shadow-sm p-4 rounded-xl my-3">
            <h3 className="text-lg">
                {result.title} <span className="py-2 px-4 bg-slate-200 font-semibold rounded-lg inline-block ml-2">{result.language}</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                {wordItems}
            </div>
            <p className="mt-3 text-right text-slate-500">
                Created At: {moment(result.createdAt).format("YYYY/MMM/DD")}
            </p>
        </div>
    )
}
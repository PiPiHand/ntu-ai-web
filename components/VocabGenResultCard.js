import moment from 'moment';
import { useState } from 'react';
import axios from 'axios';
import { faCommentDots, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function VocabGenResultCard({ result, setUserInput, onCopySuccess }) {
    const { wordList, zhWordList } = result.payload;
    const [sentences, setSentences] = useState({});
    const [loadingSentence, setLoadingSentence] = useState({});

    const handleCopy = (zhWord) => {
        setUserInput(zhWord);
        onCopySuccess(zhWord);
    };

    const handleGenerateSentence = async (word, idx) => {
        setLoadingSentence(prev => ({ ...prev, [idx]: true }));
        try {
            const response = await axios.post('/api/sentence-ai', {
                word,
                zhWord: zhWordList[idx],
                language: result.language
            });
            setSentences(prev => ({
                ...prev,
                [idx]: {
                    ...response.data,
                    zhWord: zhWordList[idx]
                }
            }));
        } catch (error) {
            console.error('Error generating sentence:', error);
        }
        setLoadingSentence(prev => ({ ...prev, [idx]: false }));
    };

    const wordItems = wordList.map((word, idx) => {
        return (
            // 這是一個單字卡
            <div className="p-3 border-2 border-slate-300 rounded-md" key={idx}>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-700">{word}</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleGenerateSentence(word, idx)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-orange-100 rounded-md transition-colors"
                            disabled={loadingSentence[idx]}
                            title={`產生 "${zhWordList[idx]}" 的例句`}
                        >
                            <FontAwesomeIcon 
                                icon={faCommentDots} 
                                className={`text-orange-500 ${loadingSentence[idx] ? 'animate-pulse' : ''}`} 
                            />
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
                {sentences[idx] && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                        <p className="text-orange-700">{sentences[idx].sentence}</p>
                        <p className="text-orange-500 mt-2">{sentences[idx].translation}</p>
                    </div>
                )}
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
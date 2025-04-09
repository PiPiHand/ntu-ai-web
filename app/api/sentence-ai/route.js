import openai from '@/services/openai';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { word, zhWord, language } = body;

        console.log(`Generating sentence for word: ${word} (${zhWord}) in ${language}`);

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a helpful language teacher. Create one example sentence using the given word in the specified language. The sentence should accurately reflect the Chinese meaning provided and be natural in daily conversation.`
                },
                {
                    role: "user",
                    content: `Create one example sentence using the word "${word}" (meaning in Chinese: "${zhWord}") in ${language}. Make sure the sentence reflects the specific Chinese meaning provided. Also provide the translation in Traditional Chinese.
                    
Requirements:
1. The sentence must use the word "${word}" in a way that matches its Chinese meaning "${zhWord}"
2. The sentence should be natural and commonly used
3. Format the response as JSON with "sentence" and "translation" fields`
                }
            ],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);
        
        return NextResponse.json({
            ...result,
            originalWord: word,
            zhWord: zhWord
        });
    } catch (error) {
        console.error('Error generating sentence:', error);
        return NextResponse.json(
            { error: 'Failed to generate sentence' },
            { status: 500 }
        );
    }
}



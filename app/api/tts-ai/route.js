import openai from '@/services/openai';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { text, language } = body;

        const mp3Response = await openai.audio.speech.create({
            model: "tts-1",
            voice: "ash",
            input: text,
        });

        // 將 mp3 轉換為 base64
        const buffer = Buffer.from(await mp3Response.arrayBuffer());
        const base64Audio = buffer.toString('base64');

        return NextResponse.json({
            audioContent: base64Audio
        });
    } catch (error) {
        console.error('Error generating speech:', error);
        return NextResponse.json(
            { error: 'Failed to generate speech' },
            { status: 500 }
        );
    }
} 
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = `You are Sarah, an expert AI Lead Concierge for Clovrr Software. Your goal is to answer basic questions and encourage the prospect to book a demo. 
CORE RULES:
1. Keep it extremely brief (under 160 characters).
2. Be highly conversational, do not sound like a bot.
3. If they show interest, offer the booking link: clovrr.com/demo`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }]
    });

    return NextResponse.json({ text: result.response.text().trim() });
  } catch (error: any) {
    console.error('Demo Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

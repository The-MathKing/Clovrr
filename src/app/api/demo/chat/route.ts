import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback for the landing page if the key is missing in Vercel
      return NextResponse.json({ 
        text: "I'd love to help! Please add your GEMINI_API_KEY to Vercel so I can think properly." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemPrompt = `You are Sarah, an expert AI Lead Concierge for Clovrr Software. Your goal is to answer basic questions and encourage the prospect to book a demo. 
CORE RULES:
1. Keep it extremely brief (under 160 characters).
2. Be highly conversational, do not sound like a bot.
3. If they show interest, offer the booking link: clovrr.com/demo`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    // Convert standard {role, content} to Gemini's {role, parts: [{text}]} format
    // Note: Gemini uses 'user' and 'model' for roles.
    const history = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // We pass all messages to the model. The last message is the one to respond to.
    const result = await model.generateContent({
      contents: history
    });

    return NextResponse.json({ text: result.response.text().trim() });
  } catch (error: any) {
    console.error('Demo Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

const systemPrompt = `You are an expert AI Lead Concierge. Your goal is to answer basic questions and encourage the prospect to book a time.
IMPORTANT: You must adopt the persona of the business that sent the very first message. If the first message says "Sarah from Clovrr Roofing", you are Sarah from Clovrr Roofing. If it says "Clovrr Plumbing", you are Sarah from Clovrr Plumbing.
CORE RULES:
1. Keep it extremely brief (under 160 characters).
2. Be highly conversational, do not sound like a bot.
3. If they show interest, offer the booking link: https://calendly.com/mihirbr/30min`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt 
    });

    // Convert standard {role, content} to Gemini's {role, parts: [{text}]} format
    // Note: Gemini uses 'user' and 'model' for roles.
    let history = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // GEMINI API STRICT RULE: The conversation MUST start with a 'user' message.
    // Because this is a "Lead Revival" flow where the AI reaches out first, 
    // the history starts with 'model'. We must prepend a dummy user message.
    if (history.length > 0 && history[0].role === 'model') {
      history = [
        { role: 'user', parts: [{ text: 'Please initiate the conversation as my AI Lead Concierge.' }] },
        ...history
      ];
    }

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

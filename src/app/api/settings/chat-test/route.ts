import { createClient } from '@/utils/supabase/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();

    // Fetch client to get their custom system prompt and calendly link
    const { data: client } = await supabase
      .from('clients')
      .select('name, system_prompt, calendly_link')
      .eq('email', user.email)
      .single();

    if (!client) {
      return new Response('Client not found', { status: 404 });
    }

    const baseSystemPrompt = client.system_prompt || `You are an expert AI Lead Concierge for ${client.name}. Your objective is to help the user and encourage them to book a time.`;
    
    const systemPrompt = `${baseSystemPrompt}

### CONTEXT FOR THIS CONVERSATION:
- Prospect Name: Tester
- Original Inquiry/Context: Testing the AI Persona from the dashboard

### CORE BEHAVIOR RULES:
1. BREVITY IS KING: People read texts on the move. Keep every single response under 160 characters (1-2 sentences maximum). Do not write blocks of text.
2. NATURAL & TONED-DOWN: Do not sound like a marketing bot.
3. BOOKING: Always use this exact link when offering to book: ${client.calendly_link || 'our booking calendar'}
`;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat Test API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

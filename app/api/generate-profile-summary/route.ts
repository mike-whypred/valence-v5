import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { profileId, profileData } = await request.json();

    // Generate a comprehensive summary prompt
    const prompt = `
Create a professional networking summary for the following profile. Focus on:
- Professional background and expertise
- Career interests and goals
- Networking objectives
- Key skills and experience

Profile Details:
- Name: ${profileData.first_name} ${profileData.last_name}
- Job Title: ${profileData.job_title}
- Company: ${profileData.company}
- Industry: ${profileData.industry}
- Experience: ${profileData.experience_years} years
- Skills: ${profileData.skills.join(', ')}
- Bio: ${profileData.bio}
- Networking Goals: ${profileData.networking_goals}

Create a concise but comprehensive summary (150-200 words) that would help match this person with relevant networking opportunities and like-minded professionals.
`;

    // Generate summary with GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert professional networking advisor. Create engaging, professional summaries that highlight key networking compatibility factors."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const summaryText = completion.choices[0]?.message?.content || '';

    // Generate embedding for the summary
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: summaryText,
    });

    const embedding = embeddingResponse.data[0]?.embedding;

    if (!embedding) {
      throw new Error('Failed to generate embedding');
    }

    // Save to database
    const { data, error } = await supabase
      .from('profile_summaries')
      .insert([
        {
          profile_id: profileId,
          summary_text: summaryText,
          embedding: embedding,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to save profile summary' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      summary: summaryText,
      profileSummaryId: data.id 
    });

  } catch (error) {
    console.error('Error generating profile summary:', error);
    return NextResponse.json({ 
      error: 'Failed to generate profile summary' 
    }, { status: 500 });
  }
} 
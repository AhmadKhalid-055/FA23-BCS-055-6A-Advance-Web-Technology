import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { serverError } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  try {
    // Get all active questions
    const { data: questions, error } = await supabaseAdmin
      .from('learning_questions')
      .select('*')
      .eq('is_active', true);

    if (error || !questions || questions.length === 0) {
      return serverError('No questions available');
    }

    // Get random question
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];

    return NextResponse.json({
      success: true,
      data: randomQuestion,
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    return serverError('Failed to fetch question');
  }
}

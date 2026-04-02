import { NextRequest, NextResponse } from 'next/server';
import { verifyCronSecret, badRequest, serverError } from '@/lib/middleware';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    if (!verifyCronSecret(req)) {
      return badRequest('Invalid cron secret');
    }

    const startTime = Date.now();

    // Simple health check - count users
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count(*)', { count: 'exact' });

    const respondTime = Date.now() - startTime;
    const status = error ? 'down' : 'healthy';

    // Log health check
    const { error: logError } = await supabaseAdmin
      .from('system_health_logs')
      .insert([
        {
          source: 'database',
          response_ms: respondTime,
          checked_at: new Date().toISOString(),
          status,
          error_message: error?.message || null,
        },
      ]);

    if (logError) {
      console.warn('Failed to log health check:', logError);
    }

    return NextResponse.json({
      success: true,
      data: {
        status,
        response_ms: respondTime,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in health check:', error);
    return serverError('Health check failed');
  }
}

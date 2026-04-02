import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  // Get actual columns from information_schema
  const { data: columns, error: colError } = await supabaseAdmin
    .from('information_schema.columns' as any)
    .select('column_name, is_nullable, column_default, data_type')
    .eq('table_name', 'ads')
    .eq('table_schema', 'public');

  // Also try a direct insert to see the real error
  const { error: insertError } = await supabaseAdmin.from('ads').insert({
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'test ad title',
    description: 'test description',
    slug: 'test-ad-title',
    category_id: '00000000-0000-0000-0000-000000000001',
    city_id: '00000000-0000-0000-0000-000000000001',
    status: 'submitted'
  });

  return NextResponse.json({
    columns: columns || colError?.message,
    insertError: insertError ? {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint
    } : 'No error'
  });
}

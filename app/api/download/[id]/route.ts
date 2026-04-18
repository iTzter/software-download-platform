import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = createServiceClient();

  const { data: software } = await supabase
    .from('software')
    .select('id, download_url, download_count')
    .eq('id', id)
    .single();

  if (!software) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }

  await supabase
    .from('software')
    .update({ download_count: software.download_count + 1 })
    .eq('id', id);

  return NextResponse.redirect(software.download_url, 302);
}

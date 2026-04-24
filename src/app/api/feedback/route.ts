import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ error: 'empty' }, { status: 400 })

  const session = await getServerSession()

  await supabase.from('feedback').insert({
    text: text.trim(),
    user_name: session?.user?.name ?? '익명',
    email: session?.user?.email ?? null,
  })

  return NextResponse.json({ ok: true })
}

export async function GET() {
  const session = await getServerSession()
  const adminEmail = process.env.ADMIN_EMAIL

  if (!session?.user?.email || session.user.email !== adminEmail) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { data } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}

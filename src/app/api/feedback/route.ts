import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'feedback.json')

function readFeedback() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ error: 'empty' }, { status: 400 })

  const session = await getServerSession()

  const entry = {
    id: Date.now(),
    text: text.trim(),
    user: session?.user?.name ?? '익명',
    email: session?.user?.email ?? null,
    createdAt: new Date().toISOString(),
  }

  const list = readFeedback()
  list.unshift(entry)
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2))

  return NextResponse.json({ ok: true })
}

export async function GET() {
  const session = await getServerSession()
  const adminEmail = process.env.ADMIN_EMAIL

  if (!session?.user?.email || session.user.email !== adminEmail) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  return NextResponse.json(readFeedback())
}

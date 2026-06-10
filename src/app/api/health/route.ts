import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // If no Supabase config, immediately mark as offline
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ online: false, usingLocalDb: true })
  }

  try {
    // Try a simple fetch to the Supabase URL
    const res = await fetch(supabaseUrl, { method: 'GET', cache: 'no-store' })
    if (!res.ok) {
      return NextResponse.json({ online: false, usingLocalDb: true })
    }
    return NextResponse.json({ online: true, usingLocalDb: false })
  } catch (err) {
    return NextResponse.json({ online: false, usingLocalDb: true })
  }
}

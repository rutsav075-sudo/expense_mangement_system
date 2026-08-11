import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET /api/transactions — List all transactions for the logged in user
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('userId', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase GET error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (e: any) {
    console.error('Transactions GET error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST /api/transactions — Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields (userId is no longer required in body since we get it from auth)
    const required = ['amount', 'category', 'merchant', 'date', 'paymentMethod']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...body,
        userId: user.id // Enforce the authenticated user's ID
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase POST error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    console.error('Transactions POST error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

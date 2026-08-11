import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// GET /api/transactions — List all transactions
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
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
    const body = await request.json()

    // Validate required fields
    const required = ['userId', 'amount', 'category', 'merchant', 'date', 'paymentMethod']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        userId: body.userId,
        amount: body.amount,
        currency: body.currency || 'USD',
        category: body.category,
        merchant: body.merchant,
        date: body.date,
        paymentMethod: body.paymentMethod,
        entryMethod: body.entryMethod || 'Manual',
        receiptUrl: body.receiptUrl || null,
        lineItems: body.lineItems || [],
        isFlagged: body.isFlagged || false,
        flagReason: body.flagReason || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase INSERT error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    console.error('Transactions POST error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

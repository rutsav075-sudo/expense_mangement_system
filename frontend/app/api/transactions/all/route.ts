import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// DELETE /api/transactions/all — Delete all transactions
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Delete all records (requires true filter or empty eq on an always-true condition)
    // To delete all rows safely in Supabase, we can use neq('id', '00000000-0000-0000-0000-000000000000') 
    // or just pass a filter that matches everything.
    const { error } = await supabase
      .from('transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: 'success' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

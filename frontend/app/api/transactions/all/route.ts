import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// DELETE /api/transactions/all — Delete all transactions for the logged in user
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('userId', user.id) // Only delete this user's data

    if (error) {
      console.error('Supabase DELETE all error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'All transactions deleted successfully' })
  } catch (e: any) {
    console.error('Transactions DELETE all error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

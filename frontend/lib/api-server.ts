import { createServerSupabaseClient } from '@/lib/supabase'
import { Transaction } from '@/lib/api'

// Server-side function — called directly from Server Components (no HTTP needed)
export async function getTransactionsServer(): Promise<Transaction[]> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('userId', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase direct fetch error:', error)
      return []
    }

    return data || []
  } catch (e) {
    console.error('getTransactionsServer error:', e)
    return []
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete existing transactions first to ensure a clean slate
    await supabase.from('transactions').delete().eq('userId', user.id)

    // Generate dummy showcase data
    const today = new Date()
    const dummyData = []

    const categories = ['Meals & Entertainment', 'Travel', 'Software', 'Office Supplies', 'Marketing']
    const merchants = {
      'Meals & Entertainment': ['Starbucks', 'Uber Eats', 'Local Restaurant', 'Business Dinner'],
      'Travel': ['Delta Airlines', 'Uber', 'Marriott', 'Hertz'],
      'Software': ['GitHub', 'AWS', 'Vercel', 'Slack', 'Figma'],
      'Office Supplies': ['Staples', 'Amazon', 'Apple Store'],
      'Marketing': ['Facebook Ads', 'Google Ads', 'LinkedIn Ads']
    }

    for (let i = 0; i < 30; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const categoryMerchants = merchants[category as keyof typeof merchants]
      const merchant = categoryMerchants[Math.floor(Math.random() * categoryMerchants.length)]
      
      const date = new Date(today)
      date.setDate(date.getDate() - Math.floor(Math.random() * 60)) // last 60 days
      
      dummyData.push({
        userId: user.id,
        amount: Math.round((Math.random() * 200 + 10) * 100) / 100, // random amount between $10 and $210
        currency: 'USD',
        category,
        merchant,
        date: date.toISOString(),
        paymentMethod: 'Credit Card',
        entryMethod: 'Manual',
        isFlagged: Math.random() > 0.9, // 10% chance of being flagged
        flagReason: null
      })
    }
    
    // Add a few big transactions to make graphs look nice
    dummyData.push({
      userId: user.id,
      amount: 1500.00,
      currency: 'USD',
      category: 'Software',
      merchant: 'AWS',
      date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: 'Credit Card',
      entryMethod: 'Manual',
      isFlagged: true,
      flagReason: 'Unusually high software expense'
    })

    const { error } = await supabase
      .from('transactions')
      .insert(dummyData)

    if (error) {
      console.error('Supabase seed error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Showcase data generated successfully' }, { status: 201 })
  } catch (e: any) {
    console.error('Transactions seed error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

import { AlertCircle, Receipt, ArrowUpRight } from 'lucide-react'
import { Transaction } from '@/lib/api'

export function RecentTransactions({ transactions = [] }: { transactions?: Transaction[] }) {
  // Sort by date descending and take top 6
  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent Transactions</h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase border-b border-border/50">
            <tr>
              <th className="pb-3 font-medium">Merchant</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Method</th>
              <th className="pb-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {recentTx.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No transactions found. Add one to get started!
                </td>
              </tr>
            ) : (
              recentTx.map((tx) => (
                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border">
                        <Receipt className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-2">
                          {tx.merchant}
                          {tx.isFlagged && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-background border border-border text-muted-foreground">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 text-muted-foreground">{tx.date}</td>
                  <td className="py-4 text-muted-foreground">{tx.paymentMethod}</td>
                  <td className="py-4 text-right font-medium font-mono">
                    ${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

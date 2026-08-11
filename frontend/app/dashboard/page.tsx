import { DashboardMetrics } from '@/components/dashboard-metrics'
import { SpendingChart } from '@/components/spending-chart'
import { RecentTransactions } from '@/components/recent-transactions'
import { NewExpenseButton } from '@/components/new-expense-button'
import { getTransactionsServer } from '@/lib/api'

export default async function Home() {
  const transactions = await getTransactionsServer();

  return (
    <>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
              <p className="text-muted-foreground text-sm mt-1">Here&apos;s your financial summary and recent activity.</p>
            </div>
            <NewExpenseButton />
          </div>
          
          <DashboardMetrics transactions={transactions} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SpendingChart transactions={transactions} />
            </div>
            <div className="lg:col-span-2">
              <RecentTransactions transactions={transactions} />
            </div>
          </div>
    </>
  )
}

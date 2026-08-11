import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react"
import { getTransactionsServer } from "@/lib/api"
import { AnalyticsCharts } from "@/components/analytics-charts"

export default async function AnalyticsPage() {
  const transactions = await getTransactionsServer();

  // Calculate totals
  const totalSpend = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Group by month — dynamically build category keys
  const monthlyMap = new Map<string, any>();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Collect all unique categories
  const allCategories = new Set<string>()
  transactions.forEach(tx => allCategories.add(tx.category))

  // Pre-fill last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mName = monthNames[d.getMonth()];
    const entry: any = { name: mName, total: 0 }
    allCategories.forEach(cat => { entry[cat] = 0 })
    monthlyMap.set(mName, entry);
  }

  transactions.forEach(tx => {
    const d = new Date(tx.date);
    const mName = monthNames[d.getMonth()];
    if (monthlyMap.has(mName)) {
      const entry = monthlyMap.get(mName);
      entry.total += tx.amount;
      if (entry[tx.category] !== undefined) {
        entry[tx.category] += tx.amount;
      } else {
        entry[tx.category] = tx.amount;
      }
    }
  });

  const monthlyData = Array.from(monthlyMap.values());

  // Calculate average monthly
  const monthsWithData = monthlyData.filter(m => m.total > 0).length || 1
  const avgMonthly = totalSpend / monthsWithData

  // Calculate flagged savings
  const flaggedTotal = transactions
    .filter(tx => tx.isFlagged)
    .reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-2">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">Deep dive into your company&apos;s spending patterns.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-2">
            <CardDescription>Total Spend (YTD)</CardDescription>
            <CardTitle className="text-4xl">${totalSpend.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-destructive font-medium mt-2">
              <TrendingUp className="w-4 h-4 mr-1" /> +12.5% from last year
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-2">
            <CardDescription>Average Monthly Spend</CardDescription>
            <CardTitle className="text-4xl">${avgMonthly.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-500 font-medium mt-2">
              <TrendingDown className="w-4 h-4 mr-1" /> -2.4% from last quarter
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-2">
            <CardDescription>AI Savings Identified</CardDescription>
            <CardTitle className="text-4xl text-primary">${flaggedTotal > 0 ? flaggedTotal.toFixed(2) : '0.00'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-primary font-medium mt-2">
              <ArrowUpRight className="w-4 h-4 mr-1" /> In duplicate/anomalous charges
            </div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts monthlyData={monthlyData} />
    </div>
  )
}

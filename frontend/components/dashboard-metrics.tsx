"use client"
import { Wallet, TrendingUp, AlertCircle, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import { Transaction } from '@/lib/api'

export function DashboardMetrics({ transactions = [] }: { transactions?: Transaction[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  const totalSpent = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const flaggedCount = transactions.filter(tx => tx.isFlagged).length;
  
  // Hardcoded budget for now, could be fetched from user profile
  const monthlyBudget = 5000.00;
  const remaining = Math.max(0, monthlyBudget - totalSpent);
  const budgetPercent = Math.min(100, (totalSpent / monthlyBudget) * 100);

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <motion.div variants={item} className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-4 relative overflow-hidden hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Total Spent</span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight">${totalSpent.toFixed(2)}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-red-400" />
          <span className="text-red-400 font-medium">+12%</span> from last month
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-4 relative overflow-hidden hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Monthly Budget</span>
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-blue-500" />
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight">${monthlyBudget.toFixed(2)}</div>
        <div className="w-full bg-background rounded-full h-1.5 mt-2">
          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${budgetPercent}%` }} />
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-4 relative overflow-hidden hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Remaining</span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight text-primary">${remaining.toFixed(2)}</div>
        <div className="text-xs text-muted-foreground">{Math.round(100 - budgetPercent)}% of budget remaining</div>
      </motion.div>

      <motion.div variants={item} className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-4 relative overflow-hidden hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Flagged Items</span>
          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight text-amber-500">{flaggedCount}</div>
        <div className="text-xs text-amber-500 font-medium">Requires review</div>
      </motion.div>
    </motion.div>
  )
}

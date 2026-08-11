"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { motion } from 'framer-motion'
import { Transaction } from '@/lib/api'

// Helper to assign consistent colors to categories
const CATEGORY_COLORS: Record<string, string> = {
  'Meals & Entertainment': '#10b981', // emerald
  'Travel': '#3b82f6', // blue
  'Software': '#8b5cf6', // violet
  'Office Supplies': '#f59e0b', // amber
  'Utilities': '#ef4444', // red
  'Groceries': '#ec4899', // pink
}
const DEFAULT_COLOR = '#64748b' // slate

export function SpendingChart({ transactions = [] }: { transactions?: Transaction[] }) {
  // Compute totals by category
  const categoryMap = new Map<string, number>();
  transactions.forEach(tx => {
    const current = categoryMap.get(tx.category) || 0;
    categoryMap.set(tx.category, current + tx.amount);
  });

  const data = Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || DEFAULT_COLOR
  })).sort((a, b) => b.value - a.value);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-6 h-[400px]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Spending by Category</h2>
        <select className="bg-background border border-border rounded-lg px-3 py-1 text-sm outline-none focus:border-primary">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="flex-1 w-full min-h-0">
        {data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <p>No spending data available.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/90 backdrop-blur border border-border p-3 rounded-xl shadow-xl">
                        <p className="text-sm font-medium mb-1">{payload[0].name}</p>
                        <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
                          ${Number(payload[0].value).toFixed(2)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-sm text-muted-foreground ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
}

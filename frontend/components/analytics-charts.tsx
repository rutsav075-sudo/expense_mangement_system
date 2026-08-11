"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart, Legend } from "recharts"

const CATEGORY_COLORS: Record<string, string> = {
  'Meals & Entertainment': '#10b981',
  'Travel': '#3b82f6',
  'Software': '#8b5cf6',
  'Office Supplies': '#f59e0b',
  'Utilities': '#ef4444',
  'Groceries': '#ec4899',
}

export function AnalyticsCharts({ monthlyData, categoryData }: { monthlyData: any[], categoryData?: any[] }) {
  // Get unique categories from the data for the bar chart
  const allCategories = new Set<string>()
  monthlyData.forEach(month => {
    Object.keys(month).forEach(key => {
      if (key !== 'name' && key !== 'total') {
        allCategories.add(key)
      }
    })
  })

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl col-span-1">
        <CardHeader>
          <CardTitle>Spending Overview</CardTitle>
          <CardDescription>Total expenses across all categories over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.15 150)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="oklch(0.6 0.15 150)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              <Area type="monotone" dataKey="total" stroke="oklch(0.6 0.15 150)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl col-span-1">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Monthly spending by category.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-sm text-muted-foreground ml-1 capitalize">{value}</span>}
              />
              {Array.from(allCategories).map((cat, i) => {
                const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899']
                return (
                  <Bar
                    key={cat}
                    dataKey={cat}
                    fill={CATEGORY_COLORS[cat] || colors[i % colors.length]}
                    radius={[4, 4, 0, 0]}
                    stackId="categories"
                  />
                )
              })}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

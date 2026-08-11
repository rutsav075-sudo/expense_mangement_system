"use client"

import { LayoutDashboard, PieChart, Receipt, MessageSquare, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { useAuth } from '@/context/AuthContext'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PieChart, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Receipt, label: 'Receipts', href: '/dashboard/receipts' },
  { icon: MessageSquare, label: 'AI Assistant', href: '/dashboard/ai-assistant' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <aside className="sticky top-24 h-[calc(100vh-8rem)] w-64 bg-card rounded-2xl hidden md:flex flex-col p-6 border border-border overflow-y-auto">
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border flex flex-col gap-2">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-200 text-left">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </Link>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-200 text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  )
}

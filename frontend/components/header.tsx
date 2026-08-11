"use client"

import { Search, Bell, Settings, LogOut, User, CreditCard } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Logo } from '@/components/logo'

export function Header() {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, signOut } = useAuth()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    try {
      // In a real app we'd upload this to Firebase Storage, but for now we'll convert to object URL 
      // or base64 and update profile. To keep it simple without storage, we use a FileReader.
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Url = reader.result as string;
        const { createBrowserSupabaseClient } = await import('@/lib/supabase-browser');
        const supabase = createBrowserSupabaseClient();
        
        await supabase.auth.updateUser({
          data: { avatar_url: base64Url }
        });
        
        // Force refresh state by just waiting or window.location.reload
        window.location.reload();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-border z-40">
      <div className="h-full max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Logo className="w-full h-full" />
          </div>
          <span className="text-xl font-semibold tracking-tight">LedgerMind AI</span>
        </Link>
        
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Ask anything or search transactions..." 
              className="w-full h-10 bg-card border border-border rounded-full pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="p-4 text-sm text-muted-foreground flex flex-col gap-3">
                    <div className="flex gap-3 items-start">
                      <div className="w-2 h-2 mt-1.5 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-foreground">New expense flagged</p>
                        <p className="text-xs">2 mins ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start opacity-60">
                      <div className="w-2 h-2 mt-1.5 bg-transparent border border-border rounded-full"></div>
                      <div>
                        <p className="text-foreground">Weekly report generated</p>
                        <p className="text-xs">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Link href="/dashboard/settings" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
          
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-card border-2 border-transparent overflow-hidden relative cursor-pointer ring-offset-background transition-all hover:border-primary/50 focus:outline-none focus:border-primary"
            >
              <Image src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="User" fill className="object-cover" unoptimized />
            </button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-5 py-4 bg-background/50 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 relative overflow-hidden flex-shrink-0 border border-primary/20">
                      <Image src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="User" fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-foreground leading-none">{user?.user_metadata?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-none truncate max-w-[150px]">{user?.email}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      disabled={isUploading}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <User className="w-4 h-4" />
                      {isUploading ? "Uploading..." : "Change Profile Photo"}
                    </button>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all">
                      <CreditCard className="w-4 h-4" />
                      Billing & Plans
                    </Link>
                  </div>
                  <div className="p-2 border-t border-border">
                    <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium">
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

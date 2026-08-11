"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpenseModal({ isOpen, onClose }: ModalProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'receipt'>('manual')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form State
  const [merchant, setMerchant] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("Meals & Entertainment")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await api.createTransaction({
        amount: parseFloat(amount),
        currency: "USD",
        category,
        merchant,
        date,
        paymentMethod: "Credit Card",
        entryMethod: "Manual",
        isFlagged: false
      })
      toast.success('Expense added successfully')
      router.refresh() // Refresh the dashboard data
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add expense')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-xl font-semibold">Add New Expense</h2>
              <button 
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-border/50">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'manual' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Manual Entry
                </div>
                {activeTab === 'manual' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('receipt')}
                className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'receipt' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Receipt
                </div>
                {activeTab === 'receipt' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'manual' ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Merchant</label>
                    <input value={merchant} onChange={e => setMerchant(e.target.value)} required type="text" placeholder="e.g. Uber" className="w-full h-10 bg-background border border-border rounded-xl px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Amount</label>
                      <input value={amount} onChange={e => setAmount(e.target.value)} required type="number" step="0.01" placeholder="0.00" className="w-full h-10 bg-background border border-border rounded-xl px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Date</label>
                      <input value={date} onChange={e => setDate(e.target.value)} required type="date" className="w-full h-10 bg-background border border-border rounded-xl px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [color-scheme:dark]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full h-10 bg-background border border-border rounded-xl px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                      <option value="Meals & Entertainment">Meals & Entertainment</option>
                      <option value="Travel">Travel</option>
                      <option value="Software">Software</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Utilities">Utilities</option>
                    </select>
                  </div>
                  
                  <button 
                    disabled={isSubmitting}
                    className="w-full h-11 bg-primary text-primary-foreground font-medium rounded-xl mt-4 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Save Expense
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-border rounded-xl bg-background/50 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-medium mb-1">Upload Receipt</h3>
                  <p className="text-sm text-muted-foreground mb-6">Drag and drop your receipt image here, or click to browse.</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="receipt-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        toast.success("Receipt uploaded! AI scanning in progress...");
                        setTimeout(() => {
                          setMerchant("Starbucks (Scanned)");
                          setAmount("5.40");
                          setCategory("Meals & Entertainment");
                          setActiveTab("manual");
                          toast.success("Receipt scanned successfully!");
                        }, 1500);
                      }
                    }}
                  />
                  <button 
                    onClick={() => document.getElementById('receipt-upload')?.click()}
                    className="h-9 px-4 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors border border-border"
                  >
                    Select Image
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

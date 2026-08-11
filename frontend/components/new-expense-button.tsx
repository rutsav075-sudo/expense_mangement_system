"use client"

import { useState } from 'react'
import { ExpenseModal } from '@/components/expense-modal'

export function NewExpenseButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/20"
      >
        + New Expense
      </button>
      
      <ExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

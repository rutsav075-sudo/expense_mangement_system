// Use relative URLs for client-side fetches (works on both localhost and Vercel)
const API_BASE_URL = '/api';

export interface Transaction {
  id: string;
  userId?: string; // Optional since the backend assigns it
  amount: number;
  currency: string;
  category: string;
  merchant: string;
  date: string;
  paymentMethod: string;
  entryMethod: string;
  receiptUrl?: string | null;
  lineItems?: { item: string; price: number }[] | null;
  isFlagged: boolean;
  flagReason?: string | null;
}

// Client-side API functions (use relative URLs, hit Next.js API routes)
export const api = {
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch transactions: ${response.statusText}`);
    }
    return response.json();
  },
  
  createTransaction: async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create transaction: ${response.statusText}`);
    }
    return response.json();
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to delete transaction: ${response.statusText}`);
    }
  },

  updateTransaction: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update transaction: ${response.statusText}`);
    }
    return response.json();
  },

  deleteAllTransactions: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/transactions/all`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to delete all transactions: ${response.statusText}`);
    }
  },
  
  seedTransactions: async (): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/transactions/seed`, {
      method: 'POST',
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to generate showcase data');
    }
  }
};

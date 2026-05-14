export interface Entry {
  id: string;
  client: string;
  description: string;
  date: string;
  paymentMethod: string;
  value: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  name: string;
  date: string;
  value: number;
}

export interface Routine {
  id: string;
  name: string;
}

export interface FinancialSummary {
  totalEntries: number;
  totalExpenses: number;
  balance: number;
}

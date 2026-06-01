export interface Entry {
  id: string;
  client: string;
  description: string;
  date: string;
  paymentMethod?: string;
  payment_method?: string;
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
  paymentMethod?: string;
  payment_method?: string;
  value: number;
}

export interface Routine {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
}

export interface FinancialSummary {
  totalEntries: number;
  totalExpenses: number;
  balance: number;
}

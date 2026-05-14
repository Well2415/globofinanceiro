import type { Entry, Expense, Routine, PaymentMethod } from '../types';

export const seedData = () => {
  // Sempre resetar para garantir que o usuário veja a lista cheia após meu comando
  const dummyPaymentMethods: PaymentMethod[] = [
    { id: '1', name: 'Pix' },
    { id: '2', name: 'Cartão de Crédito' },
    { id: '3', name: 'Cartão de Débito' },
    { id: '4', name: 'Dinheiro' }
  ];

  const dummyRoutines: Routine[] = [
    { id: '1', name: 'Almoço' },
    { id: '2', name: 'Energia' },
    { id: '3', name: 'Combustível' },
    { id: '4', name: 'Lanche' },
    { id: '5', name: 'Salário' },
    { id: '6', name: 'Aluguel' },
    { id: '7', name: 'Internet' },
    { id: '8', name: 'Imposto (DAS)' },
    { id: '9', name: 'Manutenção' }
  ];

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastWeek = new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0];
  const twoWeeksAgo = new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0];

  const dummyEntries: Entry[] = [
    { id: 'e1', client: 'Carlos Tech Solutions', description: 'Consultoria Mensal', date: lastWeek, paymentMethod: 'Pix', value: 2500.00 },
    { id: 'e2', client: 'Oficina do João', description: 'Venda de Equipamentos', date: yesterday, paymentMethod: 'Cartão de Crédito', value: 850.00 },
    { id: 'e3', client: 'Marina Silva', description: 'Reparo de Notebook', date: today, paymentMethod: 'Pix', value: 350.00 },
    { id: 'e4', client: 'Supermercado Globo', description: 'Manutenção de Rede', date: yesterday, paymentMethod: 'Pix', value: 1200.00 },
    { id: 'e5', client: 'Pedro Santos', description: 'Venda de Periféricos', date: today, paymentMethod: 'Dinheiro', value: 120.00 },
    { id: 'e6', client: 'Ana Paula', description: 'Formatação de PC', date: twoWeeksAgo, paymentMethod: 'Pix', value: 180.00 },
    { id: 'e7', client: 'Roberto Lima', description: 'Instalação de Câmeras', date: lastWeek, paymentMethod: 'Cartão de Crédito', value: 950.00 },
    { id: 'e8', client: 'Loja do Bairro', description: 'Venda de Cabos', date: yesterday, paymentMethod: 'Dinheiro', value: 65.00 },
    { id: 'e9', client: 'Condomínio Aurora', description: 'Contrato de TI', date: twoWeeksAgo, paymentMethod: 'Pix', value: 3000.00 },
    { id: 'e10', client: 'Padaria Central', description: 'Reparo de Impressora', date: yesterday, paymentMethod: 'Cartão de Débito', value: 450.00 },
    { id: 'e11', client: 'Juliana Mendes', description: 'Consultoria', date: today, paymentMethod: 'Pix', value: 600.00 },
  ];

  const dummyExpenses: Expense[] = [
    { id: 'ex1', name: 'Aluguel', date: lastWeek, value: 1800.00 },
    { id: 'ex2', name: 'Salário', date: lastWeek, value: 3200.00 },
    { id: 'ex3', name: 'Energia', date: yesterday, value: 480.00 },
    { id: 'ex4', name: 'Internet', date: twoWeeksAgo, value: 150.00 },
    { id: 'ex5', name: 'Combustível', date: yesterday, value: 200.00 },
    { id: 'ex6', name: 'Lanche', date: today, value: 32.50 },
    { id: 'ex7', name: 'Imposto (DAS)', date: twoWeeksAgo, value: 75.00 },
    { id: 'ex8', name: 'Almoço', date: lastWeek, value: 120.00 },
    { id: 'ex9', name: 'Manutenção', date: twoWeeksAgo, value: 450.00 },
    { id: 'ex10', name: 'Combustível', date: lastWeek, value: 150.00 },
    { id: 'ex11', name: 'Lanche', date: yesterday, value: 18.00 },
    { id: 'ex12', name: 'Energia', date: twoWeeksAgo, value: 420.00 },
  ];

  localStorage.setItem('globo_payment_methods', JSON.stringify(dummyPaymentMethods));
  localStorage.setItem('globo_routines', JSON.stringify(dummyRoutines));
  localStorage.setItem('globo_entries', JSON.stringify(dummyEntries));
  localStorage.setItem('globo_expenses', JSON.stringify(dummyExpenses));
};

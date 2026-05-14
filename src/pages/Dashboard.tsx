import { useState, useEffect } from 'react';
import type { Entry, Expense } from '../types';
import { TrendingUp, TrendingDown, Wallet, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('globo_entries') || '[]');
    const savedExpenses = JSON.parse(localStorage.getItem('globo_expenses') || '[]');
    setEntries(savedEntries);
    setExpenses(savedExpenses);
  }, []);

  const totalEntries = entries.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.value, 0);
  const balance = totalEntries - totalExpenses;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo ao Centro de Custo GLOBO</p>
      </header>

      {/* Main Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon income">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total de Vendas (Entradas)</span>
            <h2 className="stat-value">{formatCurrency(totalEntries)}</h2>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon expense">
            <TrendingDown size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total de Saídas</span>
            <h2 className="stat-value">{formatCurrency(totalExpenses)}</h2>
          </div>
        </div>

        <div className="stat-card glass-card highlight">
          <div className="stat-icon balance">
            <Wallet size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Saldo Atual</span>
            <h2 className="stat-value">{formatCurrency(balance)}</h2>
          </div>
        </div>
      </div>

      <div className="cost-center-section">
        <div className="card glass-card">
          <h3>Centro de Custo</h3>
          <div className="progress-container">
            <div className="progress-labels">
              <span>Saídas vs Vendas</span>
              <span>{totalEntries > 0 ? ((totalExpenses / totalEntries) * 100).toFixed(1) : 0}% consumido</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min((totalExpenses / totalEntries) * 100, 100) || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Ações Rápidas</h3>
        <div className="actions-grid">
          <Link to="/entries" className="action-btn">
            <PlusCircle size={20} />
            <span>Adicionar Venda</span>
          </Link>
          <Link to="/expenses" className="action-btn secondary">
            <PlusCircle size={20} />
            <span>Adicionar Gasto</span>
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
        }

        .page-header p {
          color: var(--text-muted);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-card.highlight {
          border-color: var(--primary);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 41, 59, 0.7) 100%);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.income { background-color: rgba(16, 185, 129, 0.1); color: var(--success); }
        .stat-icon.expense { background-color: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .stat-icon.balance { background-color: rgba(59, 130, 246, 0.1); color: var(--primary); }

        .stat-label {
          display: block;
          font-size: var(--font-sm);
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: var(--font-lg);
          font-weight: 700;
        }

        .progress-container {
          margin-top: 1.5rem;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }

        .progress-bar {
          height: 10px;
          background-color: var(--bg-card-hover);
          border-radius: 5px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          border-radius: 5px;
          transition: width 1s ease-in-out;
        }

        .quick-actions {
          margin-top: 2rem;
        }

        .quick-actions h3 {
          margin-bottom: 1rem;
          font-size: 1.1rem;
          color: var(--text-muted);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--bg-card);
          padding: 1rem;
          border-radius: var(--radius-md);
          text-decoration: none;
          color: white;
          font-weight: 500;
          border: 1px solid var(--border);
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background-color: var(--bg-card-hover);
          transform: translateY(-2px);
        }

        .action-btn.secondary {
          border-style: dashed;
        }
      `}} />
    </div>
  );
};

export default Dashboard;

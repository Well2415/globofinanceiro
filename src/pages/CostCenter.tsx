import { useState, useEffect } from 'react';
import type { Entry, Expense, Routine } from '../types';
import { Calendar, Filter, TrendingUp, TrendingDown, DollarSign, List } from 'lucide-react';

const CostCenter = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);

  // Filters
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // First day of current month
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterItem, setFilterItem] = useState('Todos');
  const [filterClient, setFilterClient] = useState('');

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('globo_entries') || '[]');
    const savedExpenses = JSON.parse(localStorage.getItem('globo_expenses') || '[]');
    const savedRoutines = JSON.parse(localStorage.getItem('globo_routines') || '[]');
    
    setEntries(savedEntries);
    setExpenses(savedExpenses);
    setRoutines(savedRoutines);
  }, []);

  // Filter logic
  const filteredEntries = entries.filter(e => {
    const dateMatch = e.date >= startDate && e.date <= endDate;
    const clientMatch = e.client.toLowerCase().includes(filterClient.toLowerCase());
    return dateMatch && clientMatch;
  });

  const filteredExpenses = expenses.filter(e => {
    const dateMatch = e.date >= startDate && e.date <= endDate;
    const itemMatch = filterItem === 'Todos' || e.name === filterItem;
    // Se estiver filtrando por cliente, despesas ficam zeradas para bater a somatória daquele cliente
    // A menos que o campo cliente esteja vazio
    const hideExpenses = filterClient.length > 0;
    return dateMatch && itemMatch && !hideExpenses;
  });

  const totalEntries = filteredEntries.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.value, 0);
  const balance = totalEntries - totalExpenses;

  // Breakdown by item
  const breakdown = filteredExpenses.reduce((acc: any, curr) => {
    acc[curr.name] = (acc[curr.name] || 0) + curr.value;
    return acc;
  }, {});

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="cost-center-page animate-fade-in">
      <header className="page-header">
        <h1>Centro de Custo</h1>
        <p>Análise completa de resultados</p>
      </header>

      {/* Filters Section */}
      <section className="filters-card glass-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label><Calendar size={14} /> De</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="filter-group">
            <label><Calendar size={14} /> Até</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="filter-group">
            <label><Filter size={14} /> Filtrar por Item</label>
            <select value={filterItem} onChange={(e) => setFilterItem(e.target.value)}>
              <option value="Todos">Todos os Itens</option>
              {routines.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label><Filter size={14} /> Buscar Cliente</label>
            <input 
              type="text" 
              placeholder="Digite o nome do cliente..." 
              value={filterClient} 
              onChange={(e) => setFilterClient(e.target.value)} 
            />
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-label">Total Entradas</span>
            <TrendingUp size={18} className="text-success" />
          </div>
          <h2 className="stat-value text-success">{formatCurrency(totalEntries)}</h2>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-header">
            <span className="stat-label">Total Saídas</span>
            <TrendingDown size={18} className="text-danger" />
          </div>
          <h2 className="stat-value text-danger">{formatCurrency(totalExpenses)}</h2>
        </div>
        <div className="stat-card glass-card highlight">
          <div className="stat-header">
            <span className="stat-label">Resultado Líquido</span>
            <DollarSign size={18} className="text-primary" />
          </div>
          <h2 className={`stat-value ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(balance)}
          </h2>
        </div>
      </div>

      {/* Breakdown and Details */}
      <div className="details-grid">
        {/* Breakdown by Item */}
        <section className="card glass-card">
          <div className="card-header">
            <List size={18} />
            <h3>Gastos por Item</h3>
          </div>
          <div className="breakdown-list">
            {Object.entries(breakdown).length === 0 ? (
              <p className="empty-text">Nenhum gasto no período.</p>
            ) : (
              Object.entries(breakdown)
                .sort(([, a]: any, [, b]: any) => b - a)
                .map(([name, val]: any) => (
                  <div key={name} className="breakdown-item">
                    <div className="breakdown-info">
                      <span className="breakdown-name">{name}</span>
                      <span className="breakdown-percent">
                        {((val / totalExpenses) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="breakdown-bar-bg">
                      <div 
                        className="breakdown-bar-fill" 
                        style={{ width: `${(val / totalExpenses) * 100}%` }}
                      ></div>
                    </div>
                    <span className="breakdown-val">{formatCurrency(val)}</span>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* Combined Transaction History (Filtered) */}
        <section className="card glass-card">
          <div className="card-header">
            <Filter size={18} />
            <h3>Histórico Filtrado</h3>
          </div>
          <div className="mini-list">
            {/* Show only expenses if filterItem is not "Todos" */}
            {filterItem !== 'Todos' ? (
              filteredExpenses.map(ex => (
                <div key={ex.id} className="mini-item">
                  <span>{ex.name}</span>
                  <span className="text-danger">-{formatCurrency(ex.value)}</span>
                </div>
              ))
            ) : (
              <>
                <p className="mini-section-label">Últimas Saídas (Limite 10)</p>
                {filteredExpenses.slice(0, 10).map(ex => (
                  <div key={ex.id} className="mini-item">
                    <span>{ex.name}</span>
                    <span className="text-danger">-{formatCurrency(ex.value)}</span>
                  </div>
                ))}
                <p className="mini-section-label">Últimas Entradas (Limite 10)</p>
                {filteredEntries.slice(0, 10).map(en => (
                  <div key={en.id} className="mini-item">
                    <span>{en.client}</span>
                    <span className="text-success">+{formatCurrency(en.value)}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cost-center-page { padding-bottom: 120px; width: 100%; max-width: 100%; overflow-x: hidden; }
        
        .page-header { margin-bottom: 2.5rem; padding: 0 0.5rem; }
        
        .filters-card { padding: 1.25rem; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.05); width: 100%; }
        .filters-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; width: 100%; }
        @media (min-width: 1024px) { .filters-grid { grid-template-columns: 1fr 1fr 1fr 1fr; } }
        
        .filter-group { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; }
        .filter-group input, .filter-group select { width: 100%; max-width: 100%; }
        .filter-group label { display: flex; align-items: center; gap: 0.5rem; font-size: var(--font-sm); color: var(--text-muted); font-weight: 500; }
        
        .stats-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin-bottom: 2.5rem; }
        @media (min-width: 768px) { .stats-grid { grid-template-columns: 1fr 1fr 1fr; } }
        
        .stat-card { padding: 1.75rem 1.5rem; }
        .stat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .stat-label { font-size: var(--font-sm); color: var(--text-muted); font-weight: 500; }
        .stat-value { font-size: var(--font-lg); font-weight: 800; letter-spacing: -0.02em; }
        
        .details-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) { .details-grid { grid-template-columns: 1fr 1fr; gap: 3rem; } }
        
        .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
        .card-header h3 { font-size: 1.1rem; }
        
        .breakdown-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .breakdown-item { display: flex; flex-direction: column; gap: 0.5rem; }
        .breakdown-info { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
        .breakdown-name { font-weight: 600; }
        .breakdown-percent { color: var(--text-muted); font-size: 0.8rem; }
        
        .breakdown-bar-bg { height: 8px; background: var(--bg-card-hover); border-radius: 4px; overflow: hidden; }
        .breakdown-bar-fill { height: 100%; background: var(--primary); border-radius: 4px; }
        .breakdown-val { font-weight: 700; align-self: flex-end; font-size: 0.9rem; }
        
        .mini-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .mini-item { display: flex; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--bg-card-hover); border-radius: var(--radius-sm); font-size: 0.9rem; }
        .mini-section-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 1rem; margin-bottom: 0.25rem; }
        
        .text-success { color: var(--success); }
        .text-danger { color: var(--danger); }
        .text-primary { color: var(--primary); }
        .empty-text { color: var(--text-muted); text-align: center; padding: 2rem; font-size: 0.9rem; }
      `}} />
    </div>
  );
};

export default CostCenter;

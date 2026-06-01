import { useState, useEffect } from 'react';
import type { Entry, PaymentMethod } from '../types';
import { Plus, Trash2, Calendar, User, CreditCard, DollarSign, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Entries = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [value, setValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [isCustomPayment, setIsCustomPayment] = useState(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [entriesRes, methodsRes] = await Promise.all([
        supabase.from('entries').select('*').order('date', { ascending: false }),
        supabase.from('payment_methods').select('*').order('name', { ascending: true })
      ]);

      if (entriesRes.data) setEntries(entriesRes.data);
      if (methodsRes.data) {
        setPaymentMethods(methodsRes.data);
        if (methodsRes.data.length > 0) setPaymentMethod('');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !value || !paymentMethod) return;
    setSubmitting(true);

    try {
      const newEntry = {
        client,
        description: description || 'Venda',
        date,
        payment_method: paymentMethod,
        value: parseFloat(value),
      };

      const methodExists = paymentMethods.some(m => m.name.toLowerCase() === paymentMethod.toLowerCase());
      if (!methodExists) {
        const { data: newMethod, error: methodError } = await supabase
          .from('payment_methods')
          .insert([{ name: paymentMethod }])
          .select()
          .single();
        if (!methodError && newMethod) {
          setPaymentMethods([...paymentMethods, newMethod]);
        }
      }

      const { data, error } = await supabase
        .from('entries')
        .insert([newEntry])
        .select()
        .single();

      if (error) throw error;
      
      setEntries([data, ...entries]);
      setClient('');
      setDescription('');
      setValue('');
      setPaymentMethod('');
      setIsCustomPayment(false);
      setShowForm(false);
    } catch (err) {
      console.error('Error saving entry:', err);
      alert('Erro ao salvar entrada.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta entrada?')) return;
    
    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(entries.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Erro ao excluir entrada.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando entradas...</div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header-flex">
        <div>
          <h1>Entradas</h1>
          <p>Gestão de vendas e recebimentos</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          {showForm ? 'Fechar' : 'Nova Entrada'}
        </button>
      </header>

      {showForm && (
        <div className="form-card glass-card animate-fade-in">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label><User size={14} /> Cliente</label>
                <input 
                  type="text" 
                  placeholder="Nome do cliente" 
                  value={client} 
                  onChange={(e) => setClient(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label><FileText size={14} /> Descrição da Venda</label>
                <input 
                  type="text" 
                  placeholder="O que foi vendido?" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group">
                <label><Calendar size={14} /> Data</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>
              <div className="input-group">
                <label><CreditCard size={14} /> Forma de Pagamento</label>
                {!isCustomPayment ? (
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomPayment(true);
                        setPaymentMethod('');
                      } else {
                        setPaymentMethod(e.target.value);
                      }
                    }}
                    required
                  >
                    <option value="" disabled>Selecione...</option>
                    {paymentMethods.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                    <option value="custom">+ Adicionar nova forma...</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Digite a nova forma..." 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required 
                      autoFocus
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button" 
                      style={{ padding: '0 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', cursor: 'pointer' }} 
                      onClick={() => { setIsCustomPayment(false); setPaymentMethod(''); }}
                      title="Voltar para a lista"
                    >
                      Voltar
                    </button>
                  </div>
                )}
              </div>
              <div className="input-group">
                <label><DollarSign size={14} /> Valor (R$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="0,00" 
                  value={value} 
                  onChange={(e) => setValue(e.target.value)}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn-primary submit-btn" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar Entrada'}
            </button>
          </form>
        </div>
      )}

      <div className="list-container">
        {entries.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma venda registrada.</p>
          </div>
        ) : (
          <>
            {entries.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(entry => (
              <div key={entry.id} className="item-card glass-card">
                <div className="item-main">
                  <div className="item-title-row">
                    <h3 className="client-name">{entry.client}</h3>
                    <span className="payment-badge">{entry.payment_method || entry.paymentMethod}</span>
                  </div>
                  <p className="item-desc">{entry.description}</p>
                  <span className="item-date">{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="item-details">
                  <span className="item-value text-success">
                    {entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <button className="delete-btn" onClick={() => deleteEntry(entry.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            
            {entries.length > ITEMS_PER_PAGE && (
              <div className="pagination-container">
                {Array.from({ length: Math.ceil(entries.length / ITEMS_PER_PAGE) }).map((_, i) => (
                  <button 
                    key={i} 
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .form-card { margin-bottom: 2rem; padding: 1.5rem; }
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 768px) { .form-grid { grid-template-columns: 1fr 1fr; } }
        .input-group label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
        .submit-btn { width: 100%; margin-top: 1.5rem; }
        .list-container { display: flex; flex-direction: column; gap: 1rem; }
        
        .item-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          gap: 1rem;
        }

        .item-main {
          flex: 1;
          min-width: 0;
        }

        .item-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
          flex-wrap: wrap;
        }

        .item-main h3 { 
          font-size: 1rem;
          word-break: break-word;
        }

        .item-desc { 
          font-size: 0.9rem; 
          color: var(--text-muted); 
          margin-bottom: 0.25rem;
          word-break: break-word;
          white-space: pre-wrap;
        }
        .item-date { font-size: 0.75rem; color: var(--text-muted); opacity: 0.7; }

        .item-details { display: flex; align-items: center; gap: 1rem; }
        .payment-badge {
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
          background-color: var(--bg-card-hover);
          border-radius: 4px;
          color: var(--primary-light);
          font-weight: 600;
        }

        .item-value { font-weight: 700; color: var(--success); }
        .delete-btn { color: var(--text-muted); padding: 0.5rem; }
        .delete-btn:hover { color: var(--danger); }
        .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); border: 2px dashed var(--border); border-radius: var(--radius-lg); }

        .pagination-container {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding: 1rem;
          flex-wrap: wrap;
        }

        .page-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .page-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }

        .page-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
        }
      `}} />
    </div>
  );
};

export default Entries;

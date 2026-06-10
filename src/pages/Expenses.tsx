import { useState, useEffect } from 'react';
import type { Expense, Routine, PaymentMethod } from '../types';
import { Plus, Trash2, Calendar, DollarSign, Zap, CreditCard, Pencil, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [value, setValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [isCustomPayment, setIsCustomPayment] = useState(false);

  // Edit state
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editPaymentMethod, setEditPaymentMethod] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [isEditCustomPayment, setIsEditCustomPayment] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, routinesRes, methodsRes] = await Promise.all([
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('routines').select('*').order('name', { ascending: true }),
        supabase.from('payment_methods').select('*').order('name', { ascending: true })
      ]);

      if (expensesRes.data) setExpenses(expensesRes.data);
      if (routinesRes.data) setRoutines(routinesRes.data);
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
    if (!value || !name || !paymentMethod) return;
    setSubmitting(true);

    try {
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

      const newExpense = {
        name,
        date,
        payment_method: paymentMethod,
        value: parseFloat(value),
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select()
        .single();

      if (error) throw error;
      
      setExpenses([data, ...expenses]);
      setName('');
      setValue('');
      setPaymentMethod('');
      setIsCustomPayment(false);
      setShowForm(false);
    } catch (err) {
      console.error('Error saving expense:', err);
      alert('Erro ao salvar despesa.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoutineSelect = (val: string) => {
    setName(val);
  };

  const deleteExpense = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta despesa?')) return;
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Erro ao excluir despesa.');
    }
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setEditName(expense.name);
    setEditDate(expense.date);
    setEditPaymentMethod(expense.payment_method || expense.paymentMethod || '');
    setEditValue(String(expense.value));
    setIsEditCustomPayment(false);
  };

  const closeEditModal = () => {
    setEditingExpense(null);
    setIsEditCustomPayment(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || !editName || !editValue || !editPaymentMethod) return;
    setEditSubmitting(true);

    try {
      const methodExists = paymentMethods.some(m => m.name.toLowerCase() === editPaymentMethod.toLowerCase());
      if (!methodExists) {
        const { data: newMethod, error: methodError } = await supabase
          .from('payment_methods')
          .insert([{ name: editPaymentMethod }])
          .select()
          .single();
        if (!methodError && newMethod) {
          setPaymentMethods([...paymentMethods, newMethod]);
        }
      }

      const updatedData = {
        name: editName,
        date: editDate,
        payment_method: editPaymentMethod,
        value: parseFloat(editValue),
      };

      const { error } = await supabase
        .from('expenses')
        .update(updatedData)
        .eq('id', editingExpense.id);

      if (error) throw error;

      setExpenses(expenses.map(e =>
        e.id === editingExpense.id ? { ...e, ...updatedData } : e
      ));
      closeEditModal();
    } catch (err) {
      console.error('Error updating expense:', err);
      alert('Erro ao atualizar despesa.');
    } finally {
      setEditSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando saídas...</div>;
  }

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header-flex">
        <div>
          <h1>Saídas</h1>
          <p>Gestão de despesas simplificada</p>
        </div>
        <button className="btn-primary btn-danger-alt" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          {showForm ? 'Fechar' : 'Nova Saída'}
        </button>
      </header>

      {showForm && (
        <div className="form-card glass-card animate-fade-in">
          <div className="routine-helper">
            <label><Zap size={14} /> Selecionar Item da Lista</label>
            <select onChange={(e) => handleRoutineSelect(e.target.value)} defaultValue="">
              <option value="" disabled>Escolha um item (Ex: Energia, Lanche...)</option>
              {routines.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Descrição / Nome</label>
                <input 
                  type="text" 
                  placeholder="Ex: Almoço" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
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
              {submitting ? 'Confirmando...' : 'Confirmar Saída'}
            </button>
          </form>
        </div>
      )}

      <div className="list-container">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma saída registrada.</p>
          </div>
        ) : (
          <>
            {expenses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(expense => (
              <div key={expense.id} className="item-card glass-card">
                <div className="item-main">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <h3 className="expense-desc">{expense.name}</h3>
                    {(expense.payment_method || expense.paymentMethod) && (
                      <span className="payment-badge">{expense.payment_method || expense.paymentMethod}</span>
                    )}
                  </div>
                  <span className="item-date">{new Date(expense.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="item-details">
                  <span className="item-value expense-val">
                    {expense.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <button className="edit-btn" onClick={() => openEditModal(expense)} title="Editar despesa">
                    <Pencil size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => deleteExpense(expense.id)} title="Excluir despesa">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {expenses.length > ITEMS_PER_PAGE && (
              <div className="pagination-container">
                {Array.from({ length: Math.ceil(expenses.length / ITEMS_PER_PAGE) }).map((_, i) => (
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

      {/* Modal de Edição */}
      {editingExpense && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Pencil size={18} /> Editar Despesa</h2>
              <button className="modal-close-btn" onClick={closeEditModal}>
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-form-grid">
                <div className="input-group">
                  <label>Descrição / Nome</label>
                  <input
                    type="text"
                    placeholder="Ex: Almoço"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label><Calendar size={14} /> Data</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label><CreditCard size={14} /> Forma de Pagamento</label>
                  {!isEditCustomPayment ? (
                    <select
                      value={editPaymentMethod}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setIsEditCustomPayment(true);
                          setEditPaymentMethod('');
                        } else {
                          setEditPaymentMethod(e.target.value);
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
                        value={editPaymentMethod}
                        onChange={(e) => setEditPaymentMethod(e.target.value)}
                        required
                        autoFocus
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        style={{ padding: '0 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)', cursor: 'pointer' }}
                        onClick={() => { setIsEditCustomPayment(false); setEditPaymentMethod(''); }}
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
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeEditModal}>
                  <X size={16} /> Cancelar
                </button>
                <button type="submit" className="btn-primary btn-save" disabled={editSubmitting}>
                  <Check size={16} /> {editSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .routine-helper {
          background: rgba(59, 130, 246, 0.1);
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .routine-helper label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--primary-light);
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .expense-desc {
          font-size: 1.1rem;
          font-weight: 600;
          word-break: break-word;
          white-space: pre-wrap;
          color: var(--text-main);
        }

        .payment-badge {
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
          background-color: var(--bg-card-hover);
          border-radius: 4px;
          color: var(--primary-light);
          font-weight: 600;
        }

        .expense-val {
          color: var(--danger) !important;
        }

        .btn-danger-alt {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          border: 1px solid var(--danger);
        }

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

        .item-main { flex: 1; min-width: 0; }
        .item-date { font-size: 0.8rem; color: var(--text-muted); }
        .item-details { display: flex; align-items: center; gap: 0.5rem; }
        .item-value { font-weight: 700; }

        .edit-btn {
          color: var(--text-muted);
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          min-height: 36px;
        }
        .edit-btn:hover { color: var(--primary-light); background: rgba(99,179,237,0.1); }

        .delete-btn {
          color: var(--text-muted);
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          min-height: 36px;
        }
        .delete-btn:hover { color: var(--danger); background: rgba(239,68,68,0.1); }

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

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 1000;
          padding: 0;
          animation: fadeInOverlay 0.2s ease;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-box {
          background: var(--bg-card, #1e2535);
          border: 1px solid var(--border);
          border-radius: 1.5rem 1.5rem 0 0;
          padding: 1.5rem 1.5rem 2rem;
          width: 100%;
          max-width: 600px;
          max-height: 92vh;
          overflow-y: auto;
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 -8px 40px rgba(0,0,0,0.4);
        }

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (min-width: 640px) {
          .modal-overlay {
            align-items: center;
            padding: 1rem;
          }
          .modal-box {
            border-radius: 1.25rem;
            max-height: 85vh;
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.15rem;
          color: var(--text-main);
        }

        .modal-close-btn {
          background: rgba(255,255,255,0.07);
          border: 1px solid var(--border);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .modal-close-btn:hover { background: rgba(239,68,68,0.15); color: var(--danger); border-color: var(--danger); }

        .modal-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 480px) {
          .modal-form-grid { grid-template-columns: 1fr 1fr; }
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .btn-cancel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-cancel:hover { background: rgba(239,68,68,0.1); color: var(--danger); border-color: var(--danger); }

        .btn-save {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
      `}} />
    </div>
  );
};

export default Expenses;

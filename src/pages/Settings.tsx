import { useState, useEffect } from 'react';
import type { PaymentMethod, Routine } from '../types';
import { Trash2, CreditCard, ListChecks } from 'lucide-react';



const Settings = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  
  const [newName, setNewName] = useState('');
  const [routineName, setRoutineName] = useState('');

  useEffect(() => {
    // Methods
    // ...
    // Methods
    const savedMethods = JSON.parse(localStorage.getItem('globo_payment_methods') || '[]');
    if (savedMethods.length === 0) {
      const initial = [
        { id: '1', name: 'Pix' }, { id: '2', name: 'Cartão de Crédito' },
        { id: '3', name: 'Cartão de Débito' }, { id: '4', name: 'Dinheiro' }
      ];
      setMethods(initial);
      localStorage.setItem('globo_payment_methods', JSON.stringify(initial));
    } else {
      setMethods(savedMethods);
    }

    // Routines
    let savedRoutines = JSON.parse(localStorage.getItem('globo_routines') || '[]');
    if (savedRoutines.length > 0) {
      savedRoutines = savedRoutines.map((r: any) => ({
        id: r.id,
        name: r.name || r.description || 'Sem nome'
      }));
    }

    if (savedRoutines.length === 0) {
      const initial: Routine[] = [
        { id: '1', name: 'Almoço' },
        { id: '2', name: 'Energia' },
        { id: '3', name: 'Combustível' },
        { id: '4', name: 'Lanche' },
        { id: '5', name: 'Salário' }
      ];
      setRoutines(initial);
      localStorage.setItem('globo_routines', JSON.stringify(initial));
    } else {
      setRoutines(savedRoutines);
      localStorage.setItem('globo_routines', JSON.stringify(savedRoutines));
    }
  }, []);

  const saveMethods = (newMethods: PaymentMethod[]) => {
    setMethods(newMethods);
    localStorage.setItem('globo_payment_methods', JSON.stringify(newMethods));
  };

  const saveRoutines = (newRoutines: Routine[]) => {
    setRoutines(newRoutines);
    localStorage.setItem('globo_routines', JSON.stringify(newRoutines));
  };

  const addMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    saveMethods([...methods, { id: Date.now().toString(), name: newName }]);
    setNewName('');
  };

  const addRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName) return;
    saveRoutines([...routines, { id: Date.now().toString(), name: routineName }]);
    setRoutineName('');
  };

  return (
    <div className="settings-page animate-fade-in">
      <header className="page-header-flex">
        <div>
          <h1>Configurações</h1>
          <p>Cadastre aqui as formas de pagamento e os itens de despesa</p>
        </div>
      </header>

      <div className="settings-grid">
        {/* Payment Methods */}
        <section className="settings-section">
          <div className="card glass-card">
            <div className="section-header">
              <CreditCard size={20} className="text-primary" />
              <h3>Formas de Pagamento</h3>
            </div>
            
            <form onSubmit={addMethod} className="inline-form">
              <input 
                type="text" 
                placeholder="Ex: Boleto" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button type="submit" className="btn-primary">Adicionar</button>
            </form>

            <div className="list-items">
              {methods.map(m => (
                <div key={m.id} className="small-item">
                  <span>{m.name}</span>
                  <button className="delete-btn" onClick={() => saveMethods(methods.filter(x => x.id !== m.id))}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Financial Routines / Items */}
        <section className="settings-section">
          <div className="card glass-card">
            <div className="section-header">
              <ListChecks size={20} className="text-primary" />
              <h3>Itens de Despesa (Ex: Lanche, Energia)</h3>
            </div>
            
            <form onSubmit={addRoutine} className="inline-form">
              <input 
                type="text" 
                placeholder="Ex: Lanche" 
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
              />
              <button type="submit" className="btn-primary">Adicionar</button>
            </form>

            <div className="list-items">
              {routines.map(r => (
                <div key={r.id} className="small-item">
                  <span>{r.name}</span>
                  <button className="delete-btn" onClick={() => saveRoutines(routines.filter(x => x.id !== r.id))}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .secondary-btn { background: rgba(59, 130, 246, 0.1); border: 1px solid var(--primary); color: var(--primary-light); font-size: 0.8rem; padding: 0.5rem 1rem; }
        .settings-grid { display: flex; flex-direction: column; gap: 2rem; }
        
        .settings-section { margin-bottom: 1rem; }
        .section-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .section-header h3 { font-size: 1.1rem; }
        
        .inline-form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        .inline-form input { flex: 1; }
        
        .list-items { display: flex; flex-direction: column; gap: 0.5rem; }
        .small-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--bg-card-hover); border-radius: var(--radius-md); font-size: 1rem; color: var(--text-main); }
        
        .delete-btn { color: var(--text-muted); display: flex; align-items: center; justify-content: center; }
        .delete-btn:hover { color: var(--danger); }
        .text-primary { color: var(--primary); }
      `}} />
    </div>
  );
};

export default Settings;

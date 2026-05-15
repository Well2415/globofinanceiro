import { useState, useEffect } from 'react';
import type { PaymentMethod, Routine, User } from '../types';
import { Trash2, CreditCard, ListChecks, Users, Settings2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users'>('general');
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newName, setNewName] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [userName, setUserName] = useState('');
  const [userLogin, setUserLogin] = useState('');
  const [userPass, setUserPass] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [methodsRes, routinesRes, usersRes] = await Promise.all([
        supabase.from('payment_methods').select('*').order('name', { ascending: true }),
        supabase.from('routines').select('*').order('name', { ascending: true }),
        supabase.from('users').select('*').order('name', { ascending: true })
      ]);

      if (methodsRes.data) setMethods(methodsRes.data);
      if (routinesRes.data) setRoutines(routinesRes.data);
      if (usersRes.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const { data } = await supabase.from('payment_methods').insert([{ name: newName }]).select().single();
    if (data) {
      setMethods([...methods, data]);
      setNewName('');
    }
  };

  const addRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName) return;
    const { data } = await supabase.from('routines').insert([{ name: routineName }]).select().single();
    if (data) {
      setRoutines([...routines, data]);
      setRoutineName('');
    }
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userLogin || !userPass) return;
    const normalizedLogin = userLogin.toLowerCase().trim();
    const { data } = await supabase.from('users').insert([{ 
      name: userName, 
      username: normalizedLogin, 
      password: userPass 
    }]).select().single();
    
    if (data) {
      setUsers([...users, data]);
      setUserName('');
      setUserLogin('');
      setUserPass('');
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Deseja excluir este item?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) {
      if (table === 'payment_methods') setMethods(methods.filter(m => m.id !== id));
      if (table === 'routines') setRoutines(routines.filter(r => r.id !== id));
      if (table === 'users') setUsers(users.filter(u => u.id !== id));
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando configurações...</div>;

  return (
    <div className="settings-page animate-fade-in">
      <header className="page-header">
        <h1>Ajustes</h1>
        <p>Gerencie as preferências e cadastros do sistema</p>
      </header>

      <div className="settings-tabs">
        <button 
          className={activeTab === 'general' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('general')}
        >
          <Settings2 size={18} />
          Geral
        </button>
        <button 
          className={activeTab === 'users' ? 'tab-btn active' : 'tab-btn'} 
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          Usuários
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'general' && (
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
                      <button className="delete-btn" onClick={() => deleteItem('payment_methods', m.id)}><Trash2 size={16} /></button>
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
                      <button className="delete-btn" onClick={() => deleteItem('routines', r.id)}><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'users' && (
          <section className="settings-section max-width-md">
            <div className="card glass-card">
              <div className="section-header">
                <Users size={20} className="text-primary" />
                <h3>Gerenciar Usuários</h3>
              </div>
              <p className="section-desc">Cadastre os usuários autorizados a operar o sistema.</p>
              
              <form onSubmit={addUser} className="user-form">
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Login de Acesso</label>
                    <input 
                      type="text" 
                      placeholder="Ex: joao.silva" 
                      value={userLogin}
                      onChange={(e) => setUserLogin(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Senha</label>
                    <input 
                      type="password" 
                      placeholder="Senha" 
                      value={userPass}
                      onChange={(e) => setUserPass(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary full-width">Adicionar Usuário</button>
              </form>

              <div className="list-items user-list">
                {users.length === 0 && <p className="empty-text">Nenhum usuário cadastrado.</p>}
                {users.map(u => (
                  <div key={u.id} className="small-item">
                    <div className="user-info">
                      <div className="user-avatar">{u.name.charAt(0).toUpperCase()}</div>
                      <div className="user-details">
                        <span className="user-name">{u.name}</span>
                        <span className="user-login">@{u.username}</span>
                      </div>
                    </div>
                    <button className="delete-btn" onClick={() => deleteItem('users', u.id)}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .settings-page { max-width: 100%; }
        .page-header { margin-bottom: 2rem; }
        
        .settings-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: rgba(30, 41, 59, 0.5);
          padding: 0.4rem;
          border-radius: var(--radius-md);
          width: fit-content;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .tab-btn:hover { color: white; background: rgba(255,255,255,0.05); }
        .tab-btn.active { background: var(--primary); color: white; }

        .settings-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) {
          .settings-grid { grid-template-columns: 1fr 1fr; }
        }
        
        .max-width-md { max-width: 600px; margin: 0 auto; }
        
        .section-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
        .section-desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
        
        .user-form { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .form-row { display: flex; gap: 1rem; }
        .form-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.85rem; color: var(--text-muted); }
        
        .inline-form { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
        .inline-form input { flex: 1; }
        
        .list-items { display: flex; flex-direction: column; gap: 0.5rem; }
        .small-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: var(--radius-md); transition: all 0.2s ease; }
        .small-item:hover { background: rgba(255,255,255,0.06); }
        
        .user-info { display: flex; align-items: center; gap: 0.75rem; }
        .user-avatar { width: 36px; height: 36px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: white; }
        .user-details { display: flex; flex-direction: column; }
        .user-name { font-weight: 500; font-size: 0.95rem; }
        .user-login { font-size: 0.75rem; color: var(--text-muted); }
        
        .delete-btn { color: var(--text-muted); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .delete-btn:hover { color: var(--danger); background: rgba(239, 68, 68, 0.1); }
        
        .full-width { width: 100%; margin-top: 0.5rem; }
        .empty-text { color: var(--text-muted); text-align: center; padding: 2rem; font-style: italic; }
        .text-primary { color: var(--primary); }
      `}} />
    </div>
  );
};

export default Settings;

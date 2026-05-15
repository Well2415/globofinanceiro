import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { User as UserType } from '../types';
import { supabase } from '../lib/supabase';

const Security = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('globo_current_user') || 'null');
    setCurrentUser(user);
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) return;

    if (currentPassword !== currentUser.password) {
      setError('A senha atual está incorreta.');
      return;
    }

    if (newPassword.length < 3) {
      setError('A nova senha deve ter pelo menos 3 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('A confirmação de senha não coincide.');
      return;
    }

    setSubmitting(true);
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;
      
      const updatedUser = { ...currentUser, password: newPassword };
      localStorage.setItem('globo_current_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      setSuccess('Sua senha foi alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Erro ao atualizar senha no servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="security-page animate-fade-in">
      <header className="page-header">
        <h1>Minha Conta</h1>
        <p>Gerencie sua segurança e senha de acesso</p>
      </header>

      <div className="container-small">
        <div className="card glass-card security-card">
          <div className="user-profile-header">
            <div className="large-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
            <h3>{currentUser.name}</h3>
            <span className="badge">@{currentUser.username}</span>
          </div>
          
          <hr className="divider" />

          <h3>Alterar Minha Senha</h3>
          <p className="subtitle">Atualize sua senha para manter sua conta protegida.</p>

          <form onSubmit={handleUpdatePassword} className="security-form">
            <div className="input-group">
              <label>Senha Atual</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Sua senha atual"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="input-group">
              <label>Nova Senha</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 3 caracteres"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="input-group">
              <label>Confirmar Nova Senha</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
            )}

            <button type="submit" className="btn-primary full-width" disabled={submitting}>
              <Save size={20} />
              {submitting ? 'Salvando...' : 'Atualizar Senha'}
            </button>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .security-page { max-width: 100%; }
        .container-small { max-width: 500px; margin: 0 auto; padding-top: 1rem; }
        .security-card { padding: 2.5rem; text-align: center; }
        .user-profile-header { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 2rem; }
        .large-avatar { width: 80px; height: 80px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; color: white; margin-bottom: 0.5rem; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        .badge { background: rgba(255,255,255,0.05); padding: 0.25rem 0.75rem; border-radius: 100px; font-size: 0.8rem; color: var(--text-muted); border: 1px solid var(--border); }
        .divider { border: 0; border-top: 1px solid var(--border); margin: 2rem 0; opacity: 0.5; }
        .security-card h3 { margin-bottom: 0.5rem; font-size: 1.3rem; }
        .subtitle { color: var(--text-muted); margin-bottom: 2rem; font-size: 0.9rem; }
        .security-form { text-align: left; display: flex; flex-direction: column; gap: 1.25rem; }
        .input-group label { display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.85rem; }
        .alert { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: var(--radius-md); font-size: 0.9rem; margin-bottom: 0.5rem; }
        .alert-error { background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.2); }
        .alert-success { background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.2); }
        .full-width { width: 100%; margin-top: 1rem; }
      `}} />
    </div>
  );
};

export default Security;

import { useState } from 'react';
import { LogIn, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedUsername = username.toLowerCase().trim();
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('username', normalizedUsername)
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError('Usuário ou senha incorretos.');
      } else {
        localStorage.setItem('globo_current_user', JSON.stringify(data));
        onLogin();
      }
    } catch (err) {
      setError('Erro ao conectar ao banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card animate-fade-in">
        <div className="login-header">
          <h1>GLOBO</h1>
          <p>Sistema Financeiro</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Usuário</label>
            <div className="input-wrapper">
              <UserIcon size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Seu login" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Senha de Acesso</label>
            <input 
              type="password" 
              placeholder="Sua senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          {error && <p className="error-text">{error}</p>}
          
          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            <LogIn size={20} />
            {loading ? 'Acessando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .login-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          text-align: center;
        }

        .login-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 0.25rem;
        }

        .login-header p {
          color: var(--text-muted);
          margin-bottom: 2.5rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 0.8rem;
        }

        .input-group {
          text-align: left;
          margin-bottom: 1.5rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-wrapper input {
          padding-left: 2.5rem !important;
        }

        .login-btn {
          width: 100%;
          margin-top: 1rem;
        }

        .error-text {
          color: var(--danger);
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .login-hint {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .login-hint strong {
          color: var(--primary-light);
        }
      `}} />
    </div>
  );
};

export default Login;

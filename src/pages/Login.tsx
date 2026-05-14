import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      onLogin();
    } else {
      setError('Senha incorreta. Tente "1234"');
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
            <label>Senha de Acesso</label>
            <input 
              type="password" 
              placeholder="Digite sua senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          
          {error && <p className="error-text">{error}</p>}
          
          <button type="submit" className="btn-primary login-btn">
            <LogIn size={20} />
            Entrar no Sistema
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

        .login-btn {
          width: 100%;
          margin-top: 1rem;
        }

        .error-text {
          color: var(--danger);
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
      `}} />
    </div>
  );
};

export default Login;

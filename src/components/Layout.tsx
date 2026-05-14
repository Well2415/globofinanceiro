import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowUpCircle, ArrowDownCircle, LogOut, Settings as SettingsIcon, BarChart3 } from 'lucide-react';


interface LayoutProps {
  onLogout: () => void;
}

const Layout = ({ onLogout }: LayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="layout-root">
      {/* Sidebar Desktop */}
      <aside className="sidebar">
        <div className="logo-container">
          <h1>GLOBO</h1>
          <p>Financeiro</p>
        </div>
        
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/entries" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ArrowUpCircle size={20} />
            <span>Entradas</span>
          </NavLink>
          <NavLink to="/expenses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ArrowDownCircle size={20} />
            <span>Saídas</span>
          </NavLink>
          <NavLink to="/cost-center" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <BarChart3 size={20} />
            <span>Centro de Custo</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <SettingsIcon size={20} />
            <span>Ajustes</span>
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <LayoutDashboard size={24} />
          <span>Início</span>
        </NavLink>
        <NavLink to="/entries" className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <ArrowUpCircle size={24} />
          <span>Entradas</span>
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <ArrowDownCircle size={24} />
          <span>Saídas</span>
        </NavLink>
        <NavLink to="/cost-center" className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <BarChart3 size={24} />
          <span>Relatórios</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}>
          <SettingsIcon size={24} />
          <span>Ajustes</span>
        </NavLink>
        <button className="mobile-nav-item" onClick={handleLogout}>
          <LogOut size={24} />
          <span>Sair</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .layout-root {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          display: none;
          width: 260px;
          background-color: var(--bg-card);
          border-right: 1px solid var(--border);
          flex-direction: column;
          padding: 2rem 1.5rem;
          position: fixed;
          height: 100vh;
          z-index: 50;
        }

        .logo-container h1 {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -1px;
          color: var(--primary);
        }

        .logo-container p {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 3rem;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-grow: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background-color: var(--bg-card-hover);
          color: white;
        }

        .nav-item.active {
          background-color: var(--primary);
          color: white;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--text-muted);
          margin-top: auto;
          border-radius: var(--radius-md);
        }

        .logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
        }

        .main-content {
          flex-grow: 1;
          width: 100%;
        }

        .bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid var(--border);
          z-index: 50;
          padding: 0.5rem;
          justify-content: space-around;
        }

        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: var(--text-muted);
          text-decoration: none;
          flex: 1;
          font-size: 0.7rem;
        }

        .mobile-nav-item.active {
          color: var(--primary);
        }

        @media (min-width: 1024px) {
          .sidebar {
            display: flex;
          }
          .bottom-nav {
            display: none;
          }
        }
      `}} />
    </div>
  );
};

export default Layout;

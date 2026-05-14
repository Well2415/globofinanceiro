import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Entries from './pages/Entries';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import CostCenter from './pages/CostCenter';
import ScrollToTop from './components/ScrollToTop';
import { seedData } from './utils/seed';
import './index.css';

function App() {
  useEffect(() => {
    seedData();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('globo_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('globo_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="entries" element={<Entries />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="settings" element={<Settings />} />
          <Route path="cost-center" element={<CostCenter />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

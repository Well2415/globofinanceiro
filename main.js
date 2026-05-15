// State Management
const dummyEntradas = [
    { cliente: "João Silva", data: "2026-04-28", pagamento: "Pix", valor: 1500.00 },
    { cliente: "Maria Oliveira", data: "2026-04-29", pagamento: "Cartão", valor: 850.50 },
    { cliente: "Pedro Santos", data: "2026-04-30", pagamento: "Dinheiro", valor: 320.00 }
];

const dummySaidas = [
    { categoria: "Salários", valor: 5000.00 },
    { categoria: "Energia", valor: 450.00 },
    { categoria: "Combustível", valor: 300.00 },
    { categoria: "Almoço/Lanche", valor: 120.00 },
    { categoria: "Manutenção", valor: 250.00 }
];

const savedEntradas = JSON.parse(localStorage.getItem('finance_entradas'));
const savedSaidas = JSON.parse(localStorage.getItem('finance_saidas'));

let state = {
    user: JSON.parse(localStorage.getItem('finance_user')) || null,
    entradas: (savedEntradas && savedEntradas.length > 0) ? savedEntradas : dummyEntradas,
    saidas: (savedSaidas && savedSaidas.length > 0) ? savedSaidas : dummySaidas
};

const saveState = () => {
    localStorage.setItem('finance_user', JSON.stringify(state.user));
    localStorage.setItem('finance_entradas', JSON.stringify(state.entradas));
    localStorage.setItem('finance_saidas', JSON.stringify(state.saidas));
};

// Utils
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Components
const LoginView = () => `
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h1>Financeiro</h1>
                <p>Entre para gerenciar suas contas</p>
            </div>
            <form id="login-form">
                <div class="form-group">
                    <label>Usuário</label>
                    <input type="text" id="username" placeholder="admin" required>
                </div>
                <div class="form-group">
                    <label>Senha</label>
                    <input type="password" id="password" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn-primary">Acessar Sistema</button>
            </form>
        </div>
    </div>
`;

const DashboardView = () => {
    const totalEntradas = state.entradas.reduce((acc, curr) => acc + parseFloat(curr.valor), 0);
    const totalSaidas = state.saidas.reduce((acc, curr) => acc + parseFloat(curr.valor), 0);
    const saldo = totalEntradas - totalSaidas;

    return `
    <div class="dashboard-container">
        <header class="nav-header">
            <div class="brand">
                <h1 style="font-size: 1.5rem; font-weight: 700;">Dashboard <span style="color: var(--primary);">Financeiro</span></h1>
            </div>
            <div class="user-info">
                <span>Olá, <strong>${state.user.username}</strong></span>
                <button class="logout-btn" id="logout-btn">Sair</button>
            </div>
        </header>

        <div class="summary-grid">
            <div class="summary-card accent">
                <span class="summary-label">Total Entradas</span>
                <div class="summary-value">${formatCurrency(totalEntradas)}</div>
            </div>
            <div class="summary-card danger">
                <span class="summary-label">Total Saídas</span>
                <div class="summary-value">${formatCurrency(totalSaidas)}</div>
            </div>
            <div class="summary-card primary">
                <span class="summary-label">Saldo Líquido</span>
                <div class="summary-value">${formatCurrency(saldo)}</div>
            </div>
        </div>

        <div class="sections-grid">
            <!-- Entradas -->
            <section class="content-section">
                <div class="section-title">
                    <span>Entradas</span>
                    <span class="val-entrada" style="font-size: 1rem;">${formatCurrency(totalEntradas)}</span>
                </div>
                <form class="inline-form" id="entrada-form">
                    <input type="text" placeholder="Cliente" id="in-cliente" class="form-input-sm" required>
                    <input type="date" id="in-data" class="form-input-sm" required>
                    <select id="in-pagamento" class="form-input-sm" required>
                        <option value="">Forma Pagto</option>
                        <option value="Pix">Pix</option>
                        <option value="Cartão">Cartão</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Boleto">Boleto</option>
                    </select>
                    <input type="number" step="0.01" placeholder="Valor" id="in-valor" class="form-input-sm" required>
                    <button type="submit" class="btn-add">Adicionar</button>
                </form>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Pagamento</th>
                                <th>Valor</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.entradas.map((e, index) => `
                                <tr>
                                    <td>${e.cliente}</td>
                                    <td>${new Date(e.data).toLocaleDateString('pt-BR')}</td>
                                    <td>${e.pagamento}</td>
                                    <td class="val-entrada">${formatCurrency(e.valor)}</td>
                                    <td><button class="btn-delete" onclick="deleteEntrada(${index})">✕</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Saídas -->
            <section class="content-section">
                <div class="section-title">
                    <span>Saídas</span>
                    <span class="val-saida" style="font-size: 1rem;">${formatCurrency(totalSaidas)}</span>
                </div>
                <form class="inline-form" id="saida-form">
                    <select id="out-categoria" class="form-input-sm" required style="grid-column: span 2;">
                        <option value="">Selecione a Categoria</option>
                        <option value="Salários">Salários</option>
                        <option value="Comissões">Comissões</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Equipamento">Gasto de Equipamento</option>
                        <option value="Almoço/Lanche">Almoço e Lanche</option>
                        <option value="Combustível">Combustível</option>
                        <option value="Energia">Energia</option>
                        <option value="Imposto">Imposto</option>
                        <option value="Boleto">Pagamento de Boleto</option>
                    </select>
                    <input type="number" step="0.01" placeholder="Valor" id="out-valor" class="form-input-sm" required>
                    <button type="submit" class="btn-add">Adicionar</button>
                </form>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Categoria</th>
                                <th>Valor</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.saidas.map((s, index) => `
                                <tr>
                                    <td>${s.categoria}</td>
                                    <td class="val-saida">${formatCurrency(s.valor)}</td>
                                    <td><button class="btn-delete" onclick="deleteSaida(${index})">✕</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
    `;
};

// Render Logic
const render = () => {
    const app = document.getElementById('app');
    if (!state.user) {
        app.innerHTML = LoginView();
        setupLoginListeners();
    } else {
        app.innerHTML = DashboardView();
        setupDashboardListeners();
    }
};

// Event Listeners
const setupLoginListeners = () => {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            // Simple mock auth
            state.user = { username };
            saveState();
            render();
        });
    }
};

const setupDashboardListeners = () => {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        state.user = null;
        saveState();
        render();
    });

    document.getElementById('entrada-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const cliente = document.getElementById('in-cliente').value;
        const data = document.getElementById('in-data').value;
        const pagamento = document.getElementById('in-pagamento').value;
        const valor = document.getElementById('in-valor').value;

        state.entradas.unshift({ cliente, data, pagamento, valor });
        saveState();
        render();
    });

    document.getElementById('saida-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const categoria = document.getElementById('out-categoria').value;
        const valor = document.getElementById('out-valor').value;

        state.saidas.unshift({ categoria, valor });
        saveState();
        render();
    });
};

// Global delete functions (for simplicity in string templates)
window.deleteEntrada = (index) => {
    state.entradas.splice(index, 1);
    saveState();
    render();
};

window.deleteSaida = (index) => {
    state.saidas.splice(index, 1);
    saveState();
    render();
};

// Initialize
render();

/**
 * account.js — Studio Mark & Print
 * Sistema de cuentas basado en localStorage
 */

const Auth = (() => {
    const USERS_KEY = 'smp_users';
    const SESSION_KEY = 'smp_session';

    function getUsers() {
        try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
    }

    function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

    function hashPassword(pw) {
        // Simple hash for demo (production should use bcrypt via backend)
        let hash = 0;
        for (let i = 0; i < pw.length; i++) {
            hash = ((hash << 5) - hash) + pw.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(16);
    }

    function register(name, email, password) {
        const users = getUsers();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { ok: false, error: 'An account with this email already exists.' };
        }
        const user = { id: Date.now().toString(), name, email, password: hashPassword(password), createdAt: new Date().toISOString(), orders: [] };
        users.push(user);
        saveUsers(users);
        setSession(user);
        return { ok: true, user };
    }

    function login(email, password) {
        const user = getUsers().find(u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === hashPassword(password)
        );
        if (!user) return { ok: false, error: 'Incorrect email or password.' };
        setSession(user);
        return { ok: true, user };
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'account.html';
    }

    function setSession(user) {
        const session = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function getSession() {
        try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
    }

    function isLoggedIn() { return !!getSession(); }

    function getCurrentUser() {
        const s = getSession();
        if (!s) return null;
        return getUsers().find(u => u.id === s.id) || null;
    }

    function updateProfile(id, updates) {
        const users = getUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return false;
        users[idx] = { ...users[idx], ...updates };
        saveUsers(users);
        setSession(users[idx]);
        return true;
    }

    function addOrder(order) {
        const session = getSession();
        if (!session) return;
        const users = getUsers();
        const user = users.find(u => u.id === session.id);
        if (user) {
            user.orders = user.orders || [];
            user.orders.unshift({ ...order, id: Date.now().toString(), date: new Date().toISOString() });
            saveUsers(users);
        }
    }

    return { register, login, logout, isLoggedIn, getSession, getCurrentUser, updateProfile, addOrder };
})();

// Auto-update header user name immediately to prevent "Log In" flicker on page refresh
(function updateHeaderAuthUI() {
    function apply() {
        try {
            const sessionStr = localStorage.getItem('smp_session');
            if (!sessionStr) return;
            const session = JSON.parse(sessionStr);
            if (session && session.name) {
                const firstName = session.name.split(' ')[0];
                document.querySelectorAll('.utility-btn').forEach(btn => {
                    if (btn.href && btn.href.includes('account.html')) {
                        const span = btn.querySelector('span');
                        if (span) span.textContent = firstName;
                    }
                });
            }
        } catch (e) {}
    }
    apply();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply);
    }
})();

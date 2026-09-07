/**
 * cart.js — Studio Mark & Print
 * Motor del carrito compartido entre todas las páginas
 */

const Cart = (() => {
    const STORAGE_KEY = 'smp_cart';

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        updateBadge();
        window.dispatchEvent(new Event('smp:cartUpdated'));
    }

    function addToCart(product) {
        // product: { id, name, price, qty, image, options }
        const cart = getCart();
        const existing = cart.find(i => i.id === product.id);
        if (existing) {
            existing.qty += product.qty || 1;
        } else {
            cart.push({ ...product, qty: product.qty || 1 });
        }
        saveCart(cart);
        showToast(`"${product.name}" added to cart!`);
    }

    function removeFromCart(id) {
        saveCart(getCart().filter(i => i.id !== id));
    }

    function updateQty(id, qty) {
        const cart = getCart();
        const item = cart.find(i => i.id === id);
        if (item) {
            if (qty <= 0) {
                removeFromCart(id);
                return;
            }
            item.qty = qty;
            saveCart(cart);
        }
    }

    function clearCart() {
        saveCart([]);
    }

    function getTotal() {
        return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
    }

    function getCount() {
        return getCart().reduce((sum, i) => sum + i.qty, 0);
    }

    function updateBadge() {
        const count = getCount();
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'flex';
        });
    }

    function showToast(msg) {
        let toast = document.getElementById('smp-cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'smp-cart-toast';
            toast.style.cssText = `
                position:fixed; bottom:2rem; right:2rem; z-index:9999;
                background:#0e3b2e; color:#fff; padding:0.9rem 1.4rem;
                border-radius:0.75rem; font-size:0.9rem; font-weight:600;
                box-shadow:0 8px 32px rgba(0,0,0,0.18);
                transform:translateY(100px); opacity:0;
                transition:transform 0.3s ease, opacity 0.3s ease;
                display:flex; align-items:center; gap:0.6rem;
            `;
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> ${msg}`;
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
        }, 2800);
    }

    // Init: update badge on load
    document.addEventListener('DOMContentLoaded', updateBadge);

    return { getCart, addToCart, removeFromCart, updateQty, clearCart, getTotal, getCount, updateBadge };
})();

let basePrice = 59, paperAdd = 0;

    document.querySelectorAll('[data-g]').forEach(el => {
      el.addEventListener('click', () => {
        const g = el.dataset.g;
        document.querySelectorAll(`[data-g="${g}"]`).forEach(s => s.classList.remove('sel'));
        el.classList.add('sel');
        const lbl = document.getElementById(`lbl-${g}`);
        if (lbl) lbl.textContent = el.dataset.lbl || el.dataset.v;
        if (g === 'qty') { basePrice = parseInt(el.dataset.price) || 0; updatePrice(); }
      });
    });

    function toggleDD(id) {
      const el = document.getElementById(id);
      const was = el.classList.contains('open');
      document.querySelectorAll('.dd').forEach(d => d.classList.remove('open'));
      if (!was) el.classList.add('open');
    }

    document.querySelectorAll('.dd-item').forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        const ddId = item.dataset.dd;
        document.querySelectorAll(`#${ddId} .dd-item`).forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const key = ddId.replace('dd-', '');
        document.getElementById(`val-${key}`).textContent = item.dataset.v.split('·')[0].trim();
        if (item.dataset.add !== undefined) { paperAdd = parseInt(item.dataset.add) || 0; updatePrice(); }
        document.getElementById(ddId).classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dd')) {
        document.querySelectorAll('.dd').forEach(d => d.classList.remove('open'));
      }
      if (!e.target.closest('.custom-size-card')) {
        const trigger = document.getElementById('sizes-trigger');
        if (trigger) trigger.classList.remove('open');
      }
    });

    const customCard = document.getElementById('sizes-trigger');
    if (customCard) {
      customCard.addEventListener('click', (e) => {
        if (!e.target.closest('.sp-item')) {
          customCard.classList.toggle('open');
        }
      });
    }

    document.querySelectorAll('.sp-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();

        const dim = item.dataset.dim;
        document.getElementById('custom-dim-label').innerHTML = `${dim} <span style="font-size:0.55rem;margin-left:0.2rem;">▼</span>`;

        const lblFull = `Personalizado (${dim})`;
        customCard.dataset.lbl = lblFull;

        const lbl = document.getElementById('lbl-size');
        if (lbl) lbl.textContent = lblFull;

        document.querySelectorAll(`[data-g="size"]`).forEach(s => s.classList.remove('sel'));
        customCard.classList.add('sel');

        customCard.classList.remove('open');
      });
    });

    function updatePrice() {
      const total = basePrice + paperAdd;
      const qtyEl = document.querySelector('[data-g="qty"].sel');
      const qty = qtyEl ? parseInt(qtyEl.dataset.v) : 250;
      const per = qty > 0 && total > 0 ? (total / qty).toFixed(2) : '—';
      document.getElementById('price-total').textContent = total > 0 ? `$${total}` : 'Cotizar';
      document.getElementById('price-per').textContent = total > 0 ? `$${per} por tarjeta` : 'Tarifa de volumen';
    }

    function handleContinue(btn) {
      btn.textContent = '✓ Procesando…';
      btn.style.background = '#1a5c45';
      setTimeout(() => { btn.textContent = 'Continuar → Subir diseño'; btn.style.background = ''; }, 1800);
    }

    /* Thumbnail gallery */
    function selectThumb(el) {
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('gsel'));
      el.classList.add('gsel');
    }

    /* Product tabs */
    function switchProdTab(tabId, btn) {
      document.querySelectorAll('.prod-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.prod-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('ptab-' + tabId);
      if (panel) panel.classList.add('active');
    }

    /* FAQ accordion */
    function toggleFaq(btn) {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    }

    /* ══ REVIEWS COMPONENT LOGIC ══ */
    const mockReviews = [
      { id: 1, rating: 5, title: "Fácil de diseñar", date: "Apr 14, 2026", name: "Carol p.", text: "Muy fácil de diseñar.", verified: true },
      { id: 2, rating: 5, title: "Es lo que esperas y más", date: "Apr 14, 2026", name: "JULIEN", text: "Simplemente no puedo reemplazar la calidad que Studio Mark Print provee. Mis tarjetas de presentación salieron firmes y brillantes. Puedo dejarlas donde sea sabiendo que van a gustar.", verified: true },
      { id: 3, rating: 5, title: "Tarjetas", date: "Apr 14, 2026", name: "Luis", text: "¡Se ven geniales!", verified: true },
      { id: 4, rating: 5, title: "¡Puedes contar con ellos!", date: "Apr 14, 2026", name: "robert p.", text: "Studio Mark Print nunca me ha fallado. La calidad siempre es excelente y su tiempo de entrega es increíble. Tengo la tendencia de olvidar hacer pedidos hasta el último momento y nunca decepcionan.", verified: true },
      { id: 5, rating: 5, title: "Perfecto", date: "Apr 14, 2026", name: "Masa K.", text: "Hice una tarjeta nueva con un nuevo diseño y funcionó perfecto en una foto que necesitaba usar. Muy simple, fácil de entender y la tarjeta salió perfecta como quería.", verified: true },
      { id: 6, rating: 4, title: "Buena calidad, ligero cambio de color", date: "Apr 12, 2026", name: "Sarah L.", text: "El grosor del papel de algodón es increíble. El verde salió un poco más oscuro que en mi pantalla, pero igual se ve muy profesional.", verified: true },
      { id: 7, rating: 3, title: "Ok, pero el envío tardó", date: "Apr 10, 2026", name: "David M.", text: "Las tarjetas están bien, exactamente lo que pedí en acabado mate. El envío tardó 2 días más de lo esperado en llegar.", verified: true },
      { id: 8, rating: 5, title: "Absolutamente impresionantes", date: "Apr 08, 2026", name: "Elena V.", text: "Pedí el acabado en Foil Dorado y ¡wow! Todos me preguntan dónde las mandé a hacer. 10/10.", verified: true },
      { id: 9, rating: 5, title: "El mejor valor", date: "Apr 05, 2026", name: "Mike T.", text: "No puedes superar este precio por 500 tarjetas. Definitivamente volveré a pedirlas cuando se me acaben.", verified: true },
      { id: 10, rating: 2, title: "Problemas con el corte redondo", date: "Apr 02, 2026", name: "Jenna", text: "Algunas de las esquinas redondas salieron un poco asimétricas en mi paquete. Aunque servicio al cliente ofreció reemplazarlas sin costo.", verified: true },
      { id: 11, rating: 5, title: "De primer nivel", date: "Mar 28, 2026", name: "Anna", text: "Un proceso muy fluido, desde que subí el archivo para impresión hasta recibir la caja.", verified: true },
      { id: 12, rating: 4, title: "Excelente servicio al cliente", date: "Mar 25, 2026", name: "Carlos", text: "Hubo un problema con la resolución de una de las imágenes de la tarjeta y me contactaron antes de imprimir. ¡Me ahorraron un dolor de cabeza!", verified: true }
    ];

    const distribution = { 5: 90, 4: 4, 3: 2, 2: 1, 1: 3 }; 
    const totalReviewsNum = 143347;

    let reState = {
      filterRating: null, 
      search: "",
      sort: "recent",
      page: 1,
      perPage: 5
    };

    function renderStarBars() {
      const el = document.getElementById('re-filters');
      if(el) {
        let html = '';
        [5, 4, 3, 2, 1].forEach(star => {
          const pct = distribution[star];
          const activeClass = reState.filterRating === star ? 'active' : '';
          html += `
            <div class="re-bar-row ${activeClass}" onclick="setReFilter(${star})">
              <div class="re-bar-label">${star} <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
              <div class="re-bar-track"><div class="re-bar-fill" style="width: ${pct}%"></div></div>
              <div class="re-bar-pct">${pct}%</div>
            </div>
          `;
        });
        el.innerHTML = html;
      }
    }

    function setReFilter(star) {
      if(reState.filterRating === star) {
        reState.filterRating = null; 
        document.getElementById('re-filter-select').value = "all";
      } else {
        reState.filterRating = star;
        document.getElementById('re-filter-select').value = star;
      }
      reState.page = 1;
      updateReviews();
    }

    function getStarsHtml(rating) {
      let h = '';
      for(let i=1; i<=5; i++) {
        if(i <= rating) h += `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
        else h += `<svg class="re-item-empty-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
      }
      return h;
    }

    function updateReviews() {
      let filtered = mockReviews.filter(r => {
        let matchR = reState.filterRating ? (r.rating === reState.filterRating) : true;
        let matchS = reState.search ? (r.title.toLowerCase().includes(reState.search.toLowerCase()) || r.text.toLowerCase().includes(reState.search.toLowerCase())) : true;
        return matchR && matchS;
      });

      if(reState.sort === 'high') filtered.sort((a,b) => b.rating - a.rating);
      if(reState.sort === 'low') filtered.sort((a,b) => a.rating - b.rating);
      if(reState.sort === 'recent') filtered.sort((a,b) => b.id - a.id); 

      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / reState.perPage) || 1;
      if (reState.page > totalPages) reState.page = totalPages;

      const start = (reState.page - 1) * reState.perPage;
      const paginated = filtered.slice(start, start + reState.perPage);

      const listEl = document.getElementById('re-list');
      const pagEl = document.getElementById('re-pagination');
      const countEl = document.getElementById('re-count-title');

      renderStarBars();

      if(totalItems === 0) {
        listEl.innerHTML = `
          <div class="re-zero">
            <div class="re-zero-icon">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path></svg>
            </div>
            <div class="re-zero-title">¡Vaya! No encontramos reseñas</div>
            <div class="re-zero-text">No hay resultados para estos filtros. Intenta buscar otra cosa o limpiar los filtros.</div>
            <button class="re-write-btn" style="max-width:200px; margin:0 auto;" onclick="clearReFilters()">Limpiar Filtros</button>
          </div>
        `;
        pagEl.innerHTML = '';
        countEl.textContent = `0 reseñas encontradas`;
        return;
      }

      let titleTxt = `Valorado por ${totalItems < 12 ? totalItems : "143,347"} clientes`;
      if(reState.search || reState.filterRating) titleTxt = `Mostrando ${totalItems} resultados`;
      countEl.textContent = titleTxt;

      let html = '';
      paginated.forEach(r => {
        html += `
          <div class="re-item">
            <div class="re-item-stars">${getStarsHtml(r.rating)} ${r.rating}</div>
            <div class="re-item-title">${r.title}</div>
            <div class="re-item-meta">
              <span>${r.date} | ${r.name}</span>
              ${r.verified ? `<span class="re-item-verified"><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Comprador Verificado</span>` : ''}
            </div>
            <div class="re-item-text">${r.text}</div>
          </div>
        `;
      });
      listEl.innerHTML = html;

      let startIdx = start + 1;
      let endIdx = Math.min(start + reState.perPage, totalItems);
      let phtml = `<div class="re-page-info">Mostrando ${startIdx}-${endIdx} de ${totalItems} reseñas</div>`;
      
      const prevClass = reState.page === 1 ? 'disabled' : '';
      phtml += `<button class="re-page-btn ${prevClass}" onclick="changeRePage(-1)">‹</button>`;
      
      for(let i=1; i<=totalPages; i++) {
        if(i === 1 || i === totalPages || (i >= reState.page - 1 && i <= reState.page + 1)) {
           phtml += `<button class="re-page-btn ${i === reState.page ? 'active' : ''}" onclick="gotoRePage(${i})">${i}</button>`;
        } else if(i === reState.page - 2 || i === reState.page + 2) {
           phtml += `<div style="color:var(--ink-soft); padding: 0 0.5rem;">...</div>`;
        }
      }

      const nextClass = reState.page === totalPages ? 'disabled' : '';
      phtml += `<button class="re-page-btn ${nextClass}" onclick="changeRePage(1)">›</button>`;
      pagEl.innerHTML = phtml;
    }

    function changeRePage(dir) {
      const max = Math.ceil(mockReviews.filter(r => {
        let matchR = reState.filterRating ? (r.rating === reState.filterRating) : true;
        let matchS = reState.search ? (r.title.toLowerCase().includes(reState.search.toLowerCase()) || r.text.toLowerCase().includes(reState.search.toLowerCase())) : true;
        return matchR && matchS;
      }).length / reState.perPage);
      let newP = reState.page + dir;
      if(newP >= 1 && newP <= max) { gotoRePage(newP); }
    }
    
    function gotoRePage(p) {
      reState.page = p;
      updateReviews();
      const el = document.getElementById('re-count-title');
      if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }

    function clearReFilters() {
      reState.filterRating = null;
      reState.search = "";
      document.getElementById('re-search').value = "";
      document.getElementById('re-filter-select').value = "all";
      updateReviews();
    }

    window.addEventListener('DOMContentLoaded', () => {
      const reSearchEl = document.getElementById('re-search');
      if (reSearchEl) {
        reSearchEl.addEventListener('input', (e) => {
          reState.search = e.target.value;
          reState.page = 1;
          updateReviews();
        });
      }
      const reFilterEl = document.getElementById('re-filter-select');
      if (reFilterEl) {
        reFilterEl.addEventListener('change', (e) => {
          reState.filterRating = e.target.value === 'all' ? null : parseInt(e.target.value);
          reState.page = 1;
          updateReviews();
        });
      }
      const reSortEl = document.getElementById('re-sort');
      if (reSortEl) {
        reSortEl.addEventListener('change', (e) => {
          reState.sort = e.target.value;
          reState.page = 1;
          updateReviews();
        });
      }
      updateReviews();
    });

    let reModalRating = 0;
    
    function openReModal() {
      document.getElementById('re-modal').classList.add('open');
      selectReStar(5);
    }
    
    function closeReModal() {
      document.getElementById('re-modal').classList.remove('open');
      document.getElementById('re-form').reset();
    }
    
    function selectReStar(val) {
      reModalRating = val;
      document.querySelectorAll('#re-star-selector svg').forEach((svg, i) => {
        if(i < val) svg.classList.add('active');
        else svg.classList.remove('active');
      });
    }
    
    function submitReForm(e) {
      e.preventDefault();
      const title = document.getElementById('re-f-title').value;
      const text = document.getElementById('re-f-text').value;
      const name = document.getElementById('re-f-name').value;
      
      const newReview = {
        id: mockReviews.length > 0 ? Math.max(...mockReviews.map(r => r.id)) + 1 : 1,
        rating: reModalRating,
        title: title,
        date: new Date().toLocaleDateString('en-US', {month:'short', day:'2-digit', year:'numeric'}),
        name: name,
        text: text,
        verified: true
      };
      
      mockReviews.unshift(newReview);
      
      const btn = document.querySelector('.re-submit-btn');
      btn.textContent = 'Enviando...';
      
      setTimeout(() => {
        clearReFilters(); 
        closeReModal();
        btn.textContent = 'Enviar Reseña';
        const el = document.getElementById('re-count-title');
        if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
      }, 700);
    }
  
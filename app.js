(function() {
  'use strict';

  // ==================== STATE ====================
  var state = {
    lang: 'es',
    restaurant: null,
    categories: [],
    currentCategory: null,
    currentModalItem: null,
    subObserver: null,
    suppressObserverUntil: 0
  };

  // ==================== TRANSLATIONS ====================
  var UI = {
    es: {
      search_placeholder: '¿Qué tenés ganas de tomar?',
      allergens_title: 'Alérgenos:',
      no_results: 'No encontramos resultados',
      search_hint: 'Buscá tu bebida o plato favorito',
      featured: '⭐ Recomendado',
      from: 'Desde',
      no_items: 'No hay platos disponibles',
      qa_wifi: 'Wi-Fi',
      wifi_network: 'Red',
      wifi_password: 'Contraseña',
      wifi_copy: 'Copiar',
      wifi_copied: '✓ Copiado',
      qa_instagram: 'Instagram',
      qa_whatsapp: 'WhatsApp'
    },
    en: {
      search_placeholder: 'What are you in the mood for?',
      allergens_title: 'Allergens:',
      no_results: 'No results found',
      search_hint: 'Search for your favorite drink or dish',
      featured: '⭐ Recommended',
      from: 'From',
      no_items: 'No dishes available',
      qa_wifi: 'Wi-Fi',
      wifi_network: 'Network',
      wifi_password: 'Password',
      wifi_copy: 'Copy',
      wifi_copied: '✓ Copied',
      qa_instagram: 'Instagram',
      qa_whatsapp: 'WhatsApp'
    }
  };

  var LABELS = {
    bestseller: { text: { es: 'Bestseller', en: 'Bestseller' }, class: 'label-bestseller' },
    nuevo: { text: { es: 'Nuevo', en: 'New' }, class: 'label-nuevo' },
    vegano: { text: { es: 'Vegano', en: 'Vegan' }, class: 'label-vegano' },
    vegetariano: { text: { es: 'Vegetariano', en: 'Vegetarian' }, class: 'label-vegetariano' },
    sin_gluten: { text: { es: 'Sin Gluten', en: 'Gluten Free' }, class: 'label-sin-gluten' },
    sin_lacteos: { text: { es: 'Sin Lácteos', en: 'Dairy Free' }, class: 'label-sin-lacteos' },
    sin_lactosa: { text: { es: 'Sin Lactosa', en: 'Lactose Free' }, class: 'label-sin-lactosa' },
    picante: { text: { es: 'Picante', en: 'Spicy' }, class: 'label-picante' },
    recomendado: { text: { es: 'Recomendado', en: 'Recommended' }, class: 'label-recomendado' }
  };

  var ALLERGENS = {
    gluten: { icon: '🌾', text: { es: 'Gluten', en: 'Gluten' } },
    huevos: { icon: '🥚', text: { es: 'Huevos', en: 'Eggs' } },
    lacteos: { icon: '🥛', text: { es: 'Lácteos', en: 'Dairy' } },
    frutos_cascara: { icon: '🌰', text: { es: 'Frutos de cáscara', en: 'Tree nuts' } },
    soja: { icon: '🫘', text: { es: 'Soja', en: 'Soy' } },
    cacahuetes: { icon: '🥜', text: { es: 'Cacahuetes', en: 'Peanuts' } },
    sesamo: { icon: '⚪', text: { es: 'Sésamo', en: 'Sesame' } }
  };

  // ==================== MENU DATA ====================
  var MENU_DATA = {
    restaurant: {
      name: { es: "Bauti's Café", en: "Bauti's Café" },
      tagline: { es: 'CAFÉ & BRUNCH', en: 'COFFEE & BRUNCH' },
      hero_image_url: 'images/hero.jpg',
      wifi_ssid: 'Bautis-Guest',
      wifi_password: 'bautis2025',
      instagram_url: 'https://instagram.com/bautiscafe',
      whatsapp_url: 'https://wa.me/5555555'
    },
    categories: [
      {
        id: 1,
        icon: '☕',
        name: { es: 'Bebidas Calientes', en: 'Hot Drinks' },
        image: 'images/cat-hot-drinks.jpg',
        subcategories: [{
          id: 101,
          name: { es: 'Café & Más', en: 'Coffee & More' },
          description: null,
          items: [
            { id: 1001, name: { es: 'Espresso', en: 'Espresso' }, description: { es: 'Intenso y aromático, doble shot', en: 'Intense and aromatic, double shot' }, prices: [{ price: 2.50 }], image_url: 'images/espresso.jpg', labels: ['bestseller'], allergens: [] },
            { id: 1002, name: { es: 'Americano', en: 'Americano' }, description: { es: 'Espresso alargado con agua caliente', en: 'Espresso with hot water' }, prices: [{ price: 3.00 }], image_url: 'images/espresso.jpg', labels: [], allergens: [] },
            { id: 1003, name: { es: 'Cappuccino', en: 'Cappuccino' }, description: { es: 'Espresso con leche espumada y arte latte', en: 'Espresso with steamed milk and latte art' }, prices: [{ price: 3.80 }], image_url: 'images/cappuccino.jpg', labels: ['recomendado'], allergens: ['lacteos'] },
            { id: 1004, name: { es: 'Flat White', en: 'Flat White' }, description: { es: 'Doble espresso con microespuma sedosa', en: 'Double espresso with silky microfoam' }, prices: [{ price: 4.20 }], image_url: 'images/latte.jpg', labels: ['nuevo'], allergens: ['lacteos'] },
            { id: 1005, name: { es: 'Latte', en: 'Latte' }, description: { es: 'Espresso suave con abundante leche cremosa', en: 'Smooth espresso with creamy steamed milk' }, prices: [{ price: 3.80 }], image_url: 'images/latte.jpg', labels: [], allergens: ['lacteos'] },
            { id: 1006, name: { es: 'Chai Latte', en: 'Chai Latte' }, description: { es: 'Té especiado con leche y canela', en: 'Spiced tea with milk and cinnamon' }, prices: [{ price: 4.00 }], image_url: null, labels: [], allergens: ['lacteos'] },
            { id: 1007, name: { es: 'Chocolate Caliente', en: 'Hot Chocolate' }, description: { es: 'Chocolate belga con leche y marshmallows', en: 'Belgian chocolate with milk and marshmallows' }, prices: [{ price: 4.50 }], image_url: null, labels: ['recomendado'], allergens: ['lacteos'] },
            { id: 1008, name: { es: 'Matcha Latte', en: 'Matcha Latte' }, description: { es: 'Matcha ceremonial con leche cremosa', en: 'Ceremonial matcha with creamy milk' }, prices: [{ price: 4.50 }], image_url: null, labels: ['vegano'], allergens: [] }
          ]
        }]
      },
      {
        id: 2,
        icon: '🧊',
        name: { es: 'Bebidas Frías', en: 'Cold Drinks' },
        image: 'images/cat-cold-drinks.jpg',
        subcategories: [{
          id: 201,
          name: { es: 'Fríos & Refrescantes', en: 'Cold & Refreshing' },
          description: null,
          items: [
            { id: 2001, name: { es: 'Iced Latte', en: 'Iced Latte' }, description: { es: 'Espresso frío con leche y hielo', en: 'Cold espresso with milk and ice' }, prices: [{ price: 4.00 }], image_url: 'images/cold-brew.jpg', labels: [], allergens: ['lacteos'] },
            { id: 2002, name: { es: 'Cold Brew', en: 'Cold Brew' }, description: { es: 'Café infusionado en frío 18 horas, suave y dulce', en: 'Cold-infused coffee 18 hours, smooth and sweet' }, prices: [{ price: 4.50 }], image_url: 'images/cold-brew.jpg', labels: ['bestseller'], allergens: [] },
            { id: 2003, name: { es: 'Frappé', en: 'Frappé' }, description: { es: 'Café batido con hielo y nata', en: 'Blended coffee with ice and cream' }, prices: [{ price: 5.00 }], image_url: null, labels: [], allergens: ['lacteos'] },
            { id: 2004, name: { es: 'Jugo de Naranja Natural', en: 'Fresh Orange Juice' }, description: { es: 'Recién exprimido, 100% natural', en: 'Freshly squeezed, 100% natural' }, prices: [{ price: 3.50 }], image_url: null, labels: ['vegano'], allergens: [] },
            { id: 2005, name: { es: 'Limonada', en: 'Lemonade' }, description: { es: 'Limonada casera con menta fresca', en: 'Homemade lemonade with fresh mint' }, prices: [{ price: 3.50 }], image_url: null, labels: ['vegano'], allergens: [] },
            { id: 2006, name: { es: 'Té Helado', en: 'Iced Tea' }, description: { es: 'Té negro con durazno y hielo', en: 'Black tea with peach and ice' }, prices: [{ price: 3.50 }], image_url: null, labels: [], allergens: [] },
            { id: 2007, name: { es: 'Espresso Tónico', en: 'Espresso Tonic' }, description: { es: 'Espresso sobre agua tónica con hielo', en: 'Espresso over tonic water with ice' }, prices: [{ price: 4.80 }], image_url: null, labels: ['nuevo'], allergens: [] }
          ]
        }]
      },
      {
        id: 3,
        icon: '🥐',
        name: { es: 'Pastelería', en: 'Pastries' },
        image: 'images/cat-pastries.jpg',
        subcategories: [{
          id: 301,
          name: { es: 'Horneados del Día', en: 'Baked Today' },
          description: { es: 'Todos nuestros productos son artesanales y horneados cada mañana', en: 'All our products are artisanal and baked every morning' },
          items: [
            { id: 3001, name: { es: 'Croissant', en: 'Croissant' }, description: { es: 'Mantequilla francesa, hojaldrado y crujiente', en: 'French butter, flaky and crispy' }, prices: [{ price: 2.80 }], image_url: 'images/croissant.jpg', labels: ['bestseller'], allergens: ['gluten', 'lacteos', 'huevos'] },
            { id: 3002, name: { es: 'Pain au Chocolat', en: 'Pain au Chocolat' }, description: { es: 'Croissant relleno de chocolate negro belga', en: 'Croissant filled with Belgian dark chocolate' }, prices: [{ price: 3.20 }], image_url: 'images/pain-au-chocolat.jpg', labels: ['recomendado'], allergens: ['gluten', 'lacteos', 'huevos'] },
            { id: 3003, name: { es: 'Muffin de Arándanos', en: 'Blueberry Muffin' }, description: { es: 'Esponjoso con arándanos frescos y crumble', en: 'Fluffy with fresh blueberries and crumble' }, prices: [{ price: 3.50 }], image_url: null, labels: [], allergens: ['gluten', 'lacteos', 'huevos'] },
            { id: 3004, name: { es: 'Cinnamon Roll', en: 'Cinnamon Roll' }, description: { es: 'Bollo de canela con glaseado de vainilla', en: 'Cinnamon bun with vanilla glaze' }, prices: [{ price: 3.80 }], image_url: null, labels: ['nuevo'], allergens: ['gluten', 'lacteos', 'huevos'] },
            { id: 3005, name: { es: 'Banana Bread', en: 'Banana Bread' }, description: { es: 'Pan de banana casero con nueces', en: 'Homemade banana bread with walnuts' }, prices: [{ price: 3.20 }], image_url: null, labels: [], allergens: ['gluten', 'huevos', 'frutos_cascara'] },
            { id: 3006, name: { es: 'Alfajor', en: 'Alfajor' }, description: { es: 'Alfajor artesanal de maicena con dulce de leche', en: 'Artisanal cornstarch alfajor with dulce de leche' }, prices: [{ price: 2.50 }], image_url: null, labels: [], allergens: ['gluten', 'lacteos'] }
          ]
        }]
      },
      {
        id: 4,
        icon: '🍳',
        name: { es: 'Brunch', en: 'Brunch' },
        image: 'images/cat-brunch.jpg',
        subcategories: [{
          id: 401,
          name: { es: 'Platos de Brunch', en: 'Brunch Plates' },
          description: { es: 'Disponible de 9:00 a 14:00', en: 'Available from 9:00 AM to 2:00 PM' },
          items: [
            { id: 4001, name: { es: 'Tostada de Palta', en: 'Avocado Toast' }, description: { es: 'Palta machacada sobre pan sourdough con huevo pochado', en: 'Smashed avocado on sourdough with poached egg' }, prices: [{ price: 8.50 }], image_url: 'images/avocado-toast.jpg', labels: ['bestseller'], allergens: ['gluten', 'huevos'] },
            { id: 4002, name: { es: 'Eggs Benedict', en: 'Eggs Benedict' }, description: { es: 'Huevos pochados sobre muffin inglés con salsa holandesa', en: 'Poached eggs on English muffin with hollandaise' }, prices: [{ price: 9.90 }], image_url: 'images/eggs-benedict.jpg', labels: ['recomendado'], allergens: ['gluten', 'huevos', 'lacteos'] },
            { id: 4003, name: { es: 'Shakshuka', en: 'Shakshuka' }, description: { es: 'Huevos en salsa de tomate especiada con pan', en: 'Eggs in spiced tomato sauce with bread' }, prices: [{ price: 8.90 }], image_url: null, labels: ['vegano'], allergens: ['gluten'] },
            { id: 4004, name: { es: 'Bowl de Açaí', en: 'Açaí Bowl' }, description: { es: 'Açaí con granola, banana, frutas y miel', en: 'Açaí with granola, banana, fruits and honey' }, prices: [{ price: 9.50 }], image_url: null, labels: ['vegano'], allergens: ['frutos_cascara'] },
            { id: 4005, name: { es: 'Bowl de Granola', en: 'Granola Bowl' }, description: { es: 'Granola casera con yogur griego y frutas de estación', en: 'Homemade granola with Greek yogurt and seasonal fruits' }, prices: [{ price: 7.50 }], image_url: null, labels: [], allergens: ['lacteos', 'frutos_cascara', 'gluten'] },
            { id: 4006, name: { es: 'Torrijas', en: 'French Toast' }, description: { es: 'Pan brioche con canela, maple y frutas frescas', en: 'Brioche bread with cinnamon, maple and fresh fruits' }, prices: [{ price: 8.90 }], image_url: null, labels: [], allergens: ['gluten', 'huevos', 'lacteos'] }
          ]
        }]
      },
      {
        id: 5,
        icon: '🥪',
        name: { es: 'Sándwiches', en: 'Sandwiches' },
        image: 'images/cat-sandwiches.jpg',
        subcategories: [{
          id: 501,
          name: { es: 'Para Almorzar', en: 'For Lunch' },
          description: null,
          items: [
            { id: 5001, name: { es: 'Club Sándwich', en: 'Club Sandwich' }, description: { es: 'Triple con pollo, bacon, lechuga, tomate y mayonesa', en: 'Triple with chicken, bacon, lettuce, tomato and mayo' }, prices: [{ price: 9.50 }], image_url: 'images/club-sandwich.jpg', labels: ['bestseller'], allergens: ['gluten', 'huevos'] },
            { id: 5002, name: { es: 'Panini Caprese', en: 'Caprese Panini' }, description: { es: 'Mozzarella, tomate, albahaca y pesto en pan ciabatta', en: 'Mozzarella, tomato, basil and pesto on ciabatta' }, prices: [{ price: 7.90 }], image_url: null, labels: ['vegetariano'], allergens: ['gluten', 'lacteos'] },
            { id: 5003, name: { es: 'Croissant de Jamón y Queso', en: 'Ham & Cheese Croissant' }, description: { es: 'Croissant de mantequilla con jamón y gruyère', en: 'Butter croissant with ham and gruyère' }, prices: [{ price: 5.50 }], image_url: null, labels: [], allergens: ['gluten', 'lacteos', 'huevos'] },
            { id: 5004, name: { es: 'Tuna Melt', en: 'Tuna Melt' }, description: { es: 'Atún con cheddar derretido en pan de centeno', en: 'Tuna with melted cheddar on rye bread' }, prices: [{ price: 7.50 }], image_url: null, labels: [], allergens: ['gluten', 'lacteos'] },
            { id: 5005, name: { es: 'Wrap de Pollo', en: 'Chicken Wrap' }, description: { es: 'Pollo grillado con vegetales frescos y salsa de yogur', en: 'Grilled chicken with fresh veggies and yogurt sauce' }, prices: [{ price: 8.50 }], image_url: null, labels: [], allergens: ['gluten', 'lacteos'] }
          ]
        }]
      },
      {
        id: 6,
        icon: '🍰',
        name: { es: 'Tortas', en: 'Cakes' },
        image: 'images/cat-cakes.jpg',
        subcategories: [{
          id: 601,
          name: { es: 'Postres & Tortas', en: 'Desserts & Cakes' },
          description: { es: 'Porciones generosas, ideales para compartir', en: 'Generous portions, perfect for sharing' },
          items: [
            { id: 6001, name: { es: 'Cheesecake', en: 'Cheesecake' }, description: { es: 'New York style con coulis de frutos rojos', en: 'New York style with berry coulis' }, prices: [{ price: 5.90 }], image_url: 'images/cheesecake.jpg', labels: ['recomendado'], allergens: ['gluten', 'lacteos', 'huevos'] },
            { id: 6002, name: { es: 'Tiramisú', en: 'Tiramisu' }, description: { es: 'El clásico italiano con mascarpone y espresso', en: 'The Italian classic with mascarpone and espresso' }, prices: [{ price: 6.50 }], image_url: 'images/tiramisu.jpg', labels: ['bestseller'], allergens: ['gluten', 'lacteos', 'huevos'] },
            { id: 6003, name: { es: 'Torta de Zanahoria', en: 'Carrot Cake' }, description: { es: 'Húmeda con nueces y frosting de queso crema', en: 'Moist with walnuts and cream cheese frosting' }, prices: [{ price: 5.50 }], image_url: null, labels: [], allergens: ['gluten', 'huevos', 'lacteos', 'frutos_cascara'] },
            { id: 6004, name: { es: 'Brownie', en: 'Brownie' }, description: { es: 'Chocolate intenso con nueces y helado de vainilla', en: 'Intense chocolate with walnuts and vanilla ice cream' }, prices: [{ price: 5.50 }], image_url: 'images/brownie.jpg', labels: [], allergens: ['gluten', 'huevos', 'lacteos', 'frutos_cascara'] },
            { id: 6005, name: { es: 'Tarta de Limón', en: 'Lemon Tart' }, description: { es: 'Crema de limón con merengue italiano', en: 'Lemon curd with Italian meringue' }, prices: [{ price: 5.90 }], image_url: null, labels: [], allergens: ['gluten', 'huevos'] },
            { id: 6006, name: { es: 'Chocotorta', en: 'Chocotorta' }, description: { es: 'Torta argentina de chocolate y dulce de leche', en: 'Argentine chocolate and dulce de leche cake' }, prices: [{ price: 6.50 }], image_url: null, labels: ['nuevo'], allergens: ['gluten', 'lacteos'] }
          ]
        }]
      }
    ]
  };

  // ==================== HELPERS ====================
  function t(key) { return (UI[state.lang] || UI.es)[key] || UI.es[key]; }
  function txt(jsonb) {
    if (!jsonb) return '';
    if (typeof jsonb === 'string') return jsonb;
    return jsonb[state.lang] || jsonb.es || '';
  }
  function formatPrice(price) {
    return parseFloat(price).toFixed(2) + '€';
  }
  function fromPrice(prices) {
    return Math.min.apply(null, prices.map(function(p) { return parseFloat(p.price); }));
  }
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  function $(id) { return document.getElementById(id); }

  function showView(viewId) {
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
    $(viewId).classList.add('active');
    window.scrollTo(0, 0);
  }

  // ==================== RENDER: LANDING ====================
  function renderLanding() {
    var r = state.restaurant;

    var nameEl = document.querySelector('.restaurant-name');
    if (nameEl) nameEl.textContent = txt(r.name);

    var taglineEl = document.querySelector('.tagline');
    if (taglineEl) taglineEl.textContent = txt(r.tagline);

    var logoTop = document.querySelector('.hero-logo-top');
    if (logoTop) logoTop.textContent = "BAUTI'S";
    var logoBottom = document.querySelector('.hero-logo-bottom');
    if (logoBottom) logoBottom.textContent = 'CAFÉ';

    // Hero background
    var bgImg = document.getElementById('page-bg-img');
    if (bgImg) {
      if (r.hero_image_url) {
        bgImg.src = r.hero_image_url;
        bgImg.alt = '';
        document.body.classList.add('has-hero-bg');
      } else {
        bgImg.removeAttribute('src');
        document.body.classList.remove('has-hero-bg');
      }
    }

    // Wi-Fi
    var ssidEl = $('wifi-network-value');
    if (ssidEl) ssidEl.textContent = r.wifi_ssid || '';
    var pwdEl = $('wifi-password-value');
    if (pwdEl) pwdEl.textContent = r.wifi_password || '';

    // Instagram
    var igEl = $('qa-instagram');
    if (igEl && r.instagram_url) {
      igEl.setAttribute('href', r.instagram_url);
      var igLabel = $('qa-instagram-label');
      if (igLabel) {
        var m = r.instagram_url.match(/instagram\.com\/([^\/?#]+)/i);
        igLabel.textContent = (m && m[1]) ? '@' + m[1].replace(/\/+$/, '') : r.instagram_url;
      }
    }

    // WhatsApp
    var waEl = $('qa-whatsapp');
    if (waEl && r.whatsapp_url) waEl.setAttribute('href', r.whatsapp_url);

    applyQuickAccessLabels();

    // Search placeholder
    $('search-placeholder-text').textContent = t('search_placeholder');

    // Categories
    renderCategories();
  }

  function applyQuickAccessLabels() {
    var wf = $('qa-wifi-label');
    if (wf) wf.textContent = t('qa_wifi');
    var nLbl = $('wifi-network-label');
    var pLbl = $('wifi-password-label');
    if (nLbl) nLbl.textContent = t('wifi_network') + ':';
    if (pLbl) pLbl.textContent = t('wifi_password') + ':';
    var copyBtn = $('wifi-copy-btn');
    if (copyBtn && !copyBtn.classList.contains('copied')) copyBtn.textContent = t('wifi_copy');
    var waLbl = $('qa-whatsapp-label');
    if (waLbl) waLbl.textContent = t('qa_whatsapp');
  }

  function renderCategories() {
    var grid = $('categories-grid');
    grid.innerHTML = '';
    state.categories.forEach(function(cat, i) {
      var card = document.createElement('div');
      card.className = 'category-card stagger-item';
      card.style.animationDelay = (i * 50) + 'ms';

      var imgSrc = cat.image;
      var iconHtml = imgSrc
        ? '<img class="category-card-img" src="' + imgSrc + '" alt="' + escapeHtml(txt(cat.name)) + '">'
        : '<span class="category-icon">' + (cat.icon || '🍽️') + '</span>';

      card.innerHTML = iconHtml +
        '<span class="category-name">' + escapeHtml(txt(cat.name)) + '</span>';
      card.addEventListener('click', function() { openCategory(cat); });
      grid.appendChild(card);
    });
  }

  // ==================== RENDER: CATEGORY ====================
  function openCategory(cat) {
    state.currentCategory = cat;
    $('category-title').textContent = txt(cat.name);

    if (state.subObserver) {
      state.subObserver.disconnect();
      state.subObserver = null;
    }

    var tabs = $('subcategory-tabs');
    var container = $('subcategories-container');
    tabs.innerHTML = '';
    container.innerHTML = '';

    var subs = cat.subcategories || [];
    var hasTabs = subs.length > 1;
    tabs.style.display = hasTabs ? '' : 'none';

    subs.forEach(function(sub, i) {
      if (hasTabs) {
        var tab = document.createElement('button');
        tab.className = 'subcategory-tab' + (i === 0 ? ' active' : '');
        tab.textContent = txt(sub.name);
        tab.dataset.target = 'subcat-' + sub.id;
        tab.addEventListener('click', function() { scrollToSubcategory(sub.id); });
        tabs.appendChild(tab);
      }

      var section = document.createElement('section');
      section.className = 'subcategory-section';
      section.id = 'subcat-' + sub.id;
      section.dataset.subId = String(sub.id);

      var titleHtml = hasTabs
        ? '<h3 class="subcategory-title">' + escapeHtml(txt(sub.name)) + '</h3>'
        : '';
      var descText = txt(sub.description);
      var noteHtml = descText
        ? '<p class="subcategory-note">' + escapeHtml(descText) + '</p>'
        : '';

      section.innerHTML = titleHtml + noteHtml + '<div class="items-list"></div>';
      container.appendChild(section);

      renderItemsInto(section.querySelector('.items-list'), sub.items || [], cat);
    });

    showView('category-view');

    if (hasTabs) {
      requestAnimationFrame(function() {
        alignStickyTabs();
        setupSubcategoryObserver();
      });
    }
  }

  function alignStickyTabs() {
    var header = document.querySelector('.category-header');
    var tabs = $('subcategory-tabs');
    if (header && tabs) tabs.style.top = header.offsetHeight + 'px';
  }

  function renderItemsInto(list, items, cat) {
    if (!items || items.length === 0) {
      list.innerHTML = '<p class="no-items">' + escapeHtml(t('no_items')) + '</p>';
      return;
    }
    items.forEach(function(item, i) {
      var card = document.createElement('div');
      card.className = 'item-card stagger-item' + (item.is_featured ? ' featured' : '');
      card.style.animationDelay = (i * 50) + 'ms';

      var priceHtml = '';
      if (item.prices && item.prices.length > 0) {
        if (item.prices.length === 1) {
          priceHtml = '<span class="item-price">' + formatPrice(item.prices[0].price) + '</span>';
        } else {
          priceHtml = item.prices.map(function(p) {
            var vn = p.variant_name ? txt(p.variant_name) : '';
            return '<span class="item-price" style="display:block;font-size:0.75rem;line-height:1.6"><span style="color:#aaa;font-weight:400;font-size:0.68rem">' + escapeHtml(vn) + (vn ? ' · ' : '') + '</span>' + formatPrice(p.price) + '</span>';
          }).join('');
        }
      }

      var labelsHtml = '';
      if (item.labels && item.labels.length > 0) {
        item.labels.forEach(function(lbl) {
          var labelConfig = LABELS[lbl];
          if (labelConfig) {
            labelsHtml += '<span class="label ' + labelConfig.class + '">' + (labelConfig.text[state.lang] || labelConfig.text.es) + '</span>';
          }
        });
      }

      var desc = txt(item.description);
      var thumbSrc = item.image_url;
      var imgHtml = thumbSrc
        ? '<img class="item-thumb" src="' + thumbSrc + '" alt="' + escapeHtml(txt(item.name)) + '" loading="lazy">'
        : '<div class="item-no-thumb">☕</div>';

      card.innerHTML = imgHtml +
        '<div class="item-info">' +
          '<div class="item-name-row">' +
            '<h4 class="item-name">' + escapeHtml(txt(item.name)) + '</h4>' +
            priceHtml +
          '</div>' +
          (desc ? '<p class="item-desc">' + escapeHtml(desc) + '</p>' : '') +
          (labelsHtml ? '<div class="item-labels">' + labelsHtml + '</div>' : '') +
        '</div>';

      card.addEventListener('click', function() { openItemModal(item, cat); });
      list.appendChild(card);
    });
  }

  // ==================== SUBCATEGORY TABS ====================
  function getStickyOffset() {
    var header = document.querySelector('.category-header');
    var tabs = $('subcategory-tabs');
    var h = header ? header.offsetHeight : 0;
    var tH = (tabs && tabs.style.display !== 'none') ? tabs.offsetHeight : 0;
    return h + tH;
  }

  function scrollToSubcategory(subId) {
    var section = document.getElementById('subcat-' + subId);
    if (!section) return;
    var offset = getStickyOffset() + 8;
    var y = section.getBoundingClientRect().top + window.pageYOffset - offset;
    setActiveTab(subId);
    state.suppressObserverUntil = Date.now() + 700;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function setActiveTab(subId) {
    var tabs = $('subcategory-tabs');
    var target = 'subcat-' + subId;
    var activeTab = null;
    tabs.querySelectorAll('.subcategory-tab').forEach(function(t) {
      var on = t.dataset.target === target;
      t.classList.toggle('active', on);
      if (on) activeTab = t;
    });
    if (activeTab) {
      var tabsEl = tabs;
      var targetLeft = activeTab.offsetLeft - (tabsEl.clientWidth / 2) + (activeTab.offsetWidth / 2);
      tabsEl.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }

  function setupSubcategoryObserver() {
    var sections = document.querySelectorAll('.subcategory-section');
    if (!sections.length) return;
    var topOffset = getStickyOffset() + 12;

    state.subObserver = new IntersectionObserver(function(entries) {
      if (Date.now() < state.suppressObserverUntil) return;
      var visible = entries
        .filter(function(e) { return e.isIntersecting; })
        .sort(function(a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (visible.length === 0) return;
      var subId = visible[0].target.dataset.subId;
      if (subId) setActiveTab(subId);
    }, {
      rootMargin: '-' + topOffset + 'px 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(function(s) { state.subObserver.observe(s); });
  }

  // ==================== MODAL ====================
  function openItemModal(item, cat) {
    state.currentModalItem = item;

    var displayImg = item.image_url;
    var img = $('modal-image');
    var placeholder = $('modal-image-placeholder');
    if (displayImg) {
      img.src = displayImg;
      img.alt = txt(item.name);
      img.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    }

    $('modal-title').textContent = txt(item.name);
    $('modal-description').textContent = txt(item.description) || '';

    // Extras
    renderModalExtras(cat);

    // Prices
    var pricesDiv = $('modal-prices');
    pricesDiv.innerHTML = '';
    if (item.prices && item.prices.length > 0) {
      if (item.prices.length === 1 && !item.prices[0].variant_name) {
        pricesDiv.innerHTML = '<span class="price-single">' + formatPrice(item.prices[0].price) + '</span>';
      } else {
        item.prices.forEach(function(p, idx) {
          var variantText = p.variant_name ? txt(p.variant_name) : '';
          var pill = document.createElement('div');
          pill.className = 'price-variant' + (idx === 0 ? ' active' : '');
          pill.innerHTML =
            (variantText ? '<span class="variant-name">' + escapeHtml(variantText) + '</span>' : '') +
            '<span class="variant-price">' + formatPrice(p.price) + '</span>';
          pill.addEventListener('click', function() { selectVariant(idx); });
          pricesDiv.appendChild(pill);
        });
      }
    }

    // Labels
    var labelsDiv = $('modal-labels');
    labelsDiv.innerHTML = '';
    if (item.labels && item.labels.length > 0) {
      item.labels.forEach(function(lbl) {
        var cfg = LABELS[lbl];
        if (cfg) {
          labelsDiv.innerHTML += '<span class="label ' + cfg.class + '">' + (cfg.text[state.lang] || cfg.text.es) + '</span>';
        }
      });
    }

    // Allergens
    var allergensSection = $('modal-allergens');
    var allergensList = $('allergens-list');
    allergensList.innerHTML = '';
    if (item.allergens && item.allergens.length > 0) {
      allergensSection.style.display = 'block';
      allergensSection.querySelector('.allergens-title').textContent = t('allergens_title');
      item.allergens.forEach(function(a) {
        var cfg = ALLERGENS[a];
        if (cfg) {
          var el = document.createElement('span');
          el.className = 'allergen-badge';
          el.innerHTML = cfg.icon + ' ' + (cfg.text[state.lang] || cfg.text.es);
          allergensList.appendChild(el);
        }
      });
    } else {
      allergensSection.style.display = 'none';
    }

    $('item-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    $('item-modal').classList.remove('active');
    document.body.style.overflow = '';
  }

  function selectVariant(idx) {
    var item = state.currentModalItem;
    if (!item || !item.prices || !item.prices[idx]) return;
    var price = item.prices[idx];

    var pills = $('modal-prices').querySelectorAll('.price-variant');
    pills.forEach(function(p, i) { p.classList.toggle('active', i === idx); });

    var variantImg = price.image_url || item.image_url;
    var img = $('modal-image');
    var placeholder = $('modal-image-placeholder');

    if (variantImg) {
      if (img.src !== variantImg) {
        img.classList.add('changing');
        setTimeout(function() {
          img.src = variantImg;
          img.style.display = 'block';
          placeholder.style.display = 'none';
          img.classList.remove('changing');
        }, 200);
      }
    } else {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    }
  }

  // Modal extras
  var CATEGORY_EXTRAS = {
    'bebidas calientes': [
      { name: 'Leche de avena', price: 0.80 },
      { name: 'Leche de almendra', price: 0.80 },
      { name: 'Shot extra de espresso', price: 1.00 },
      { name: 'Sirope de vainilla', price: 0.50 },
      { name: 'Sirope de caramelo', price: 0.50 }
    ],
    'hot drinks': [
      { name: 'Oat milk', price: 0.80 },
      { name: 'Almond milk', price: 0.80 },
      { name: 'Extra espresso shot', price: 1.00 },
      { name: 'Vanilla syrup', price: 0.50 },
      { name: 'Caramel syrup', price: 0.50 }
    ]
  };

  function categoryKey(cat) {
    if (!cat || !cat.name) return '';
    var raw = typeof cat.name === 'string' ? cat.name : (cat.name.es || cat.name.en || '');
    return raw.toLowerCase().trim();
  }

  function formatExtraPrice(price) {
    return parseFloat(price).toFixed(2).replace('.', ',') + '€';
  }

  function renderModalExtras(cat) {
    var container = $('modal-extras');
    if (!container) return;
    var key = categoryKey(cat);
    var extras = CATEGORY_EXTRAS[key];
    if (!extras || extras.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }
    container.style.display = '';

    var firstPrice = extras[0].price;
    var allSame = extras.length > 1 && extras.every(function(e) { return e.price === firstPrice; });

    var rowsHtml = extras.map(function(e) {
      var priceHtml = allSame
        ? ''
        : '<span class="extras-price">+' + formatExtraPrice(e.price) + '</span>';
      return '<li class="extras-row"><span class="extras-name">' + escapeHtml(e.name) + '</span>' + priceHtml + '</li>';
    }).join('');

    var allNoteHtml = allSame
      ? '<p class="extras-all-note">+' + formatExtraPrice(firstPrice) + ' each</p>'
      : '';

    container.innerHTML =
      '<button class="extras-toggle" id="extras-toggle" type="button" aria-expanded="false" aria-controls="extras-panel">' +
        '<span class="extras-toggle-left">' +
          '<span class="extras-toggle-icon" aria-hidden="true">+</span>' +
          '<span class="extras-toggle-label">Extras</span>' +
        '</span>' +
        '<span class="extras-toggle-arrow" aria-hidden="true">▾</span>' +
      '</button>' +
      '<div class="extras-panel" id="extras-panel" aria-hidden="true">' +
        allNoteHtml +
        '<ul class="extras-list">' + rowsHtml + '</ul>' +
      '</div>';

    var toggleBtn = $('extras-toggle');
    var panel = $('extras-panel');
    toggleBtn.addEventListener('click', function() {
      var open = panel.classList.toggle('open');
      toggleBtn.classList.toggle('is-open', open);
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  }

  // ==================== SEARCH ====================
  var searchDebounce = null;

  function openSearch() {
    showView('search-view');
    $('search-input').value = '';
    $('search-input').placeholder = t('search_placeholder');
    $('search-results').innerHTML = '';
    $('search-empty').style.display = 'flex';
    $('search-empty').querySelector('.search-empty-text').textContent = t('search_hint');
    setTimeout(function() { $('search-input').focus(); }, 100);
  }

  function handleSearch() {
    var q = $('search-input').value.trim();
    if (q.length < 2) {
      $('search-results').innerHTML = '';
      $('search-empty').style.display = 'flex';
      return;
    }
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(function() {
      var results = searchMenu(q);
      renderSearchResults(results, q);
    }, 300);
  }

  function searchMenu(query) {
    var q = query.toLowerCase();
    var results = [];
    state.categories.forEach(function(cat) {
      var matchedItems = [];
      (cat.subcategories || []).forEach(function(sub) {
        (sub.items || []).forEach(function(item) {
          var name = txt(item.name).toLowerCase();
          var desc = txt(item.description).toLowerCase();
          if (name.indexOf(q) !== -1 || desc.indexOf(q) !== -1) {
            matchedItems.push(item);
          }
        });
      });
      if (matchedItems.length > 0) {
        results.push({ name: cat.name, items: matchedItems });
      }
    });
    return results;
  }

  function renderSearchResults(categories, query) {
    var container = $('search-results');
    var empty = $('search-empty');
    container.innerHTML = '';

    if (!categories || categories.length === 0) {
      empty.style.display = 'flex';
      empty.querySelector('.search-empty-text').textContent = t('no_results');
      return;
    }

    empty.style.display = 'none';

    categories.forEach(function(cat) {
      var section = document.createElement('div');
      section.className = 'search-category';
      section.innerHTML = '<h3 class="search-category-title">' + escapeHtml(txt(cat.name)) + '</h3>';

      cat.items.forEach(function(item, i) {
        var priceHtml = '';
        if (item.prices && item.prices.length > 0) {
          if (item.prices.length === 1) {
            priceHtml = formatPrice(item.prices[0].price);
          } else {
            priceHtml = t('from') + ' ' + formatPrice(fromPrice(item.prices));
          }
        }

        var card = document.createElement('div');
        card.className = 'search-item stagger-item';
        card.style.animationDelay = (i * 50) + 'ms';
        card.innerHTML =
          '<div class="search-item-info">' +
            '<h4 class="search-item-name">' + escapeHtml(txt(item.name)) + '</h4>' +
            '<p class="search-item-desc">' + escapeHtml(txt(item.description) || '') + '</p>' +
          '</div>' +
          '<span class="search-item-price">' + priceHtml + '</span>';

        // Find parent category for extras
        var parentCat = state.categories.find(function(c) {
          return (c.subcategories || []).some(function(s) {
            return (s.items || []).some(function(it) { return it.id === item.id; });
          });
        }) || cat;

        card.addEventListener('click', function() { openItemModal(item, parentCat); });
        section.appendChild(card);
      });

      container.appendChild(section);
    });
  }

  // ==================== LANGUAGE ====================
  function changeLanguage(lang) {
    state.lang = lang;
    localStorage.setItem('menu_lang', lang);

    renderLanding();

    $('search-placeholder-text').textContent = t('search_placeholder');

    if ($('category-view').classList.contains('active') && state.currentCategory) {
      var cat = state.categories.find(function(c) { return c.id === state.currentCategory.id; });
      if (cat) {
        state.currentCategory = cat;
        $('category-title').textContent = txt(cat.name);
        openCategory(cat);
      }
    }
  }

  // ==================== INIT ====================
  function init() {
    state.lang = localStorage.getItem('menu_lang') || 'es';
    var langSelector = $('lang-selector');
    if (langSelector) langSelector.value = state.lang;

    state.restaurant = MENU_DATA.restaurant;
    state.categories = MENU_DATA.categories;
    renderLanding();

    // Wi-Fi
    var wifiBtn = $('qa-wifi');
    var wifiPanel = $('wifi-panel');
    var copyBtn = $('wifi-copy-btn');
    if (wifiBtn && wifiPanel) {
      wifiBtn.addEventListener('click', function() {
        var open = wifiPanel.classList.toggle('open');
        wifiBtn.classList.toggle('is-open', open);
        wifiBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        wifiPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
      });
    }
    if (copyBtn) {
      copyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var pwd = (state.restaurant && state.restaurant.wifi_password) || '';
        if (!pwd) return;
        try {
          navigator.clipboard.writeText(pwd);
        } catch (_) {
          var ta = document.createElement('textarea');
          ta.value = pwd;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (__) {}
          document.body.removeChild(ta);
        }
        copyBtn.classList.add('copied');
        copyBtn.textContent = t('wifi_copied');
        clearTimeout(copyBtn._resetTimer);
        copyBtn._resetTimer = setTimeout(function() {
          copyBtn.classList.remove('copied');
          copyBtn.textContent = t('wifi_copy');
        }, 2000);
      });
    }

    // Language selector
    if (langSelector) {
      langSelector.addEventListener('change', function(e) { changeLanguage(e.target.value); });
    }

    // Search
    $('search-trigger').addEventListener('click', openSearch);
    $('back-from-search').addEventListener('click', function() { showView('landing-view'); });
    $('search-input').addEventListener('input', handleSearch);

    // Back to landing
    $('back-to-landing').addEventListener('click', function() {
      if (state.subObserver) {
        state.subObserver.disconnect();
        state.subObserver = null;
      }
      showView('landing-view');
    });

    // Resize
    window.addEventListener('resize', function() {
      if ($('category-view').classList.contains('active')) alignStickyTabs();
    });

    // Modal close
    $('modal-close').addEventListener('click', closeModal);
    $('item-modal').addEventListener('click', function(e) {
      if (e.target === $('item-modal')) closeModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ==================== LANGUAGE PICKER ====================
  function initLangPicker() {
    var FLAGS = {
      es: '1f1ea-1f1f8',
      en: '1f1ec-1f1e7'
    };
    var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/';

    var picker = document.getElementById('lang-picker');
    var trigger = document.getElementById('lang-trigger');
    var menu = document.getElementById('lang-menu');
    var flagImg = document.getElementById('lang-flag-current');
    var select = document.getElementById('lang-selector');
    if (!picker || !trigger || !menu || !flagImg || !select) return;

    function setCurrentFlag(lang) {
      var code = FLAGS[lang];
      if (!code) return;
      flagImg.src = CDN + code + '.svg';
      flagImg.alt = lang.toUpperCase();
    }

    function openMenu() {
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      menu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      if (menu.hidden) openMenu(); else closeMenu();
    });

    menu.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-lang]');
      if (!btn) return;
      var lang = btn.dataset.lang;
      if (!FLAGS[lang]) return;
      select.value = lang;
      select.dispatchEvent(new Event('change'));
      setCurrentFlag(lang);
      closeMenu();
      trigger.focus();
    });

    document.addEventListener('click', function(e) {
      if (!menu.hidden && !picker.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !menu.hidden) {
        closeMenu();
        trigger.focus();
      }
    });

    var initialLang = localStorage.getItem('menu_lang') || 'es';
    setCurrentFlag(initialLang);
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initLangPicker(); init(); });
  } else {
    initLangPicker();
    init();
  }
})();

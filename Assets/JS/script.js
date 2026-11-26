/**
 * ============================================================
 * QUICKLOOK E-COMMERCE ENGINE
 * Production-ready modular client-side architecture
 * Developed by Het Jani
 * ============================================================
 */

(function () {
  'use strict';

  // --- APPLICATION STATE ---
  const state = {
    products: [],
    filteredProducts: [],
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    cart: [],
    wishlist: new Set(),
    appliedCoupon: null,
    breakdown: {
      subtotal: 0,
      itemCount: 0,
      discount: 0,
      shipping: 49,
      tax: 0,
      total: 0
    }
  };

  // Static fallback data in case frontend is run without API server
  const FALLBACK_PRODUCTS = [
    {
      id: "ql-prod-001",
      name: "Coconut & Almond Nourishing Shampoo",
      category: "shampoo",
      categoryLabel: "Shampoo",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviewCount: 124,
      image: "./Assets/Images/coconut-almond-cover-406x406.webp",
      hoverImage: "./Assets/Images/QL-PRODUCT-BG-06-scaled.webp",
      volume: "400ml",
      inStock: true,
      featured: true,
      description: "Deeply hydrates and restores dry, damaged strands. Enriched with natural cold-pressed coconut oil and sweet almond extract.",
      ingredients: ["Cold-Pressed Coconut Oil", "Sweet Almond Extract", "Pro-Vitamin B5", "Plant Keratin", "Aloe Vera Juice"],
      tags: ["bestseller", "natural", "sulfate-free"]
    },
    {
      id: "ql-prod-002",
      name: "Shikakai & Reetha Ayurvedic Shampoo",
      category: "shampoo",
      categoryLabel: "Shampoo",
      price: 299,
      originalPrice: 349,
      rating: 4.9,
      reviewCount: 89,
      image: "./Assets/Images/shikakai-reetha-shampoo-cover-406x406.webp",
      hoverImage: "./Assets/Images/HAIR-WASH-GIRL-01.webp",
      volume: "400ml",
      inStock: true,
      featured: true,
      description: "Traditional herbal formula that controls hair fall, strengthens hair roots, and provides lustrous shine without chemicals.",
      ingredients: ["Shikakai Extract", "Reetha (Soapnut)", "Amla", "Bhringraj", "Neem Leaf"],
      tags: ["ayurvedic", "hair-fall-control"]
    },
    {
      id: "ql-prod-003",
      name: "Sunscreen SPF 50 PA+++ Ultimate Shield",
      category: "sunscreen",
      categoryLabel: "Sunscreen",
      price: 359,
      originalPrice: 499,
      rating: 4.9,
      reviewCount: 210,
      image: "./Assets/Images/QL-PRODUCT-BG-01-scaled.webp",
      hoverImage: "./Assets/Images/QL-Model-06-scaled.webp",
      volume: "100g",
      inStock: true,
      featured: true,
      description: "Ultra-lightweight, non-greasy sunscreen offering broad-spectrum UVA & UVB protection with zero white cast.",
      ingredients: ["Zinc Oxide", "Titanium Dioxide", "Niacinamide (2%)", "Hyaluronic Acid", "Green Tea Extract"],
      tags: ["trending", "no-white-cast", "spf50"]
    },
    {
      id: "ql-prod-004",
      name: "Vitamin C Radiance & Glow Serum",
      category: "serum",
      categoryLabel: "Serums",
      price: 449,
      originalPrice: 599,
      rating: 4.7,
      reviewCount: 76,
      image: "./Assets/Images/QL-PRODUCT-BG-03-scaled.webp",
      hoverImage: "./Assets/Images/QL-SERUM-01.webp",
      volume: "30ml",
      inStock: true,
      featured: true,
      description: "Potent 15% Vitamin C formulation with Ferulic acid that fades dark spots, promotes collagen synthesis, and reveals glowing skin.",
      ingredients: ["Ethyl Ascorbic Acid (15%)", "Ferulic Acid (1%)", "Hyaluronic Acid", "Kakadu Plum Extract"],
      tags: ["glow", "anti-pigmentation", "serum"]
    },
    {
      id: "ql-prod-005",
      name: "Mango Leaf & Neem Clarifying Face Wash",
      category: "facewash",
      categoryLabel: "Face Wash",
      price: 249,
      originalPrice: 329,
      rating: 4.8,
      reviewCount: 95,
      image: "./Assets/Images/QL-PRODUCT-BG-02-scaled.webp",
      hoverImage: "./Assets/Images/QL-Model-04-scaled.webp",
      volume: "150ml",
      inStock: true,
      featured: true,
      description: "Gentle daily foaming cleanser enriched with organic mango leaf and neem that calms active breakouts and removes excess oil.",
      ingredients: ["Organic Mango Leaf Extract", "Neem Extract", "Tea Tree Oil", "Cucumber Hydrosol", "Glycerin"],
      tags: ["acne-control", "daily-cleanser"]
    },
    {
      id: "ql-prod-006",
      name: "Calming Lavender & Chamomile Body Wash",
      category: "bodywash",
      categoryLabel: "Body Wash",
      price: 279,
      originalPrice: 379,
      rating: 4.9,
      reviewCount: 112,
      image: "./Assets/Images/QL-PRODUCT-BG-05-scaled.webp",
      hoverImage: "./Assets/Images/QL-Model-05-scaled.webp",
      volume: "300ml",
      inStock: true,
      featured: false,
      description: "Transform your daily shower into a spa-like retreat. Gentle sulfate-free lather that leaves skin velvety smooth and relaxed.",
      ingredients: ["Lavender Essential Oil", "Chamomile Extract", "Shea Butter", "Aloe Barbadensis", "Vitamin E"],
      tags: ["spa", "moisturizing", "sulfate-free"]
    },
    {
      id: "ql-prod-007",
      name: "Hydrating Shea Butter & Ceramide Body Lotion",
      category: "lotion",
      categoryLabel: "Lotions",
      price: 329,
      originalPrice: 449,
      rating: 4.6,
      reviewCount: 63,
      image: "./Assets/Images/QL-PRODUCT-BG-04-scaled.webp",
      hoverImage: "./Assets/Images/QL-Model-02-scaled.webp",
      volume: "250ml",
      inStock: true,
      featured: false,
      description: "24-hour deep barrier hydration. Fast-absorbing, non-sticky lotion infused with 3 essential ceramides and pure African shea butter.",
      ingredients: ["Raw Shea Butter", "Ceramide Complex", "Cocoa Butter", "Oat Extract"],
      tags: ["deep-hydration", "barrier-repair"]
    },
    {
      id: "ql-prod-008",
      name: "De-Tan Walnut & Apricot Face Scrub",
      category: "facescrub",
      categoryLabel: "Face Scrub",
      price: 269,
      originalPrice: 349,
      rating: 4.7,
      reviewCount: 88,
      image: "./Assets/Images/SLIDER-4-PRD-FINAL-01.webp",
      hoverImage: "./Assets/Images/QL-PRODUCT-BG-02-scaled.webp",
      volume: "100g",
      inStock: true,
      featured: false,
      description: "Micro-exfoliating formula that buffs away dead skin cells, unclogs stubborn pores, and lifts tan without micro-tears.",
      ingredients: ["Finely Milled Walnut Shell Powder", "Apricot Kernel Oil", "Niacinamide", "Licorice Extract"],
      tags: ["de-tan", "exfoliating"]
    }
  ];

  // --- DOM SELECTORS ---
  const DOM = {
    productsGrid: document.getElementById('productsGrid'),
    productsCount: document.getElementById('productsCount'),
    sortSelect: document.getElementById('sortSelect'),
    categoryPills: document.querySelectorAll('.filter-pill'),
    searchInput: document.getElementById('searchInput'),
    searchToggleBtn: document.getElementById('searchToggleBtn'),
    cartCountBadge: document.getElementById('cartCountBadge'),
    wishlistCountBadge: document.getElementById('wishlistCountBadge'),
    cartHeaderCount: document.getElementById('cartHeaderCount'),
    cartItemsContainer: document.getElementById('cartItemsContainer'),
    shippingProgressText: document.getElementById('shippingProgressText'),
    shippingProgressBar: document.getElementById('shippingProgressBar'),
    couponInput: document.getElementById('couponInput'),
    applyCouponBtn: document.getElementById('applyCouponBtn'),
    couponMessage: document.getElementById('couponMessage'),
    summarySubtotal: document.getElementById('summarySubtotal'),
    summaryDiscount: document.getElementById('summaryDiscount'),
    discountLine: document.getElementById('discountLine'),
    appliedCouponCode: document.getElementById('appliedCouponCode'),
    summaryShipping: document.getElementById('summaryShipping'),
    summaryTax: document.getElementById('summaryTax'),
    summaryTotal: document.getElementById('summaryTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    checkoutTotalAmount: document.getElementById('checkoutTotalAmount'),
    checkoutForm: document.getElementById('checkoutForm'),
    orderSuccessView: document.getElementById('orderSuccessView'),
    wishlistItemsContainer: document.getElementById('wishlistItemsContainer'),
    wishlistHeaderCount: document.getElementById('wishlistHeaderCount'),
    quickViewModalBody: document.getElementById('quickViewModalBody'),
    quickViewModal: document.getElementById('quickViewModal'),
    appToast: document.getElementById('appToast'),
    toastMessage: document.getElementById('toastMessage')
  };

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, icon = 'fas fa-check-circle') {
    if (!DOM.appToast) return;
    DOM.toastMessage.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    const toast = new bootstrap.Toast(DOM.appToast, { delay: 2800 });
    toast.show();
  }

  // --- STORAGE HELPERS ---
  function loadStoredData() {
    try {
      const storedCart = localStorage.getItem('ql_cart');
      if (storedCart) state.cart = JSON.parse(storedCart);

      const storedWishlist = localStorage.getItem('ql_wishlist');
      if (storedWishlist) state.wishlist = new Set(JSON.parse(storedWishlist));

      const storedCoupon = localStorage.getItem('ql_coupon');
      if (storedCoupon) state.appliedCoupon = storedCoupon;
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
  }

  function saveStoredData() {
    try {
      localStorage.setItem('ql_cart', JSON.stringify(state.cart));
      localStorage.setItem('ql_wishlist', JSON.stringify(Array.from(state.wishlist)));
      if (state.appliedCoupon) {
        localStorage.setItem('ql_coupon', state.appliedCoupon);
      } else {
        localStorage.removeItem('ql_coupon');
      }
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  // --- API DATA FETCHING ---
  async function loadProducts() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('API response not ok');
      const json = await res.json();
      state.products = json.data && json.data.length ? json.data : FALLBACK_PRODUCTS;
    } catch (err) {
      console.info('Using client-side catalog data:', err.message);
      state.products = FALLBACK_PRODUCTS;
    }
    applyFiltersAndSort();
  }

  // --- FILTER & SORT LOGIC ---
  function applyFiltersAndSort() {
    let result = [...state.products];

    // Filter by Category
    if (state.activeCategory !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === state.activeCategory.toLowerCase());
    }

    // Filter by Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const tagMatch = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
        const ingMatch = p.ingredients && p.ingredients.some(i => i.toLowerCase().includes(q));
        return nameMatch || descMatch || tagMatch || ingMatch;
      });
    }

    // Sort Products
    switch (state.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    state.filteredProducts = result;
    renderProducts();
  }

  // --- RENDER PRODUCTS GRID ---
  function renderProducts() {
    if (!DOM.productsGrid) return;

    if (DOM.productsCount) {
      DOM.productsCount.textContent = `Showing ${state.filteredProducts.length} of ${state.products.length} products`;
    }

    if (state.filteredProducts.length === 0) {
      DOM.productsGrid.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-search mb-3 text-muted" style="font-size: 2.5rem;"></i>
          <h5 class="text-dark fw-bold">No products found</h5>
          <p class="text-muted">Try clearing your search query or choosing another category.</p>
          <button type="button" class="btn btn-outline-dark btn-sm rounded-pill px-3" id="resetFiltersBtn">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.activeCategory = 'all';
          state.searchQuery = '';
          if (DOM.searchInput) DOM.searchInput.value = '';
          updateActivePill('all');
          applyFiltersAndSort();
        });
      }
      return;
    }

    DOM.productsGrid.innerHTML = state.filteredProducts.map(p => {
      const isWishlisted = state.wishlist.has(p.id);
      return `
        <div class="col">
          <div class="product-card" data-product-id="${p.id}">
            <div class="product-image-wrapper">
              ${p.featured ? '<span class="product-badge-tag">Bestseller</span>' : ''}
              <button type="button" class="heart-toggle-btn ${isWishlisted ? 'active' : ''}" data-action="toggle-wishlist" data-id="${p.id}" title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                <i class="${isWishlisted ? 'fas fa-heart' : 'far fa-heart'}"></i>
              </button>
              <img src="${p.image}" alt="${p.name}" class="img-fluid" loading="lazy">
              <button type="button" class="btn-quickview" data-action="quickview" data-id="${p.id}">
                Quick View
              </button>
            </div>
            <div class="product-details">
              <span class="product-category-text">${p.categoryLabel || p.category}</span>
              <h4>${p.name}</h4>
              <div class="product-rating">
                <span>★ ${p.rating}</span>
                <span class="review-count">(${p.reviewCount} reviews)</span>
              </div>
              <div class="price-box">
                <span class="current-price">₹${p.price.toFixed(2)}</span>
                ${p.originalPrice ? `<span class="original-price">₹${p.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <button type="button" class="btn-add-cart-card" data-action="add-cart" data-id="${p.id}">
                <i class="fas fa-shopping-cart"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- CART MANAGEMENT ---
  function addToCart(productId, quantity = 1) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }

    saveStoredData();
    calculateBreakdown();
    renderCart();
    showToast(`Added <strong>${product.name}</strong> to your cart!`);

    // Auto-open offcanvas drawer for intuitive feedback
    const cartOffcanvasEl = document.getElementById('cartOffcanvas');
    if (cartOffcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartOffcanvasEl);
      bsOffcanvas.show();
    }
  }

  function updateCartQuantity(productId, newQty) {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = state.cart.find(i => i.id === productId);
    if (item) {
      item.quantity = newQty;
      saveStoredData();
      calculateBreakdown();
      renderCart();
    }
  }

  function removeFromCart(productId) {
    const item = state.cart.find(i => i.id === productId);
    state.cart = state.cart.filter(i => i.id !== productId);
    saveStoredData();
    calculateBreakdown();
    renderCart();
    if (item) showToast(`Removed <strong>${item.name}</strong> from cart.`, 'fas fa-info-circle');
  }

  // --- ORDER BREAKDOWN & PRICING LOGIC ---
  function calculateBreakdown() {
    const items = state.cart;
    const itemCount = items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
    const subtotal = items.reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity)), 0);

    let discount = 0;
    let couponError = null;

    if (state.appliedCoupon) {
      const code = state.appliedCoupon.toUpperCase();
      if (code === 'WELCOME10') {
        if (subtotal >= 299) {
          discount = Math.round(subtotal * 0.10);
        } else {
          couponError = 'WELCOME10 requires minimum order of ₹299';
        }
      } else if (code === 'QUICKLOOK20') {
        if (subtotal >= 599) {
          discount = Math.round(subtotal * 0.20);
        } else {
          couponError = 'QUICKLOOK20 requires minimum order of ₹599';
        }
      } else if (code === 'FREESHIP') {
        // Handled in shipping
      } else {
        couponError = 'Invalid coupon code';
      }
    }

    const freeShippingThreshold = 499;
    let shipping = subtotal >= freeShippingThreshold || (state.appliedCoupon === 'FREESHIP') ? 0 : 49;
    if (subtotal === 0) shipping = 0;

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round((taxableAmount * 5) / 100); // 5% GST
    const total = taxableAmount + shipping + tax;

    state.breakdown = {
      subtotal,
      itemCount,
      discount,
      shipping,
      tax,
      total,
      couponError
    };

    updateBadgeCounters();
    updateCartSummaryUI();
  }

  // --- RENDER CART DRAWER ---
  function renderCart() {
    if (!DOM.cartItemsContainer) return;

    if (state.cart.length === 0) {
      DOM.cartItemsContainer.innerHTML = `
        <div class="text-center py-5">
          <i class="fas fa-shopping-basket text-muted mb-3" style="font-size: 3rem;"></i>
          <h5 class="fw-bold">Your cart is empty</h5>
          <p class="text-muted small">Explore our beauty essentials and treat your skin today!</p>
          <a href="#shop" class="btn btn-primary-custom btn-sm px-4" data-bs-dismiss="offcanvas">Start Shopping</a>
        </div>
      `;
      if (DOM.checkoutBtn) DOM.checkoutBtn.disabled = true;
      return;
    }

    DOM.cartItemsContainer.innerHTML = state.cart.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h6>${item.name}</h6>
          <div class="cart-item-price">₹${item.price} × ${item.quantity} = <strong>₹${(item.price * item.quantity).toFixed(2)}</strong></div>
          <div class="qty-stepper mt-2">
            <button type="button" class="qty-btn" data-action="qty-minus" data-id="${item.id}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button type="button" class="qty-btn" data-action="qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <button type="button" class="btn-remove-item" data-action="remove-item" data-id="${item.id}" title="Remove item">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');

    if (DOM.checkoutBtn) DOM.checkoutBtn.disabled = false;
  }

  function updateBadgeCounters() {
    const totalQty = state.cart.reduce((sum, i) => sum + i.quantity, 0);
    if (DOM.cartCountBadge) DOM.cartCountBadge.textContent = totalQty;
    if (DOM.cartHeaderCount) DOM.cartHeaderCount.textContent = totalQty;

    const wishlistCount = state.wishlist.size;
    if (DOM.wishlistCountBadge) DOM.wishlistCountBadge.textContent = wishlistCount;
    if (DOM.wishlistHeaderCount) DOM.wishlistHeaderCount.textContent = wishlistCount;
  }

  function updateCartSummaryUI() {
    const b = state.breakdown;
    if (DOM.summarySubtotal) DOM.summarySubtotal.textContent = `₹${b.subtotal.toFixed(2)}`;
    if (DOM.summaryShipping) DOM.summaryShipping.textContent = b.shipping === 0 ? 'FREE' : `₹${b.shipping.toFixed(2)}`;
    if (DOM.summaryTax) DOM.summaryTax.textContent = `₹${b.tax.toFixed(2)}`;
    if (DOM.summaryTotal) DOM.summaryTotal.textContent = `₹${b.total.toFixed(2)}`;
    if (DOM.checkoutTotalAmount) DOM.checkoutTotalAmount.textContent = `₹${b.total.toFixed(2)}`;

    // Discount Display
    if (b.discount > 0) {
      if (DOM.discountLine) DOM.discountLine.style.display = 'flex';
      if (DOM.appliedCouponCode) DOM.appliedCouponCode.textContent = state.appliedCoupon;
      if (DOM.summaryDiscount) DOM.summaryDiscount.textContent = `-₹${b.discount.toFixed(2)}`;
    } else {
      if (DOM.discountLine) DOM.discountLine.style.display = 'none';
    }

    // Free Shipping Progress
    const freeShippingTarget = 499;
    const progressPercent = Math.min(100, Math.round((b.subtotal / freeShippingTarget) * 100));
    if (DOM.shippingProgressBar) DOM.shippingProgressBar.style.width = `${progressPercent}%`;

    if (DOM.shippingProgressText) {
      if (b.subtotal >= freeShippingTarget || state.appliedCoupon === 'FREESHIP') {
        DOM.shippingProgressText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked FREE Shipping!`;
      } else {
        const remaining = freeShippingTarget - b.subtotal;
        DOM.shippingProgressText.innerHTML = `Add <strong>₹${remaining}</strong> more for <strong>FREE Shipping</strong>!`;
      }
    }
  }

  // --- WISHLIST MANAGEMENT ---
  function toggleWishlist(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    if (state.wishlist.has(productId)) {
      state.wishlist.delete(productId);
      showToast(`Removed <strong>${product.name}</strong> from wishlist.`, 'fas fa-heart-broken');
    } else {
      state.wishlist.add(productId);
      showToast(`Saved <strong>${product.name}</strong> to your wishlist!`, 'fas fa-heart text-danger');
    }

    saveStoredData();
    updateBadgeCounters();
    renderProducts();
    renderWishlist();
  }

  function renderWishlist() {
    if (!DOM.wishlistItemsContainer) return;

    const items = state.products.filter(p => state.wishlist.has(p.id));
    if (items.length === 0) {
      DOM.wishlistItemsContainer.innerHTML = `
        <div class="text-center py-5">
          <i class="far fa-heart text-muted mb-3" style="font-size: 3rem;"></i>
          <h5 class="fw-bold">Your wishlist is empty</h5>
          <p class="text-muted small">Tap the heart on any product to save your favorites here.</p>
        </div>
      `;
      return;
    }

    DOM.wishlistItemsContainer.innerHTML = items.map(p => `
      <div class="cart-item-row">
        <img src="${p.image}" alt="${p.name}">
        <div class="cart-item-info">
          <h6>${p.name}</h6>
          <div class="cart-item-price">₹${p.price.toFixed(2)}</div>
          <button type="button" class="btn btn-sm btn-primary-custom mt-2 px-3 py-1" data-action="wishlist-move-to-cart" data-id="${p.id}">
            Add to Cart
          </button>
        </div>
        <button type="button" class="btn-remove-item" data-action="remove-wishlist" data-id="${p.id}" title="Remove from wishlist">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }

  // --- QUICK VIEW MODAL ---
  function openQuickView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product || !DOM.quickViewModalBody) return;

    const isWishlisted = state.wishlist.has(product.id);

    DOM.quickViewModalBody.innerHTML = `
      <div class="row g-4 align-items-center">
        <div class="col-md-5 text-center">
          <div style="background: #F8F4EE; padding: 20px; border-radius: 10px;">
            <img src="${product.image}" alt="${product.name}" class="img-fluid" style="max-height: 280px; object-fit: contain;">
          </div>
        </div>
        <div class="col-md-7">
          <span class="badge bg-secondary mb-2" style="background-color: #BC8135 !important;">${product.categoryLabel || product.category}</span>
          <span class="badge bg-light text-dark border mb-2 ms-1">${product.volume || 'Standard Pack'}</span>
          <h3 class="fw-bold" style="color: #5E0A15;">${product.name}</h3>
          
          <div class="mb-3 text-warning">
            <span>★ ${product.rating}</span>
            <span class="text-muted small ms-2">(${product.reviewCount} verified customer reviews)</span>
          </div>

          <div class="d-flex align-items-baseline gap-2 mb-3">
            <span class="h3 fw-bold" style="color: #5E0A15;">₹${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="text-muted text-decoration-line-through">₹${product.originalPrice.toFixed(2)}</span>` : ''}
            <span class="badge bg-success">In Stock</span>
          </div>

          <p class="text-muted small mb-3">${product.description}</p>

          <div class="mb-3">
            <h6 class="fw-bold small text-uppercase" style="color: #5E0A15;">Key Botanical Ingredients:</h6>
            <div class="d-flex flex-wrap gap-1">
              ${(product.ingredients || []).map(i => `<span class="badge bg-light text-dark border">${i}</span>`).join('')}
            </div>
          </div>

          <div class="d-flex align-items-center gap-3 pt-3 border-top">
            <div class="qty-stepper">
              <button type="button" class="qty-btn" id="modalQtyMinus">-</button>
              <span class="qty-val" id="modalQtyVal">1</span>
              <button type="button" class="qty-btn" id="modalQtyPlus">+</button>
            </div>
            <button type="button" class="btn btn-primary-custom flex-grow-1" id="modalAddToCartBtn" data-id="${product.id}">
              <i class="fas fa-shopping-cart me-2"></i> Add to Cart
            </button>
            <button type="button" class="btn btn-outline-danger" id="modalWishlistBtn" data-id="${product.id}">
              <i class="${isWishlisted ? 'fas fa-heart text-danger' : 'far fa-heart'}"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Modal Qty controls
    let modalQty = 1;
    const qtyValEl = document.getElementById('modalQtyVal');
    document.getElementById('modalQtyMinus').addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty--;
        qtyValEl.textContent = modalQty;
      }
    });
    document.getElementById('modalQtyPlus').addEventListener('click', () => {
      modalQty++;
      qtyValEl.textContent = modalQty;
    });

    document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
      addToCart(product.id, modalQty);
      const modal = bootstrap.Modal.getInstance(DOM.quickViewModal);
      if (modal) modal.hide();
    });

    document.getElementById('modalWishlistBtn').addEventListener('click', () => {
      toggleWishlist(product.id);
      openQuickView(product.id); // Re-render modal wishlist button
    });

    const modal = bootstrap.Modal.getOrCreateInstance(DOM.quickViewModal);
    modal.show();
  }

  // --- CHECKOUT FORM SUBMISSION ---
  async function handleCheckoutSubmit(e) {
    e.preventDefault();

    if (state.cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const form = DOM.checkoutForm;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const customer = {
      fullName: document.getElementById('customerFullName').value.trim(),
      email: document.getElementById('customerEmail').value.trim(),
      phone: document.getElementById('customerPhone').value.trim(),
      pincode: document.getElementById('customerPincode').value.trim(),
      address: document.getElementById('customerAddress').value.trim()
    };

    const paymentOption = document.querySelector('input[name="paymentOption"]:checked')?.value || 'Cash On Delivery (COD)';

    const submitBtn = document.getElementById('placeOrderBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Processing Order...`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: state.cart,
          couponCode: state.appliedCoupon,
          paymentMethod: paymentOption
        })
      });

      let orderResult;
      if (res.ok) {
        const json = await res.json();
        orderResult = json.data;
      } else {
        // Fallback simulated order receipt if running purely static
        orderResult = {
          orderId: 'QL-ORD-' + Math.floor(100000 + Math.random() * 900000),
          trackingNumber: 'TRK-IND-' + Math.floor(10000000 + Math.random() * 90000000),
          estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toDateString(),
          paymentMethod: paymentOption
        };
      }

      // Show Success Receipt State
      document.getElementById('successOrderId').textContent = orderResult.orderId;
      document.getElementById('successTrackingId').textContent = orderResult.trackingNumber;
      document.getElementById('successDeliveryDate').textContent = orderResult.estimatedDelivery;
      document.getElementById('successPaymentMethod').textContent = orderResult.paymentMethod;

      form.style.display = 'none';
      DOM.orderSuccessView.style.display = 'block';

      // Clear Cart
      state.cart = [];
      state.appliedCoupon = null;
      saveStoredData();
      calculateBreakdown();
      renderCart();

      showToast(`Order <strong>${orderResult.orderId}</strong> confirmed!`, 'fas fa-check-double text-success');
    } catch (err) {
      console.error('Order error:', err);
      alert('Order could not be processed. Please check your connection.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Confirm & Place Order';
    }
  }

  // --- COUPON APPLICATION ---
  function applyCoupon() {
    const code = (DOM.couponInput.value || '').trim().toUpperCase();
    if (!code) return;

    state.appliedCoupon = code;
    calculateBreakdown();

    if (state.breakdown.couponError) {
      DOM.couponMessage.style.display = 'block';
      DOM.couponMessage.className = 'small text-danger mb-2';
      DOM.couponMessage.textContent = state.breakdown.couponError;
      state.appliedCoupon = null;
    } else {
      DOM.couponMessage.style.display = 'block';
      DOM.couponMessage.className = 'small text-success mb-2';
      DOM.couponMessage.textContent = `Coupon ${code} applied successfully!`;
      saveStoredData();
      showToast(`Coupon <strong>${code}</strong> applied!`, 'fas fa-tag text-success');
    }
  }

  // --- EVENT LISTENERS & DELEGATION ---
  function initEventListeners() {
    // Search Toggle & Real-time input
    if (DOM.searchToggleBtn && DOM.searchInput) {
      DOM.searchToggleBtn.addEventListener('click', () => {
        DOM.searchInput.classList.toggle('active');
        DOM.searchInput.focus();
      });

      // Real-time debounce search
      let searchTimeout;
      DOM.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          state.searchQuery = e.target.value;
          applyFiltersAndSort();
        }, 250);
      });
    }

    // Category Filter Pills
    const pillsContainer = document.getElementById('categoryFilterContainer');
    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;
        const category = pill.getAttribute('data-category');
        state.activeCategory = category;
        updateActivePill(category);
        applyFiltersAndSort();
      });
    }

    // Sort Dropdown
    if (DOM.sortSelect) {
      DOM.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        applyFiltersAndSort();
      });
    }

    // Navbar Category Dropdown Links
    document.querySelectorAll('.category-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.getAttribute('data-category');
        if (cat) {
          state.activeCategory = cat;
          updateActivePill(cat);
          applyFiltersAndSort();
          const shopSection = document.getElementById('shop');
          if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Beauty Essentials Cards (category jump)
    document.querySelectorAll('.beauty-essentials .category-card').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const titleText = card.querySelector('h5')?.innerText.trim().toLowerCase();
        let targetCategory = 'all';
        if (titleText.includes('shampoo')) targetCategory = 'shampoo';
        else if (titleText.includes('lotion')) targetCategory = 'lotion';
        else if (titleText.includes('serum')) targetCategory = 'serum';
        else if (titleText.includes('face wash')) targetCategory = 'facewash';
        else if (titleText.includes('body wash')) targetCategory = 'bodywash';
        else if (titleText.includes('sunscreen')) targetCategory = 'sunscreen';

        state.activeCategory = targetCategory;
        updateActivePill(targetCategory);
        applyFiltersAndSort();
        const shopSection = document.getElementById('shop');
        if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Explore All Button
    const exploreBtn = document.getElementById('exploreAllBtn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        state.activeCategory = 'all';
        state.searchQuery = '';
        if (DOM.searchInput) DOM.searchInput.value = '';
        updateActivePill('all');
        applyFiltersAndSort();
      });
    }

    // Spotlight Coupon Pill Click
    const couponPill = document.getElementById('spotlightCouponPill');
    if (couponPill) {
      couponPill.addEventListener('click', () => {
        if (DOM.couponInput) DOM.couponInput.value = 'WELCOME10';
        applyCoupon();
        showToast('Coupon <strong>WELCOME10</strong> applied to your cart!', 'fas fa-tag text-success');
        const cartOffcanvasEl = document.getElementById('cartOffcanvas');
        if (cartOffcanvasEl) {
          bootstrap.Offcanvas.getOrCreateInstance(cartOffcanvasEl).show();
        }
      });
    }

    // Global Delegated Click Handler for Products Grid & Drawers
    document.addEventListener('click', (e) => {
      // Add to cart from card
      const addCartBtn = e.target.closest('[data-action="add-cart"]');
      if (addCartBtn) {
        e.stopPropagation();
        const id = addCartBtn.getAttribute('data-id');
        addToCart(id, 1);
        return;
      }

      // Wishlist toggle
      const wishBtn = e.target.closest('[data-action="toggle-wishlist"]');
      if (wishBtn) {
        e.stopPropagation();
        const id = wishBtn.getAttribute('data-id');
        toggleWishlist(id);
        return;
      }

      // Quick View
      const quickViewBtn = e.target.closest('[data-action="quickview"]');
      if (quickViewBtn) {
        e.stopPropagation();
        const id = quickViewBtn.getAttribute('data-id');
        openQuickView(id);
        return;
      }

      // Cart Qty Plus
      const qtyPlusBtn = e.target.closest('[data-action="qty-plus"]');
      if (qtyPlusBtn) {
        const id = qtyPlusBtn.getAttribute('data-id');
        const item = state.cart.find(i => i.id === id);
        if (item) updateCartQuantity(id, item.quantity + 1);
        return;
      }

      // Cart Qty Minus
      const qtyMinusBtn = e.target.closest('[data-action="qty-minus"]');
      if (qtyMinusBtn) {
        const id = qtyMinusBtn.getAttribute('data-id');
        const item = state.cart.find(i => i.id === id);
        if (item) updateCartQuantity(id, item.quantity - 1);
        return;
      }

      // Cart Remove Item
      const removeBtn = e.target.closest('[data-action="remove-item"]');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        removeFromCart(id);
        return;
      }

      // Wishlist Move to Cart
      const moveCartBtn = e.target.closest('[data-action="wishlist-move-to-cart"]');
      if (moveCartBtn) {
        const id = moveCartBtn.getAttribute('data-id');
        addToCart(id, 1);
        state.wishlist.delete(id);
        saveStoredData();
        updateBadgeCounters();
        renderProducts();
        renderWishlist();
        return;
      }

      // Remove from wishlist drawer
      const removeWishBtn = e.target.closest('[data-action="remove-wishlist"]');
      if (removeWishBtn) {
        const id = removeWishBtn.getAttribute('data-id');
        toggleWishlist(id);
        return;
      }
    });

    // Apply Coupon Button
    if (DOM.applyCouponBtn) {
      DOM.applyCouponBtn.addEventListener('click', applyCoupon);
    }

    // Checkout Form Submit
    if (DOM.checkoutForm) {
      DOM.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    // Reset Checkout Modal when closed
    const checkoutModalEl = document.getElementById('checkoutModal');
    if (checkoutModalEl) {
      checkoutModalEl.addEventListener('hidden.bs.modal', () => {
        DOM.checkoutForm.style.display = 'block';
        DOM.checkoutForm.reset();
        DOM.checkoutForm.classList.remove('was-validated');
        DOM.orderSuccessView.style.display = 'none';
      });
    }

    // Initialize Carousels
    const heroCarouselEl = document.querySelector("#heroCarousel");
    if (heroCarouselEl && window.bootstrap) {
      new bootstrap.Carousel(heroCarouselEl, {
        interval: 4000,
        pause: "hover",
        ride: "carousel",
        wrap: true
      });
    }

    const blogCarouselEl = document.querySelector("#blogCarousel");
    if (blogCarouselEl && window.bootstrap) {
      new bootstrap.Carousel(blogCarouselEl, {
        interval: false,
        wrap: true
      });
    }
  }

  function updateActivePill(category) {
    document.querySelectorAll('.filter-pill').forEach(pill => {
      const cat = pill.getAttribute('data-category');
      if (cat === category) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // --- INITIALIZATION ---
  document.addEventListener("DOMContentLoaded", () => {
    loadStoredData();
    calculateBreakdown();
    renderCart();
    renderWishlist();
    initEventListeners();
    loadProducts();
  });

})();

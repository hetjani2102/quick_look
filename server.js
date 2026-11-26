const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { calculateOrderBreakdown, validateCheckoutData } = require('./services/orderService');

const app = express();
const PORT = process.env.PORT || 3000;

// Load initial product data
const productsFilePath = path.join(__dirname, 'data', 'products.json');
let products = [];
try {
  products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
} catch (err) {
  console.error('Failed to load products.json:', err);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Assets
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));
app.use(express.static(path.join(__dirname)));

/* ==========================================================
   REST API ROUTES
   ========================================================== */

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'QuickLook E-Commerce API'
  });
});

/**
 * GET /api/categories
 * Returns list of categories and product counts
 */
app.get('/api/categories', (req, res) => {
  const categoryMap = {};
  products.forEach(p => {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = {
        id: p.category,
        label: p.categoryLabel || p.category,
        count: 0
      };
    }
    categoryMap[p.category].count += 1;
  });

  res.json({
    success: true,
    data: Object.values(categoryMap)
  });
});

/**
 * GET /api/products
 * Query Params: category, search, sort, minPrice, maxPrice, featured
 */
app.get('/api/products', (req, res) => {
  const { category, search, sort, minPrice, maxPrice, featured } = req.query;

  let filtered = [...products];

  // Category filter
  if (category && category !== 'all') {
    const catLower = category.toLowerCase();
    filtered = filtered.filter(p => p.category.toLowerCase() === catLower);
  }

  // Search filter (name, description, ingredients, tags)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const tagMatch = p.tags && p.tags.some(t => t.toLowerCase().includes(q));
      const ingredientMatch = p.ingredients && p.ingredients.some(i => i.toLowerCase().includes(q));
      return nameMatch || descMatch || tagMatch || ingredientMatch;
    });
  }

  // Price range filters
  if (minPrice && !isNaN(Number(minPrice))) {
    filtered = filtered.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice));
  }

  // Featured filter
  if (featured === 'true') {
    filtered = filtered.filter(p => p.featured === true);
  }

  // Sorting
  if (sort) {
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
  }

  res.json({
    success: true,
    total: products.length,
    count: filtered.length,
    data: filtered
  });
});

/**
 * GET /api/products/:id
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with ID '${req.params.id}' not found`
    });
  }

  res.json({
    success: true,
    data: product
  });
});

/**
 * POST /api/cart/calculate
 * Calculates breakdown (subtotal, shipping, tax, discount)
 */
app.post('/api/cart/calculate', (req, res) => {
  const { items, couponCode } = req.body;
  const breakdown = calculateOrderBreakdown(items, couponCode);
  res.json({
    success: true,
    data: breakdown
  });
});

/**
 * POST /api/orders
 * Simulates checkout and order creation
 */
app.post('/api/orders', (req, res) => {
  const { customer, items, couponCode, paymentMethod } = req.body;

  // Validate items
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart cannot be empty for checkout'
    });
  }

  // Validate customer details
  const validation = validateCheckoutData(customer);
  if (!validation.isValid) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed for customer details',
      errors: validation.errors
    });
  }

  // Calculate authoritative order breakdown on the server
  const breakdown = calculateOrderBreakdown(items, couponCode);

  const orderId = 'QL-ORD-' + Math.floor(100000 + Math.random() * 900000);
  const trackingNumber = 'TRK-IND-' + Math.floor(10000000 + Math.random() * 90000000);
  const orderDate = new Date().toISOString();
  
  // Delivery date estimate (3-5 business days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);

  const orderReceipt = {
    orderId,
    trackingNumber,
    createdAt: orderDate,
    estimatedDelivery: deliveryDate.toDateString(),
    paymentMethod: paymentMethod || 'Cash On Delivery (COD)',
    customer: {
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      pincode: customer.pincode
    },
    items,
    breakdown
  };

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    data: orderReceipt
  });
});

/**
 * POST /api/contact
 */
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required'
    });
  }

  res.json({
    success: true,
    message: `Thank you ${name}! Your inquiry has been received. Our team will contact you at ${email} shortly.`
  });
});

// Fallback to index.html for client-side navigation
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 QuickLook E-Commerce Server active at http://localhost:${PORT}/`);
  console.log(`📦 REST API Endpoints active at http://localhost:${PORT}/api/products`);
});

const coupons = require('../data/coupons.json');

const STANDARD_SHIPPING_FEE = 49;
const FREE_SHIPPING_THRESHOLD = 499;
const GST_PERCENT = 5; // 5% GST for personal care cosmetics in India

/**
 * Calculates order subtotal, discount, shipping, tax, and final total.
 * @param {Array<{id: string, price: number, quantity: number}>} items 
 * @param {string|null} couponCode 
 * @returns {object} Calculated order breakdown
 */
function calculateOrderBreakdown(items = [], couponCode = '') {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      subtotal: 0,
      itemCount: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      appliedCoupon: null,
      error: 'Cart is empty'
    };
  }

  // Calculate items subtotal and count
  const itemCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);

  // Determine coupon discount
  let discount = 0;
  let appliedCoupon = null;
  let couponError = null;

  if (couponCode && typeof couponCode === 'string') {
    const cleanCode = couponCode.trim().toUpperCase();
    const found = coupons.find(c => c.code === cleanCode);

    if (!found) {
      couponError = 'Invalid coupon code';
    } else if (subtotal < found.minOrderAmount) {
      couponError = `Coupon requires a minimum order of ₹${found.minOrderAmount}`;
    } else {
      appliedCoupon = found;
      if (found.discountPercent > 0) {
        discount = Math.round((subtotal * found.discountPercent) / 100);
      }
    }
  }

  // Shipping calculation
  let shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  if (appliedCoupon && appliedCoupon.freeShipping) {
    shipping = 0;
  }

  // Tax calculation (5% GST calculated on discounted amount)
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round((taxableAmount * GST_PERCENT) / 100);

  // Final Total
  const total = taxableAmount + shipping + tax;

  return {
    subtotal,
    itemCount,
    discount,
    shipping,
    tax,
    total,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    appliedCoupon: appliedCoupon ? { code: appliedCoupon.code, description: appliedCoupon.description } : null,
    couponError
  };
}

/**
 * Validates checkout form data
 * @param {object} customer 
 * @returns {{isValid: boolean, errors: object}}
 */
function validateCheckoutData(customer = {}) {
  const errors = {};

  if (!customer.fullName || customer.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters long.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customer.email || !emailRegex.test(customer.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  const phoneDigits = (customer.phone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    errors.phone = 'Please provide a valid 10-digit mobile number.';
  }

  if (!customer.address || customer.address.trim().length < 10) {
    errors.address = 'Please provide a complete delivery address (min 10 characters).';
  }

  if (!customer.pincode || !/^\d{6}$/.test(customer.pincode.trim())) {
    errors.pincode = 'Please enter a valid 6-digit postal code.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  calculateOrderBreakdown,
  validateCheckoutData,
  STANDARD_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD
};

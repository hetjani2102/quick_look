const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateOrderBreakdown,
  validateCheckoutData,
  STANDARD_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD
} = require('../services/orderService');

describe('Order Service - Cart Calculations', () => {
  test('returns zero totals and error for empty cart', () => {
    const result = calculateOrderBreakdown([]);
    assert.equal(result.subtotal, 0);
    assert.equal(result.total, 0);
    assert.equal(result.error, 'Cart is empty');
  });

  test('calculates subtotal and item count correctly', () => {
    const items = [
      { id: '1', price: 299, quantity: 2 },
      { id: '2', price: 359, quantity: 1 }
    ];
    const result = calculateOrderBreakdown(items);
    assert.equal(result.itemCount, 3);
    assert.equal(result.subtotal, 957);
  });

  test('applies standard shipping fee for orders below free shipping threshold', () => {
    const items = [{ id: '1', price: 200, quantity: 1 }];
    const result = calculateOrderBreakdown(items);
    assert.equal(result.subtotal, 200);
    assert.equal(result.shipping, STANDARD_SHIPPING_FEE);
  });

  test('provides free shipping when subtotal is above threshold (₹499)', () => {
    const items = [{ id: '1', price: 500, quantity: 1 }];
    const result = calculateOrderBreakdown(items);
    assert.equal(result.shipping, 0);
  });

  test('applies WELCOME10 coupon (10% off) accurately', () => {
    const items = [{ id: '1', price: 300, quantity: 1 }];
    const result = calculateOrderBreakdown(items, 'WELCOME10');
    assert.equal(result.discount, 30);
    assert.equal(result.appliedCoupon.code, 'WELCOME10');
  });

  test('rejects coupon if order is below coupon minimum threshold', () => {
    const items = [{ id: '1', price: 100, quantity: 1 }];
    const result = calculateOrderBreakdown(items, 'WELCOME10');
    assert.equal(result.discount, 0);
    assert.match(result.couponError, /minimum order/i);
  });

  test('handles FREESHIP coupon waiving shipping on lower value order', () => {
    const items = [{ id: '1', price: 150, quantity: 1 }];
    const result = calculateOrderBreakdown(items, 'FREESHIP');
    assert.equal(result.shipping, 0);
  });
});

describe('Order Service - Checkout Validation', () => {
  test('validates valid customer data successfully', () => {
    const customer = {
      fullName: 'Het Jani',
      email: 'het@example.com',
      phone: '9876543210',
      address: '123 Marine Drive, South Tower, Mumbai',
      pincode: '400020'
    };
    const validation = validateCheckoutData(customer);
    assert.equal(validation.isValid, true);
    assert.deepEqual(validation.errors, {});
  });

  test('catches invalid email, short phone, and invalid pincode', () => {
    const customer = {
      fullName: 'Jo',
      email: 'not-an-email',
      phone: '123',
      address: 'Too short',
      pincode: 'abc'
    };
    const validation = validateCheckoutData(customer);
    assert.equal(validation.isValid, false);
    assert.ok(validation.errors.fullName);
    assert.ok(validation.errors.email);
    assert.ok(validation.errors.phone);
    assert.ok(validation.errors.address);
    assert.ok(validation.errors.pincode);
  });
});

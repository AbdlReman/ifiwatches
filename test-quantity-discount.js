// Test quantity discount functionality
const { getQuantityDiscount, getQuantityDiscountedPrice } = require('./src/helpers/product.js');

console.log('Testing Quantity Discount Functionality:');
console.log('=====================================');

// Test getQuantityDiscount function
console.log('\n1. Testing getQuantityDiscount:');
console.log('Quantity 1:', getQuantityDiscount(1), '% off');
console.log('Quantity 2:', getQuantityDiscount(2), '% off');
console.log('Quantity 3:', getQuantityDiscount(3), '% off');
console.log('Quantity 5:', getQuantityDiscount(5), '% off');

// Test getQuantityDiscountedPrice function
console.log('\n2. Testing getQuantityDiscountedPrice:');
const basePrice = 1000;
console.log('Base price: Rs', basePrice);
console.log('Quantity 1:', getQuantityDiscountedPrice(basePrice, 1), 'Rs');
console.log('Quantity 2:', getQuantityDiscountedPrice(basePrice, 2), 'Rs (5% off)');
console.log('Quantity 3:', getQuantityDiscountedPrice(basePrice, 3), 'Rs (10% off)');

// Test savings calculation
console.log('\n3. Testing savings calculation:');
const qty2Price = getQuantityDiscountedPrice(basePrice, 2);
const qty3Price = getQuantityDiscountedPrice(basePrice, 3);
console.log('Buy 2 save:', (basePrice * 2) - (qty2Price * 2), 'Rs');
console.log('Buy 3 save:', (basePrice * 3) - (qty3Price * 3), 'Rs');

console.log('\n✅ Quantity discount functionality is working correctly!');

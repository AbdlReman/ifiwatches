// Simple test to verify categoryMapper is working
const { hasCategory, getCategoryValues } = require('./src/helpers/categoryMapper.js');

console.log('Testing categoryMapper...');

// Test 1: Basic functionality
console.log('Test 1: getCategoryValues for menwatches');
console.log(getCategoryValues('menwatches'));

// Test 2: hasCategory with normal category
const testProduct1 = {
  id: '1',
  name: 'Test Watch',
  category: 'menwatches'
};

console.log('Test 2: hasCategory with normal category');
console.log('Product category:', testProduct1.category);
console.log('Has menwatches:', hasCategory(testProduct1, 'menwatches'));
console.log('Has womenwatches:', hasCategory(testProduct1, 'womenwatches'));

// Test 3: hasCategory with concatenated category
const testProduct2 = {
  id: '2',
  name: 'Problematic Product',
  category: 'casualwatcheschainsbraceletseyewearfashionfashionringsformalwatchesleatherstrapsluxurywatchesmagneticstrapsmensperfumesmenwatchesmetalstrapsmobileaccessoriesmobilegadgetsnylonstrapsopticalframespantjeansbuttonsperfumesringsaccessoriesshalwarkameezbuttonssiliconestrapssportswatchessunglassestshirtbuttonsunisexperfumesunisexwatchesusedmobileswatcheswatchstrapswomensperfumeswomenwatches'
};

console.log('Test 3: hasCategory with concatenated category');
console.log('Product category length:', testProduct2.category.length);
console.log('Has menwatches:', hasCategory(testProduct2, 'menwatches'));
console.log('Has womenwatches:', hasCategory(testProduct2, 'womenwatches'));
console.log('Has luxurywatches:', hasCategory(testProduct2, 'luxurywatches'));

console.log('All tests completed!'); 
// Test Tax API Endpoints
// Run: node test-tax-api.js

import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

// You need to replace this with a valid token from your stock login
const TEST_TOKEN = 'YOUR_STOCK_TOKEN_HERE';

async function testTaxAPI() {
  console.log('🧪 Testing Tax API Endpoints...\n');

  try {
    // Test 1: Create Tax
    console.log('1️⃣ Testing CREATE Tax...');
    const createResponse = await axios.post(
      `${API_URL}/stock/taxes`,
      {
        taxName: 'Test VAT',
        taxCode: 'TEST-VAT-18',
        taxType: 'VAT',
        calculationType: 'Percentage',
        rate: 18,
        priceType: 'Exclusive',
        appliesTo: 'All',
        isActive: true,
        description: 'Test VAT for API testing',
        outputGLCode: '2101',
        inputGLCode: '1301',
        controlGLCode: '2102',
      },
      {
        headers: { Authorization: `Bearer ${TEST_TOKEN}` }
      }
    );
    console.log('✅ Tax created:', createResponse.data);
    const taxId = createResponse.data.id;

    // Test 2: Get All Taxes
    console.log('\n2️⃣ Testing GET All Taxes...');
    const getAllResponse = await axios.get(`${API_URL}/stock/taxes`, {
      headers: { Authorization: `Bearer ${TEST_TOKEN}` }
    });
    console.log(`✅ Found ${getAllResponse.data.length} taxes`);

    // Test 3: Get Tax by ID
    console.log('\n3️⃣ Testing GET Tax by ID...');
    const getByIdResponse = await axios.get(`${API_URL}/stock/taxes/${taxId}`, {
      headers: { Authorization: `Bearer ${TEST_TOKEN}` }
    });
    console.log('✅ Tax retrieved:', getByIdResponse.data.taxName);

    // Test 4: Update Tax
    console.log('\n4️⃣ Testing UPDATE Tax...');
    const updateResponse = await axios.put(
      `${API_URL}/stock/taxes/${taxId}`,
      { rate: 20 },
      {
        headers: { Authorization: `Bearer ${TEST_TOKEN}` }
      }
    );
    console.log('✅ Tax updated, new rate:', updateResponse.data.rate);

    // Test 5: Delete Tax
    console.log('\n5️⃣ Testing DELETE Tax...');
    await axios.delete(`${API_URL}/stock/taxes/${taxId}`, {
      headers: { Authorization: `Bearer ${TEST_TOKEN}` }
    });
    console.log('✅ Tax deleted successfully');

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Instructions
console.log('📝 Instructions:');
console.log('1. Make sure backend server is running on port 3001');
console.log('2. Login to stock system and get your token');
console.log('3. Replace TEST_TOKEN with your actual token');
console.log('4. Run: node test-tax-api.js\n');

// Uncomment to run tests
// testTaxAPI();

console.log('⚠️  Update TEST_TOKEN and uncomment testTaxAPI() to run tests');

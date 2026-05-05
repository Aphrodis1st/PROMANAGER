import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3001/api/v1';

async function initializeCurrencies() {
  try {
    console.log('🔄 Initializing default currencies...');
    
    const response = await axios.post(`${API_URL}/currency/initialize`);
    
    console.log('✅ Success!');
    console.log(`📊 Initialized ${response.data.currencies.length} currencies:`);
    
    response.data.currencies.forEach(currency => {
      console.log(`   - ${currency.code}: ${currency.name} (${currency.symbol})`);
    });
    
    console.log('\n✨ Currency system is ready to use!');
    console.log('📝 Next steps:');
    console.log('   1. Login to Super Admin');
    console.log('   2. Navigate to Currency Management');
    console.log('   3. Set default currency for each organization');
    
  } catch (error) {
    console.error('❌ Error initializing currencies:', error.response?.data || error.message);
    process.exit(1);
  }
}

initializeCurrencies();

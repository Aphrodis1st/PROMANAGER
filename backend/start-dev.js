// Force development mode startup
process.env.NODE_ENV = 'development';
process.env.PORT = '3001';

console.log('🔧 FORCING DEVELOPMENT MODE');
console.log('📌 NODE_ENV:', process.env.NODE_ENV);
console.log('📌 PORT:', process.env.PORT);
console.log('');

// Now import and run the server
import('./src/server.js');

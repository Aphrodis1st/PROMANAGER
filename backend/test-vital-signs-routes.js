// Test script to verify vital signs routes
import express from 'express';
import vitalSignsRoutes from './src/routes/hospital/vitalSigns.routes.js';

const app = express();
app.use(express.json());

// Test the vital signs routes
app.use('/api/v1/hospital/vital-signs', vitalSignsRoutes);

// List all registered routes
console.log('\n=== Registered Vital Signs Routes ===');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const method = Object.keys(handler.route.methods)[0].toUpperCase();
        const path = handler.route.path;
        console.log(`${method} /api/v1/hospital/vital-signs${path}`);
      }
    });
  }
});
console.log('=====================================\n');

console.log('✅ Vital signs routes loaded successfully!');
console.log('Routes are ready to be used in the main server.');

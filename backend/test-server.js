import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server working' });
});

// Hospital auth test route
app.post('/api/v1/hospital/auth/login', (req, res) => {
  console.log('Hospital login route hit!');
  res.json({ success: true, message: 'Hospital login route working' });
});

// Catch all
app.use('*', (req, res) => {
  console.log('Unmatched route:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Route not found', method: req.method, url: req.originalUrl });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('GET /test');
  console.log('POST /api/v1/hospital/auth/login');
});
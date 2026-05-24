// frontend/src/index.jsx
// ⚡ Set React Router future flags before importing React
window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.enableFutureFlags?.({
  v7_startTransition: false,
  v7_relativeSplatPath: false
});

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';  // <-- Tailwind CSS
import App from './App.jsx';
import { store } from './store/page.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

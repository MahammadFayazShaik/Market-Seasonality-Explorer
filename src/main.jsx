import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './theme.css'; // ✅ 1. Import the new theme styles
import { ThemeProvider } from './ThemeContext'; // ✅ 2. Import ThemeContext

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> {/* ✅ 3. Wrap your app with ThemeProvider */}
      <App />
    </ThemeProvider>
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyTheme } from './config/themes';
import { eventConfig } from './config/event.config';
import { presets } from './config/presets';
import './styles/index.css';

// Apply the theme before first paint to avoid a colour flash.
applyTheme(eventConfig.theme === 'auto' ? presets[eventConfig.eventType].defaultTheme : eventConfig.theme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

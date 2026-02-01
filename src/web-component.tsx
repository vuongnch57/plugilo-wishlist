import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import styleText from './index.css?inline'; // Import CSS as string
import appStyleText from './App.css?inline'; // Import App CSS as string (if any)
// You might need to import other CSS files here if they are not imported in JS

class WishlistDock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot) return;

    // Create a mount point
    const mountPoint = document.createElement('div');
    this.shadowRoot.appendChild(mountPoint);

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      ${styleText}
      ${appStyleText}
      :host {
        display: block;
        all: initial; /* Reset inheritance */
        contain: content; /* Performance optimization */
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    `;

    this.shadowRoot.appendChild(style);

    // Inject external stylesheet (for CSS modules and other build-extracted styles)
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    try {
      const scriptUrl = new URL(import.meta.url);
      const cssUrl = new URL('./wishlist-dock.css', scriptUrl).href;
      link.href = cssUrl;
    } catch (e) {
      link.href = 'wishlist-dock.css';
    }
    this.shadowRoot.appendChild(link);

    // Render React App
    createRoot(mountPoint).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

customElements.define('wishlist-dock', WishlistDock);

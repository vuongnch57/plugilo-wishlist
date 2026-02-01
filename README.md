# Plugilo Wishlist Widget

A detailed, interactive "Dock" style wishlist widget built with React, TypeScript, and Vite. It supports creating stacks of cards, drag-and-drop organization, and can be embedded into any website as a Web Component.

## Setup Instructions

1.  **Prerequisites**: Node.js installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:5173`.

## How to Embed the Widget

The widget is designed to be embedded into any external website using a custom Web Component (`<wishlist-dock>`).

1.  **Build the Project**:
    ```bash
    npm run build:widget
    ```
    This creates a `dist` folder containing `wishlist-dock.es.js` and `wishlist-dock.css`.

2.  **Include Files**: Add the generated script and stylesheet to your HTML page.
    ```html
    <link rel="stylesheet" href="./dist/wishlist-dock.css">
    <script type="module" src="./dist/wishlist-dock.es.js"></script>
    ```

3.  **Use the Component**:
    ```html
    <wishlist-dock></wishlist-dock>
    ```

## Architecture Decisions

-   **React & Vite**: Chosen for a robust component-based architecture and fast development experience. Vite's library mode simplifies bundling for the widget.
-   **Web Components (Shadow DOM)**: Used to encapsulate the widget's styles and markup. This ensures the widget looks consistent on any website and doesn't inherit potential conflicts from host page styles (e.g., Bootstrap or Tailwind).
-   **Zustand**: Selected for state management. It provides a localized store that persists to `localStorage`, offering a simple yet powerful way to track user data without the boilerplate of Redux.
-   **Framer Motion**: Used for fluid, macOS-like animations (spring physics) which are crucial for the "Dock" feel.
-   **CSS Variables**: Used for theming to allow easy switching between Light, Dark, and System modes while remaining maintainable.

## Trade-offs

-   **React in Web Component**: Bundling React within the web component increases the bundle size (~140kb parsed) compared to a vanilla JS solution. However, this trade-off was accepted to leverage React's ecosystem, state management, and declarative UI model for a complex interactive interface.
-   **Shadow DOM Isolation**: While Shadow DOM prevents style bleeding, it also makes it harder to use global fonts or utility classes from the host page. I solved this by explicitly injecting the necessary font styles and CSS variables into the Shadow Root.
-   **Local Storage Persistence**: The current implementation relies on `localStorage` for data persistence. This means data is not synced across devices or browsers. A backend integration would be needed for a true cross-platform experience.

## What I'd Improve with More Time

-   **Backend Sync**: Implement a real backend (e.g., Node.js/Postgres or Firebase) to sync wishlist items across devices dynamically.
-   **Testing**: Add unit tests (Vitest) for core logic (store actions) and integration tests (Playwright) to verify the embedding and drag-and-drop flows.
-   **Accessibility (a11y)**: Conduct a full accessibility audit to ensure keyboard navigation and screen reader support are top-tier, particularly for the drag-and-drop interactions.
-   **Performance Optimization**: Code-split the heavy framer-motion library or lazy load the widget until the user interacts with a trigger button to reduce initial page load impact.
-   **Customization API**: Expose more props on the `<wishlist-dock>` element (e.g., `<wishlist-dock theme="dark" initial-stack="books">`) to allow host pages to control internal state programmatically.

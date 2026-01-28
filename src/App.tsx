import { Dock } from './components/Dock/Dock';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Example Website Content</h1>
      <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
        This is a placeholder website to demonstrate the floating Dock widget.
        Scroll down or interact with the page to see the widget stays fixed.
      </p>
      
      {/* The Widget */}
      <Dock />
    </div>
  );
}

export default App;

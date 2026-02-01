import { Dock } from './components/Dock/Dock';
import { StackView } from './components/StackView/StackView';
import { useTheme } from './hooks/useTheme';
import { useStore } from './store/useStore';
import './App.css';

function App() {
  const resolvedTheme = useTheme(); // Initialize theme effect and get value
  const { theme, setTheme } = useStore();

  return (
    <div className="App" data-theme={resolvedTheme}>
      {/* Active Stack View Overlay */}
      <StackView />

      <h1>Global Theming Setup</h1>
      <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
        Current Theme: <strong>{theme}</strong>
      </p>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => setTheme('light')}>Light</button>
        <button onClick={() => setTheme('dark')}>Dark</button>
        <button onClick={() => setTheme('system')}>System</button>
      </div>

      {/* The Widget */}
      <Dock />
    </div>
  );
}

export default App;

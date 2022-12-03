import { createRoot } from 'react-dom/client';

import { HashRouter as Router } from 'react-router-dom';
import App from './App';

const root = createRoot(document.querySelector('#root'));
root.render(
  <Router>
    <App />
  </Router>
);

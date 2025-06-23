import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import withRoot from './theme/withRoot';

const RootApp = withRoot(App);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);

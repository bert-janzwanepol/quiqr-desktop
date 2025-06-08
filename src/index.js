import React             from 'react';
import { createRoot }    from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import App               from './App';
import service           from './services/service';
import SnackbarManager   from './components/SnackbarManager';

service.api.readConfKey('prefs').then((value)=>{

  let appUiStyle = 'quiqr10';

  require('./app-ui-styles/' + appUiStyle + '/css/index.css');
  require('./app-ui-styles/' + appUiStyle + '/css/bootstrap-grid.css');

  /* STYLES FOR OTHER THEN MUI COMPONENTS */
  require('./app-ui-styles/components.css');
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <div>
      <SnackbarManager />
      <App />
    </div>
  </BrowserRouter>
);

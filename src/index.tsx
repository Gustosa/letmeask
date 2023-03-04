import React from 'react';
import ReactDOM from 'react-dom/client'; //Aplicação web usa a dom. Uma aplicação mobile por exemplo, usaria outro import do react(qual? não sei)
import App from './App';
import "./services/firebase";

import "./styles/global.scss"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render( //exibe alguma coisa dentro do html(index)
  <React.StrictMode>
    <App /> //chama o componente exportado no App.tsx
  </React.StrictMode>
);

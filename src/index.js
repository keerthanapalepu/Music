import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Font from './fonts/playfair.ttf';

const customFont = {
  fontFamily: 'play-fair',
  src: `url(${Font}) format('truetype')`,
  fontWeight: 'normal',
  fontStyle: 'normal',
};

// Apply the font using CSS
const globalStyles = `
  @font-face {
    font-family: 'play-fair';
    src: ${customFont.src};
    font-weight: ${customFont.fontWeight};
    font-style: ${customFont.fontStyle};
  }

  /* Additional global styles if needed */
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <style>{globalStyles}</style>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

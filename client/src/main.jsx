import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store'; // 1. Import Store ของคุณ
import App from './App.jsx';

// 2. Import Bootstrap CSS (จากแพ็คเกจที่ติดตั้ง)
import 'bootstrap/dist/css/bootstrap.min.css'; 


import './assets/css/fonts.css';
// Use local fonts CSS instead of an absolute path which breaks Vite resolution
import './assets/fonts/font-icons.css';
import './assets/css/swiper-bundle.min.css';
import './assets/css/animate.css';
import './assets/css/styles.css';
//import './assets/css/swiper.css';
import './assets/css/animate.css';
import './assets/css/bootstrap-select.min.css';
import './assets/css/bootstrap.min.css';
import './assets/css/image-compare-viewer.min.css';
import './assets/css/photoswipe.css';

// 4. Render แอปของคุณ
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 5. ห่อหุ้ม App ทั้งหมดด้วย Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
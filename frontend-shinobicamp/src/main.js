// Import CSS
import './assets/main.css';

// Import Dependencies
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Vue3Toastify from 'vue3-toastify';

// Import Axios Config
import './API/axiosConfig';

// Axios Configuration
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// FontAwesome Icons
library.add(fas, far);

// Create and Mount App
const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 3000,
    position: toast.POSITION.TOP_RIGHT,
    clearOnUrlChange: true,
    pauseOnHover: true,
    theme: 'colored',
    transition: 'slide',
    dangerouslyHTMLString: false,
    limit: 3,
    hideProgressBar: false,
    closeButton: true,
    closeOnClick: true,
    className: 'custom-toast',
    style: {
      minWidth: '250px',
      maxWidth: '90vw',
      wordBreak: 'break-word'
    }
  })
  .component('font-awesome-icon', FontAwesomeIcon);

// Cek autentikasi dan mount aplikasi
const pinia = createPinia();
app.use(pinia);

// Mount aplikasi langsung tanpa menunggu attempt()
// Router guard akan menangani pemeriksaan autentikasi
app.mount('#app');

// Import CSS
import './assets/main.css';

// Import Dependencies
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, far } from '@fortawesome/free-solid-svg-icons';

// Axios Configuration
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// FontAwesome Icons
library.add(fas, far);

// Create and Mount App
const app = createApp(App)
  .use(createPinia())
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon);

useAuthStore().attempt().finally(() => app.mount('#app'));

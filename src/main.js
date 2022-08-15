import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import vClickOutside from "click-outside-vue3"

createApp(App).use(store).use(vClickOutside).mount('#app')

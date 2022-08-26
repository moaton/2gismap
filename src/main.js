import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import vClickOutside from "click-outside-vue3"

import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'


createApp(App).use(store).use(vClickOutside).component('treeselect', Treeselect).mount('#app')


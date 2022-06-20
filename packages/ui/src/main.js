import { createApp } from 'vue'
import { pinia } from './stores'
import App from './App.vue'
import './index.css'
import './main.scss'
import router from './router'
import vSelect from 'vue-select'
import OpenIndicator from './components/OpenIndicator.vue'
import InfiniteLoading from 'v3-infinite-loading'

vSelect.props.components.default = () => ({ OpenIndicator })

createApp(App)
  .component('VSelect', vSelect)
  .component('InfiniteLoading', InfiniteLoading)
  .use(pinia)
  .use(router)
  .mount('#app')

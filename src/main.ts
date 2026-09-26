import './assets/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { MemobookPreset } from './theme/memobookPreset'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: MemobookPreset,
    options: {
      darkModeSelector: '.dark',
    },
    cssLayer: {
      name: 'primevue',
      order: 'base, primevue',
    },
  },
})

app.use(ConfirmationService)
app.directive('tooltip', Tooltip)

app.mount('#app')

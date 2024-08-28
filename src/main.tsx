import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from '@modules/redux/store.ts'
// import { registerServiceWorker } from "@modules/libs/service-worker/index.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
// console.log(import.meta.env.MODE);

// if (import.meta.env.MODE !== "development")
// registerServiceWorker();

// if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/service-worker.js')
//       .then((registration) => {
//         console.log(
//           'ServiceWorker registration successful with scope: ',
//           registration.scope
//         )
//       })
//       .catch((error) => {
//         console.error('ServiceWorker registration failed: ', error)
//       })
//   })
// }

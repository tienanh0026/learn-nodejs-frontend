import NotificationList from '@components/Layout/NotificationList/NotificationList'
import RouterConfig from './routes'

function App() {
  return (
    <div className="dark:text-white dark:bg-slate-400">
      <RouterConfig />
      <NotificationList />
    </div>
  )
}

export default App

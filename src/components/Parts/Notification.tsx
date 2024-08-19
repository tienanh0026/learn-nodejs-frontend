import {
  NotiItem,
  removeNotification,
} from '@modules/redux/NotificationSlice/NotificationSlice'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

function Notification({ notification }: { notification: NotiItem }) {
  const dispatch = useDispatch()
  const notiRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (notiRef.current) {
      notiRef.current.style.maxHeight = '300px'
    }
    setTimeout(() => {
      if (notiRef.current) {
        notiRef.current.classList.add('fly-in-animation')
        notiRef.current.style.opacity = '1'
      }
    }, 100)
    setTimeout(() => {
      if (notiRef.current) {
        notiRef.current.classList.add('fly-out-animation')
        setTimeout(() => {
          dispatch(removeNotification(notification.id))
        }, 350)
      }
    }, 2000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div
      className="max-h-0 opacity-0 bg-white rounded-md shadow-[rgba(0,0,0,0.24)_0px_3px_8px] transition-all duration-500 overflow-hidden mb-2"
      ref={notiRef}
    >
      <div className="p-4">
        <div className="flex gap-2 items-center">
          {notification.type === 'success' ? (
            <img className="size-5" src="/accept-logo.svg" />
          ) : (
            <img className="size-5" src="/reject-logo.svg" />
          )}
          <span>
            {notification.title ||
              (notification.type === 'success' ? 'Success' : 'Fail')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Notification

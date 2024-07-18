import Notification from '@components/Parts/Notification'
import { notificationState } from '@modules/redux/NotificationSlice/NotificationSlice'
import { useLayoutEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
function NotificationList() {
  const { notiList } = useSelector(notificationState)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!wrapperRef.current) return
    wrapperRef.current.style.height = `${wrapperRef.current.scrollHeight}px`
  }, [notiList.length])
  if (notiList.length === 0) return null
  return (
    <div className="fixed top-4 right-10" ref={wrapperRef}>
      {notiList.map((noti) => (
        <Notification notification={noti} key={noti.id} />
      ))}
    </div>
  )
}

export default NotificationList

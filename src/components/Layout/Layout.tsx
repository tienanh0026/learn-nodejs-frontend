import { Outlet } from 'react-router-dom'
import HeaderLayout from './HeaderLayout'
import { getCurrentUser } from '@modules/api/currentUser'
import { HEADER_HEIGHT } from '@modules/constants/layout'
import { socket } from '@modules/libs/socket'
import { authState, setAuthState } from '@modules/redux/AuthSlice/AuthSlice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Layout({ isChat }: { isChat: boolean }) {
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useSelector(authState)
  const dispatch = useDispatch()
  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        dispatch(
          setAuthState({
            isAuthenticated: true,
            user: response.data.data,
          })
        )
      })
      .finally(() => {
        setIsLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (!isLoading && user && isChat) {
      console.log('123')

      socket.connect()
    }
    return () => {
      socket.disconnect()
    }
  }, [isChat, isLoading, user])
  return (
    <>
      <HeaderLayout />
      {isChat ? (
        <main
          className="size-full bg-gray-50 h-svh p-12 max-md:p-0 dark:bg-gray-600 transition-all dark:text-white"
          style={{
            maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
          <div className="border-gray- bg-gray-200 dark:bg-gray-700 rounded-lg h-full shadow-[rgba(0,0,0,0.24)_0px_3px_8px] p-6 max-md:p-4">
            {isLoading ? (
              <div className="size-full flex items-center justify-center font-bold">
                Loading...
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      ) : (
        <main className="p-12 max-md:p-0 transition-all dark:text-white">
          <Outlet />
        </main>
      )}
    </>
  )
}

export default Layout

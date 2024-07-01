import { authState } from '@modules/redux/AuthSlice/AuthSlice'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

function PublicGuard() {
  const { isAuthenticated } = useSelector(authState)
  const navigate = useNavigate()
  useEffect(() => {
    if (isAuthenticated) navigate('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])
  return (
    <>
      <Outlet />
    </>
  )
}

export default PublicGuard

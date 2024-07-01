import { authState } from '@modules/redux/AuthSlice/AuthSlice'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

function AuthGuard() {
  const { isAuthenticated } = useSelector(authState)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])
  return (
    <>
      <Outlet />
    </>
  )
}

export default AuthGuard

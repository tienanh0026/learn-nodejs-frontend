import {
  ChevronLeftIcon,
  ArrowRightEndOnRectangleIcon,
} from '@heroicons/react/20/solid'
import { HEADER_HEIGHT } from '@modules/constants/layout'
import { authState, clearAuthState } from '@modules/redux/AuthSlice/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'cookies-js'
import { useThemeDetector } from '@modules/funcs/hooks'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import ToggleButton from '@components/BaseComponent/ToggleButton'

function HeaderLayout() {
  const { user } = useSelector(authState)
  const { isDarkTheme, setIsDarkTheme } = useThemeDetector()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    dispatch(clearAuthState())
    Cookies.set('access-token', '')
    Cookies.set('refresh-token', '')
    navigate('/login')
  }
  return (
    <>
      <header
        className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-500"
        style={{
          height: HEADER_HEIGHT,
        }}
      >
        <div className="size-full flex justify-between dark:text-white sticky top-0 px-12">
          <nav className="flex gap-4 items-center">
            <Link
              to=""
              className="hover:underline p-1 h-full items-center flex md:hidden"
              onClick={(e) => {
                e.preventDefault()
                navigate(-1)
              }}
            >
              <ChevronLeftIcon className="size-6" />
            </Link>
            <Link to={'/'}>
              <img src="/vite.svg" />
            </Link>
            <Link to={'/about'}>About</Link>
            <Link to={'/room-list'}>Room Chat</Link>
          </nav>
          <div className="flex gap-3 items-center">
            <ToggleButton
              isActive={isDarkTheme}
              renderActiveIcon={<MoonIcon className="size-6" />}
              renderInactiveIcon={<SunIcon className="size-6" />}
              onToggle={() => {
                setIsDarkTheme(!isDarkTheme)
              }}
            />
            {user && (
              <Link
                className="p-1 h-full flex items-center"
                to={'/login'}
                onClick={handleLogout}
              >
                <ArrowRightEndOnRectangleIcon className="size-6" />
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default HeaderLayout

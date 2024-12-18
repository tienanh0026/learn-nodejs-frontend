import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useSyncExternalStore,
  RefObject,
} from 'react'

const usePreviewMediaFile = (file: File | undefined) => {
  const [previewFile, setPreviewFile] = useState<
    { data: string | undefined; type: 'image' | 'video' } | undefined
  >()
  useEffect(() => {
    if (!file) return setPreviewFile(undefined)
    const imageRegex = /^image\/(jpeg|png|gif|webp|bmp|svg\+xml)$/
    const isImage = imageRegex.test(file.type)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      setPreviewFile({
        data: reader.result?.toString(),
        type: isImage ? 'image' : 'video',
      })
      return
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
      setPreviewFile(undefined)
      return
    }
  }, [file])

  return { previewFile, setPreviewFile }
}

const useThemeDetector = () => {
  const theme = useLocalStorage('theme')
  const getCurrentTheme = () =>
    theme
      ? theme === 'dark'
        ? true
        : false
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme())
  const mqListener = (e: MediaQueryListEvent) => {
    setIsDarkTheme(e.matches)
  }

  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
    darkThemeMq.addListener(mqListener)
    return () => darkThemeMq.removeListener(mqListener)
  }, [])

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark')
    } else document.body.classList.remove('dark')
    window.localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light')
  }, [isDarkTheme])
  return { isDarkTheme, setIsDarkTheme }
}

function useWindowSize(isActive: boolean) {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    if (!isActive) return
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [isActive])
  return size
}

const useLocalStorage = (key: string) => {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback)
    return () => {
      window.removeEventListener('storage', callback)
    }
  }, [])
  const getSnapshot = useCallback(() => {
    return window.localStorage.getItem(key)
  }, [key])
  const storageValue = useSyncExternalStore(subscribe, getSnapshot)
  return storageValue
}

const useClickAway = (
  ref: RefObject<HTMLElement>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref, handler])
}

export {
  usePreviewMediaFile,
  useThemeDetector,
  useWindowSize,
  useLocalStorage,
  useClickAway,
}

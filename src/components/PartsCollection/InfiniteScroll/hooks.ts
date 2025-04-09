import { DependencyList, useEffect, useLayoutEffect, useRef } from 'react'

const useLoadMore = ({
  onLoadMore,
  skip,
  loadMoreElement,
  observerOption,
}: {
  onLoadMore: () => void
  skip: boolean
  loadMoreElement?: HTMLElement | null
  observerOption?: IntersectionObserverInit
}) => {
  useEffect(() => {
    if (skip || !loadMoreElement) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onLoadMore()
        }
      })
    }, observerOption)

    observer.observe(loadMoreElement)

    return () => {
      observer.disconnect()
    }
  }, [skip, loadMoreElement, observerOption, onLoadMore])
}

const useKeepScrollPosition = <T extends DependencyList>({
  deps,
  container,
  mediaInitialHeight,
}: {
  deps: T
  container: HTMLElement | null
  mediaInitialHeight: number
}) => {
  const prevScrollHeight = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (!container) return

    if (prevScrollHeight.current === null) {
      prevScrollHeight.current = container.scrollHeight
    }

    const addedHeight = container.scrollHeight - prevScrollHeight.current
    container.scrollTop += addedHeight
    prevScrollHeight.current = container.scrollHeight

    const handleOnLoadMedia = (e: Event) => {
      const mediaElementHeight = (e.target as HTMLImageElement).height
      if (mediaElementHeight > mediaInitialHeight) {
        const addedHeight = mediaElementHeight - mediaInitialHeight
        container.scrollTop += addedHeight
      }
      prevScrollHeight.current = container.scrollHeight
    }

    const mediaElements = container.querySelectorAll('img, video')
    mediaElements.forEach((mediaElement) => {
      mediaElement.addEventListener('load', handleOnLoadMedia)
    })

    return () => {
      mediaElements.forEach((mediaElement) => {
        mediaElement.removeEventListener('load', handleOnLoadMedia)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, ...deps])
}

export { useLoadMore, useKeepScrollPosition }

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

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onLoadMore()
        }
      })
    }
    const observer = new IntersectionObserver(callback, observerOption)
    observer.observe(loadMoreElement)
    return () => {
      if (loadMoreElement) observer.unobserve(loadMoreElement)
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

    // Capture the previous scroll height before new items are added
    if (prevScrollHeight.current === null) {
      prevScrollHeight.current = container.scrollHeight
    }
    // Adjust scroll position after new items are added
    const addedHeight = container.scrollHeight - prevScrollHeight.current
    container.scrollTop += addedHeight
    // Update the reference to the latest scroll height
    prevScrollHeight.current = container.scrollHeight

    // handle loading media
    const handleOnLoadMedia = (e: Event) => {
      const mediaElementHeight = (e.target as HTMLImageElement).height
      if (mediaElementHeight > mediaInitialHeight) {
        const addedHeight = mediaElementHeight - mediaInitialHeight
        container.scrollTop += addedHeight
      }
      prevScrollHeight.current = container.scrollHeight
    }

    const mediaElements = container.querySelectorAll('img, video')
    console.log(mediaElements)
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

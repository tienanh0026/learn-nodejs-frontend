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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (loadMoreElement) observer.unobserve(loadMoreElement)
    }
  }, [skip, loadMoreElement, observerOption, onLoadMore])
}

const useKeepScrollPosition = <T extends DependencyList>({
  deps,
  container,
}: {
  deps: T
  container: HTMLElement | null
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, ...deps])
}

export { useLoadMore, useKeepScrollPosition }

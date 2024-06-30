import { DependencyList, useEffect, useLayoutEffect, useRef } from "react";

const useLoadMore = ({
  onLoadMore,
  skip,
  loadMoreElement,
  observerOption,
}: {
  onLoadMore: () => void;
  skip: boolean;
  loadMoreElement?: HTMLElement | null;
  observerOption?: IntersectionObserverInit;
}) => {
  useEffect(() => {
    if (skip || !loadMoreElement) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      });
    };
    const observer = new IntersectionObserver(callback, observerOption);
    observer.observe(loadMoreElement);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (loadMoreElement) observer.unobserve(loadMoreElement);
    };
  }, [skip, loadMoreElement, observerOption, onLoadMore]);
};

const useKeepScrollPosition = <T extends DependencyList>({
  deps,
  container,
}: {
  deps: T;
  container: HTMLElement | null;
}) => {
  const prevScroll = useRef<number | undefined>();

  useLayoutEffect(() => {
    if (container) {
      const height = container.scrollHeight;
      console.log("After Element height:", height);
      if (prevScroll.current)
        container.scroll({
          top: height - prevScroll.current,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, ...deps]); // Include container and other dependencies
  useEffect(() => {
    return () => {
      prevScroll.current = container?.scrollHeight;
      console.log("Before Element height:", prevScroll.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, ...deps]);
};

export { useLoadMore, useKeepScrollPosition };

import { useEffect } from "react";

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

export { useLoadMore };

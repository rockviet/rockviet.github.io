import { useState, useEffect, useCallback, useRef } from "react";

const PAGE_SIZE = 40;

export function useInfiniteScroll<T>(items: T[]) {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [items]);

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0]?.isIntersecting) {
                setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));
            }
        },
        [items.length],
    );

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: "400px",
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [observerCallback]);

    return {
        visible: items.slice(0, visibleCount),
        hasMore: visibleCount < items.length,
        sentinelRef,
    };
}

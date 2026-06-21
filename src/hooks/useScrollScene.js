import { useEffect, useRef, useCallback } from 'react';
import { useCarbonShadow } from '../context/CarbonShadowContext';

/**
 * Hook to manage scroll-snapping container interactions and synchronizing active scene indexes.
 */
export function useScrollScene() {
  const { scene, setScene } = useCarbonShadow();
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Programmatically scroll to a specific scene
  const scrollToScene = useCallback((sceneNum) => {
    if (!containerRef.current) return;
    const children = containerRef.current.children;
    const targetIdx = sceneNum - 1;

    if (children[targetIdx]) {
      isScrollingRef.current = true;
      setScene(sceneNum);
      children[targetIdx].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Reset scrolling flag after animation finishes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 850);
    }
  }, [setScene]);

  useEffect(() => {
    if (!containerRef.current) return;

    const children = Array.from(containerRef.current.children);

    // Intersection observer to track which scene is in focus
    const observerCallback = (entries) => {
      if (isScrollingRef.current) return; // Prevent double-triggering during smooth scroll

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = children.indexOf(entry.target);
          if (index !== -1) {
            setScene(index + 1);
          }
        }
      });
    };

    const observerOptions = {
      root: containerRef.current,
      threshold: 0.6, // Fire when 60% of the scene is in view
    };

    observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

    children.forEach((child) => {
      observerRef.current.observe(child);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setScene]);

  return {
    containerRef,
    scrollToScene,
  };
}

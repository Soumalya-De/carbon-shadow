import React, { useEffect, useRef } from 'react';
import { useCarbonShadow } from '../../context/CarbonShadowContext';

/**
 * SceneContainer provides full-viewport scroll snapping.
 * It coordinates programmatic scrolling (soft buttons) and manual scrolling.
 */
export function SceneContainer({ children }) {
  const { scene, setScene } = useCarbonShadow();
  const containerRef = useRef(null);
  const isProgrammaticScrollRef = useRef(false);
  const observerRef = useRef(null);

  // Synchronize DOM scrolling when active scene changes programmatically
  useEffect(() => {
    if (!containerRef.current || isProgrammaticScrollRef.current) return;

    const childrenArray = Array.from(containerRef.current.children);
    const targetChild = childrenArray[scene - 1];

    if (targetChild) {
      // Check if we are already scrolled to this child
      const currentScrollTop = containerRef.current.scrollTop;
      const targetScrollTop = targetChild.offsetTop;

      if (Math.abs(currentScrollTop - targetScrollTop) > 10) {
        isProgrammaticScrollRef.current = true;
        
        targetChild.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Release lock after smooth scroll animation completes
        const timer = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 850);

        return () => clearTimeout(timer);
      }
    }
  }, [scene]);

  // Set up IntersectionObserver to update scene when user scrolls manually
  useEffect(() => {
    if (!containerRef.current) return;

    const childrenArray = Array.from(containerRef.current.children);

    const observerCallback = (entries) => {
      // Do not sync observer triggers back to context during programmatic scrolls
      if (isProgrammaticScrollRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = childrenArray.indexOf(entry.target);
          if (index !== -1) {
            setScene(index + 1);
          }
        }
      });
    };

    const observerOptions = {
      root: containerRef.current,
      threshold: 0.55, // Fire when 55% of the scene card is visible
    };

    observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

    childrenArray.forEach((child) => {
      observerRef.current.observe(child);
    });

    // Keyboard navigation (Arrow keys)
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (scene < childrenArray.length) {
          setScene(scene + 1);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (scene > 1) {
          setScene(scene - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [scene, setScene]);

  return (
    <div
      ref={containerRef}
      className="scene-snap-container no-scrollbar w-full h-screen bg-darkBg relative overflow-y-scroll"
    >
      {children}
    </div>
  );
}

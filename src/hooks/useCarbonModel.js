import { useEffect, useRef } from 'react';

/**
 * Hook to run carbon footprint calculations inside a Web Worker.
 * @param {Object} traces Digital usage values
 * @param {Function} onCalculationComplete Callback triggered when worker posts results
 */
export function useCarbonModel(traces, onCalculationComplete) {
  const workerRef = useRef(null);

  useEffect(() => {
    // Initialize Web Worker with Vite-compatible syntax
    workerRef.current = new Worker(
      new URL('./carbonWorker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      if (onCalculationComplete) {
        onCalculationComplete(e.data);
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [onCalculationComplete]);

  // Recalculate whenever traces change (debounced by 50ms to prevent worker queue flooding)
  useEffect(() => {
    if (!workerRef.current || !traces) return;

    const timer = setTimeout(() => {
      workerRef.current.postMessage({ traces });
    }, 50);

    return () => clearTimeout(timer);
  }, [traces]);
}

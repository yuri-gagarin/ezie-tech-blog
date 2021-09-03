import { useState, useEffect } from "react";

export const useWindowSize = (): { width: number; height: number } => {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  function handleResize() {
    // Set window width/height to state
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize);     
      handleResize();
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []); 
  return windowSize;
}
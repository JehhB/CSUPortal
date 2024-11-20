import { useEffect, useRef } from "react";

type LayoutCallback = (event: {
  nativeEvent: {
    layout: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}) => void;

const useLayout = <T extends HTMLElement>(callback: LayoutCallback) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const { width, height } = entry.contentRect;
        callback({
          nativeEvent: {
            layout: {
              x: element.offsetLeft,
              y: element.offsetTop,
              width,
              height,
            },
          },
        });
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback]);

  return ref;
};

export default useLayout;

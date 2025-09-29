import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
}

export function useResponsive(): ResponsiveBreakpoints {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isLandscape = width > height;
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    screenWidth: width,
    screenHeight: height,
    orientation: isLandscape ? 'landscape' : 'portrait'
  };
}

// Responsive values helper
export function getResponsiveValue<T>(
  mobile: T,
  tablet?: T,
  desktop?: T
): T {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  if (isMobile) return mobile;
  if (isTablet && tablet !== undefined) return tablet;
  if (isDesktop && desktop !== undefined) return desktop;
  
  return mobile;
}

// Responsive spacing helper
export function getResponsiveSpacing(
  mobile: number,
  tablet?: number,
  desktop?: number
): number {
  return getResponsiveValue(mobile, tablet, desktop);
}

// Responsive font size helper
export function getResponsiveFontSize(
  mobile: number,
  tablet?: number,
  desktop?: number
): number {
  return getResponsiveValue(mobile, tablet, desktop);
}

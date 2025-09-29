import { useResponsive } from '@/hooks/use-responsive';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  mobileStyle?: ViewStyle;
  tabletStyle?: ViewStyle;
  desktopStyle?: ViewStyle;
}

export function ResponsiveLayout({ 
  children, 
  style, 
  mobileStyle, 
  tabletStyle, 
  desktopStyle 
}: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getResponsiveStyle = () => {
    const baseStyle = [styles.container, style];
    
    if (isMobile && mobileStyle) {
      return [...baseStyle, mobileStyle];
    }
    if (isTablet && tabletStyle) {
      return [...baseStyle, tabletStyle];
    }
    if (isDesktop && desktopStyle) {
      return [...baseStyle, desktopStyle];
    }
    
    return baseStyle;
  };

  return (
    <View style={getResponsiveStyle()}>
      {children}
    </View>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  style?: ViewStyle;
}

export function ResponsiveGrid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 16,
  style 
}: ResponsiveGridProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getGridStyle = () => {
    let gridColumns = columns.mobile || 1;
    
    if (isTablet && columns.tablet) {
      gridColumns = columns.tablet;
    } else if (isDesktop && columns.desktop) {
      gridColumns = columns.desktop;
    }

    return [
      styles.grid,
      {
        gap,
        ...(gridColumns > 1 && {
          flexDirection: 'row',
          flexWrap: 'wrap',
        }),
      },
      style
    ];
  };

  return (
    <View style={getGridStyle()}>
      {children}
    </View>
  );
}

interface ResponsiveTextProps {
  children: React.ReactNode;
  mobileSize?: number;
  tabletSize?: number;
  desktopSize?: number;
  style?: any;
}

export function ResponsiveText({ 
  children, 
  mobileSize = 14,
  tabletSize = 16,
  desktopSize = 18,
  style 
}: ResponsiveTextProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getFontSize = () => {
    if (isMobile) return mobileSize;
    if (isTablet) return tabletSize;
    if (isDesktop) return desktopSize;
    return mobileSize;
  };

  return (
    <View style={[styles.textContainer, { fontSize: getFontSize() }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'column',
  },
  textContainer: {
    // Base text styles
  },
});

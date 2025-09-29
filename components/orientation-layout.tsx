import { useResponsive } from '@/hooks/use-responsive';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface OrientationLayoutProps {
  children: React.ReactNode;
  portraitStyle?: ViewStyle;
  landscapeStyle?: ViewStyle;
  style?: ViewStyle;
}

export function OrientationLayout({ 
  children, 
  portraitStyle, 
  landscapeStyle, 
  style 
}: OrientationLayoutProps) {
  const { orientation } = useResponsive();

  const getOrientationStyle = () => {
    const baseStyle = [styles.container, style];
    
    if (orientation === 'portrait' && portraitStyle) {
      return [...baseStyle, portraitStyle];
    }
    if (orientation === 'landscape' && landscapeStyle) {
      return [...baseStyle, landscapeStyle];
    }
    
    return baseStyle;
  };

  return (
    <View style={getOrientationStyle()}>
      {children}
    </View>
  );
}

interface OrientationGridProps {
  children: React.ReactNode;
  portraitColumns?: number;
  landscapeColumns?: number;
  gap?: number;
  style?: ViewStyle;
}

export function OrientationGrid({ 
  children, 
  portraitColumns = 1,
  landscapeColumns = 2,
  gap = 16,
  style 
}: OrientationGridProps) {
  const { orientation } = useResponsive();

  const getGridStyle = () => {
    const columns = orientation === 'portrait' ? portraitColumns : landscapeColumns;
    
    return [
      styles.grid,
      {
        gap,
        flexDirection: columns > 1 ? 'row' : 'column',
        flexWrap: columns > 1 ? 'wrap' : 'nowrap',
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

interface OrientationTextProps {
  children: React.ReactNode;
  portraitSize?: number;
  landscapeSize?: number;
  style?: any;
}

export function OrientationText({ 
  children, 
  portraitSize = 16,
  landscapeSize = 14,
  style 
}: OrientationTextProps) {
  const { orientation } = useResponsive();

  const getFontSize = () => {
    return orientation === 'portrait' ? portraitSize : landscapeSize;
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

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  glass?: boolean;
};

export function Card({ children, style, elevated, glass }: Props) {
  return (
    <View style={[
      styles.card,
      glass && styles.glass,
      elevated && styles.elevated,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  elevated: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});

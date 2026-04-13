import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

type Props = {
  current: number;
  total: number;
};

export function CalmProgressBar({ current, total }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.segments}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              i < current ? styles.segmentFilled : styles.segmentEmpty,
            ]}
          />
        ))}
      </View>
      <Text style={styles.label}>{current}/{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  segments: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  segment: {
    flex: 1,
    height: 5,
    borderRadius: radius.full,
  },
  segmentFilled: {
    backgroundColor: colors.primary,
  },
  segmentEmpty: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  label: {
    ...typography.labelSmall,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary,
    fontSize: 12,
    minWidth: 24,
    textAlign: 'right',
  },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../../theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function EmotionChip({ label, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    margin: spacing.xs / 2,
  },
  selected: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primary,
  },
  label: {
    ...typography.labelLarge,
    fontFamily: 'Manrope_500Medium',
    color: colors.onSurfaceVariant,
  },
  labelSelected: {
    color: colors.onPrimaryContainer,
  },
});

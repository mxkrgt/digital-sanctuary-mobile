import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { MaterialIcon } from './MaterialIcon';
import { colors, typography, spacing, radius } from '../../theme';

type Props = TextInputProps & {
  label: string;
  icon: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export function Input({ label, icon, error, containerStyle, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.fieldFocused, error && styles.fieldError]}>
        <MaterialIcon name={icon} size={20} color={focused ? colors.primary : colors.onSurfaceVariant} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.outlineVariant}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    ...typography.labelLarge,
    fontFamily: 'Manrope_500Medium',
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  fieldFocused: { borderColor: colors.primary, backgroundColor: colors.surfaceContainerLowest },
  fieldError: { borderColor: colors.error },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurface,
  },
  error: {
    ...typography.bodyMedium,
    fontFamily: 'Manrope_400Regular',
    color: colors.error,
    marginTop: spacing.xs,
  },
});

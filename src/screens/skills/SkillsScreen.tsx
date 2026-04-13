import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { colors, typography, spacing } from '../../theme';

export function SkillsScreen() {
  return (
    <SafeScreen>
      <View style={styles.container}>
        <MaterialIcon name="self-improvement" size={64} color={colors.outlineVariant} />
        <Text style={styles.title}>Compétences DBT</Text>
        <Text style={styles.subtitle}>Bientôt disponible</Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  title: {
    ...typography.headlineSmall,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.onBackground,
  },
  subtitle: {
    ...typography.bodyLarge,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurfaceVariant,
  },
});

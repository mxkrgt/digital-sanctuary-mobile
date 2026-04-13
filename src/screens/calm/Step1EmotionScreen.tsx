import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { CalmProgressBar } from '../../components/ui/CalmProgressBar';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { useCalm } from '../../contexts/CalmContext';
import { CalmStackParams } from '../../navigation/CalmStack';
import { colors, typography, spacing, radius } from '../../theme';

type Nav = StackNavigationProp<CalmStackParams, 'Step1'>;

const PRIMARY_EMOTIONS = [
  { name: 'Tristesse', icon: 'water-drop' },
  { name: 'Col\u00e8re', icon: 'local-fire-department' },
  { name: 'D\u00e9go\u00fbt', icon: 'sentiment-dissatisfied' },
  { name: 'Envie', icon: 'visibility' },
  { name: 'Peur', icon: 'warning' },
  { name: 'Joie', icon: 'sentiment-very-satisfied' },
  { name: 'Jalousie', icon: 'heart-broken' },
  { name: 'Amour', icon: 'favorite' },
  { name: 'Honte', icon: 'face-6' },
  { name: 'Culpabilit\u00e9', icon: 'priority-high' },
];

const NUANCES_BY_EMOTION: Record<string, string[]> = {
  Tristesse: ['D\u00e9ception', 'D\u00e9sespoir', 'Nostalgie', 'M\u00e9lancolie', 'Abattement', 'Solitude'],
  'Col\u00e8re': ['Frustration', 'Irritation', 'Rage', 'Exasp\u00e9ration', 'Indignation', 'Ressentiment'],
  'D\u00e9go\u00fbt': ['R\u00e9pulsion', 'M\u00e9pris', 'Aversion', 'R\u00e9vulsion'],
  Envie: ['Convoitise', 'D\u00e9sir', 'Aspiration', 'Ambition'],
  Peur: ['Anxi\u00e9t\u00e9', 'Appr\u00e9hension', 'Terreur', 'Inqui\u00e9tude', 'Panique'],
  Joie: ['Bonheur', 'S\u00e9r\u00e9nit\u00e9', 'Euphorie', 'Gratitude', 'Fiert\u00e9', 'Enthousiasme'],
  Jalousie: ['Envie', 'Rivalit\u00e9', 'Possessivit\u00e9', 'M\u00e9fiance'],
  Amour: ['Tendresse', 'Affection', 'Adoration', 'Compassion', 'Attachement'],
  Honte: ['Humiliation', 'Embarras', 'G\u00eane'],
  'Culpabilit\u00e9': ['Regret', 'Remords', 'Repentir'],
};

export function Step1EmotionScreen() {
  const navigation = useNavigation<Nav>();
  const { updateDraft } = useCalm();
  const [selected, setSelected] = useState(\'\');
  const [nuance, setNuance] = useState(\'\');

  const nuances = selected ? (NUANCES_BY_EMOTION[selected] ?? []) : [];
  const emotionName = nuance || selected;

  const handleSelectEmotion = (name: string) => {
    if (selected === name) {
      setSelected(\'\');
    } else {
      setSelected(name);
      setNuance(\'\');
    }
  };

  const handleNext = () => {
    if (!emotionName) return;
    updateDraft({ emotion_name: emotionName });
    navigation.navigate(\'Step23\');
  };

  return (
    <SafeScreen>
      <CalmProgressBar current={1} total={8} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.stepBadgeRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>\u00c9tape 1</Text>
          </View>
        </View>
        <Text style={styles.heading}>L\u2019\u00c9motion</Text>
        <Text style={styles.question}>Quelle sensation traverse votre esprit\u00a0?</Text>
        <View style={styles.grid}>
          {PRIMARY_EMOTIONS.map((e) => {
            const isSelected = selected === e.name;
            return (
              <TouchableOpacity
                key={e.name}
                style={[styles.emotionCard, isSelected && styles.emotionCardSelected]}
                onPress={() => handleSelectEmotion(e.name)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                  <MaterialIcon
                    name={e.icon}
                    size={28}
                    color={isSelected ? colors.primary : colors.onSurfaceVariant}
                  />
                </View>
                <Text style={[styles.emotionLabel, isSelected && styles.emotionLabelSelected]}>
                  {e.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {nuances.length > 0 && (
          <View style={styles.nuancesSection}>
            <Text style={styles.nuancesTitle}>Affiner votre sentiment</Text>
            <View style={styles.nuanceChips}>
              {nuances.map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.nuanceChip, nuance === n && styles.nuanceChipSelected]}
                  onPress={() => setNuance(nuance === n ? \'\' : n)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.nuanceLabel, nuance === n && styles.nuanceLabelSelected]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !emotionName && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!emotionName}
          activeOpacity={0.8}
        >
          <Text style={styles.nextLabel}>Suivant</Text>
          <MaterialIcon name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  stepBadgeRow: { flexDirection: \'row\', marginBottom: spacing.sm },
  stepBadge: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: \'700\' as const,
    fontFamily: \'Manrope_700Bold\',
    color: colors.onPrimaryContainer,
    textTransform: \'uppercase\',
    letterSpacing: 1.2,
  },
  heading: {
    fontSize: 36,
    fontWeight: \'800\' as const,
    fontFamily: \'Manrope_800ExtraBold\',
    color: colors.onBackground,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  question: {
    ...typography.bodyLarge,
    fontFamily: \'Manrope_400Regular\',
    color: colors.onSurfaceVariant,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  grid: {
    flexDirection: \'row\',
    flexWrap: \'wrap\',
    gap: spacing.sm,
    justifyContent: \'space-between\',
  },
  emotionCard: {
    width: \'47%\',
    alignItems: \'center\',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    backgroundColor: \'rgba(255,255,255,0.5)\',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: \'rgba(255,255,255,0.4)\',
  },
  emotionCardSelected: {
    backgroundColor: \'rgba(144,205,253,0.35)\',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: \'center\',
    alignItems: \'center\',
  },
  iconCircleSelected: { backgroundColor: \'rgba(255,255,255,0.8)\' },
  emotionLabel: {
    ...typography.labelLarge,
    fontFamily: \'Manrope_600SemiBold\',
    color: colors.onSurfaceVariant,
    textAlign: \'center\',
  },
  emotionLabelSelected: { color: colors.onPrimaryContainer },
  nuancesSection: { marginTop: spacing.xl },
  nuancesTitle: {
    fontSize: 10,
    fontWeight: \'700\' as const,
    fontFamily: \'Manrope_700Bold\',
    color: colors.onSurfaceVariant,
    textTransform: \'uppercase\',
    letterSpacing: 1.5,
    textAlign: \'center\',
    marginBottom: spacing.md,
  },
  nuanceChips: {
    flexDirection: \'row\',
    flexWrap: \'wrap\',
    gap: spacing.sm,
    justifyContent: \'center\',
  },
  nuanceChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
  },
  nuanceChipSelected: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  nuanceLabel: {
    ...typography.labelLarge,
    fontFamily: \'Manrope_500Medium\',
    color: colors.onSurfaceVariant,
  },
  nuanceLabelSelected: { fontFamily: \'Manrope_700Bold\', color: colors.onPrimaryContainer },
  footer: {
    padding: spacing.md,
    backgroundColor: \'rgba(255,255,255,0.6)\',
    borderTopWidth: 1,
    borderTopColor: \'rgba(255,255,255,0.4)\',
  },
  nextBtn: {
    flexDirection: \'row\',
    alignItems: \'center\',
    justifyContent: \'center\',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextLabel: {
    fontSize: 16,
    fontWeight: \'700\' as const,
    fontFamily: \'Manrope_700Bold\',
    color: colors.onPrimary,
  },
});

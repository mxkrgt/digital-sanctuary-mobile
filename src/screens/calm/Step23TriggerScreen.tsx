import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { CalmProgressBar } from '../../components/ui/CalmProgressBar';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { useCalm } from '../../contexts/CalmContext';
import { CalmStackParams } from '../../navigation/CalmStack';
import { colors, typography, spacing, radius } from '../../theme';

type Nav = StackNavigationProp<CalmStackParams, 'Step23'>;

export function Step23TriggerScreen() {
  const navigation = useNavigation<Nav>();
  const { updateDraft } = useCalm();
  const [trigger, setTrigger] = useState('');
  const [sommeil, setSommeil] = useState(50);
  const [stress, setStress] = useState(50);
  const [alimentation, setAlimentation] = useState(50);

  const handleNext = () => {
    updateDraft({
      trigger: trigger.trim() || undefined,
      vulnerability: `Sommeil:${sommeil}/Stress:${stress}/Alimentation:${alimentation}`,
    });
    navigation.navigate('Step45');
  };

  return (
    <SafeScreen>
      <CalmProgressBar current={2} total={8} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Step 2 */}
        <View style={styles.stepBadgeRow}>
          <View style={[styles.stepBadge, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[styles.stepBadgeText, { color: colors.onPrimaryContainer }]}>{"Étape 2"}</Text>
          </View>
        </View>
        <Text style={styles.heading}>Le D{"é"}clencheur</Text>
        <Text style={styles.question}>{"Qu’est-ce qui s’est passé ? Identifiez l’événement qui a initié l’émotion."}</Text>
        <View style={styles.glassPanel}>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={5}
            placeholder={"Décrivez l’événement externe ou interne sans jugement..."}
            placeholderTextColor={colors.outline}
            value={trigger}
            onChangeText={setTrigger}
            textAlignVertical="top"
          />
        </View>

        {/* Step 3 */}
        <View style={[styles.stepBadgeRow, { marginTop: spacing.xl }]}>
          <View style={[styles.stepBadge, { backgroundColor: colors.secondaryContainer }]}>
            <Text style={[styles.stepBadgeText, { color: colors.onSecondaryContainer }]}>{"Étape 3"}</Text>
          </View>
        </View>
        <Text style={styles.heading}>Vuln{"é"}rabilit{"é"}</Text>
        <Text style={styles.question}>{"Facteurs biologiques et environnementaux avant l’événement."}</Text>

        <VulnSlider label="Sommeil" icon="bedtime" value={sommeil} onChange={setSommeil} leftLabel={"Épuisé"} rightLabel="Reposé" />
        <VulnSlider label="Stress global" icon="bolt" value={stress} onChange={setStress} leftLabel="Calme" rightLabel="Surchargé" iconColor={colors.error} />
        <VulnSlider label="Alimentation" icon="restaurant" value={alimentation} onChange={setAlimentation} leftLabel="Satiété" rightLabel="Affamé" iconColor={colors.secondary} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.nextLabel}>Continuer l{''}analyse</Text>
          <MaterialIcon name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

function VulnSlider({
  label, icon, value, onChange, leftLabel, rightLabel, iconColor,
}: {
  label: string; icon: string; value: number; onChange: (v: number) => void;
  leftLabel: string; rightLabel: string; iconColor?: string;
}) {
  return (
    <View style={sliderStyles.panel}>
      <View style={sliderStyles.header}>
        <View style={sliderStyles.labelRow}>
          <MaterialIcon name={icon} size={20} color={iconColor ?? colors.primary} />
          <Text style={sliderStyles.label}>{label}</Text>
        </View>
        <Text style={sliderStyles.value}>{value}</Text>
      </View>
      <View style={sliderStyles.track}>
        <View style={[sliderStyles.fill, { width: `${value}%` }]} />
      </View>
      <View style={sliderStyles.scaleRow}>
        {[0, 25, 50, 75, 100].map((v) => (
          <TouchableOpacity
            key={v}
            style={[sliderStyles.tick, value === v && sliderStyles.tickActive]}
            onPress={() => onChange(v)}
          >
            <Text style={[sliderStyles.tickLabel, value === v && sliderStyles.tickLabelActive]}>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={sliderStyles.rangeRow}>
        <Text style={sliderStyles.rangeLabel}>{leftLabel}</Text>
        <Text style={sliderStyles.rangeLabel}>{rightLabel}</Text>
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  panel: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { fontSize: 14, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onSurface },
  value: { fontSize: 20, fontWeight: '800' as const, fontFamily: 'Manrope_800ExtraBold', color: colors.primary },
  track: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  fill: { height: '100%', borderRadius: radius.full, backgroundColor: colors.primary },
  scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  tick: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: radius.full,
  },
  tickActive: { backgroundColor: colors.primaryContainer },
  tickLabel: { fontSize: 11, fontFamily: 'Manrope_500Medium', color: colors.outlineVariant },
  tickLabelActive: { color: colors.onPrimaryContainer, fontFamily: 'Manrope_700Bold' },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  rangeLabel: { fontSize: 10, fontFamily: 'Manrope_500Medium', color: colors.outlineVariant, textTransform: 'uppercase', letterSpacing: 0.8 },
});

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  stepBadgeRow: { flexDirection: 'row', marginBottom: spacing.sm },
  stepBadge: { borderRadius: radius.full, paddingVertical: 4, paddingHorizontal: spacing.sm },
  stepBadgeText: { fontSize: 10, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', textTransform: 'uppercase', letterSpacing: 1.2 },
  heading: { fontSize: 36, fontWeight: '800' as const, fontFamily: 'Manrope_800ExtraBold', color: colors.onBackground, letterSpacing: -0.5, marginBottom: spacing.xs },
  question: { ...typography.bodyLarge, fontFamily: 'Manrope_400Regular', color: colors.onSurfaceVariant, marginBottom: spacing.md, lineHeight: 24 },
  glassPanel: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  textarea: { ...typography.bodyLarge, fontFamily: 'Manrope_400Regular', color: colors.onSurface, minHeight: 120 },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
  },
  backBtn: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minHeight: 56,
  },
  nextLabel: { fontSize: 16, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onPrimary },
});

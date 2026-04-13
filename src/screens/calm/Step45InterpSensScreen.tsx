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

type Nav = StackNavigationProp<CalmStackParams, 'Step45'>;

const SENSATIONS = [
  { label: 'Visage chaud', icon: 'face', color: colors.primaryContainer },
  { label: 'Poitrine serrée', icon: 'monitor-heart', color: '#ffd0d0' },
  { label: 'Mains tremblantes', icon: 'back-hand', color: colors.secondaryContainer },
  { label: 'Souffle court', icon: 'air', color: colors.tertiaryContainer },
];

export function Step45InterpSensScreen() {
  const navigation = useNavigation<Nav>();
  const { updateDraft } = useCalm();
  const [interpretations, setInterpretations] = useState('');
  const [checkedSens, setCheckedSens] = useState<string[]>([]);
  const [freeSens, setFreeSens] = useState('');

  const toggleSens = (s: string) => {
    setCheckedSens((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleNext = () => {
    const allSensations = [...checkedSens, ...(freeSens.trim() ? [freeSens.trim()] : [])].join(', ');
    updateDraft({
      interpretations: interpretations.trim() || undefined,
      sensations: allSensations || undefined,
    });
    navigation.navigate('Step67');
  };

  return (
    <SafeScreen>
      <CalmProgressBar current={4} total={8} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Step 4 */}
        <View style={styles.stepBadgeRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{"Étape 4"}</Text>
          </View>
        </View>
        <Text style={styles.heading}>Interpr{"é"}tations</Text>
        <Text style={styles.question}>{"Quelles sont les pensées, croyances ou suppositions qui traversent votre esprit ?"}</Text>
        <View style={styles.glassPanel}>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={5}
            placeholder={"Ex : ‘Je pense que je ne vais pas y arriver’, ‘Il me juge sûrement’..."}
            placeholderTextColor={colors.outline}
            value={interpretations}
            onChangeText={setInterpretations}
            textAlignVertical="top"
          />
        </View>

        {/* Step 5 */}
        <View style={[styles.stepBadgeRow, { marginTop: spacing.xl }]}>
          <View style={[styles.stepBadge, { backgroundColor: colors.secondaryContainer }]}>
            <Text style={[styles.stepBadgeText, { color: colors.onSecondaryContainer }]}>{"Étape 5"}</Text>
          </View>
        </View>
        <Text style={styles.heading}>Sensations</Text>
        <Text style={styles.question}>Que ressentez-vous physiquement ?</Text>

        <View style={styles.sensGrid}>
          {SENSATIONS.map((s) => {
            const checked = checkedSens.includes(s.label);
            return (
              <TouchableOpacity
                key={s.label}
                style={[styles.sensCard, checked && styles.sensCardChecked]}
                onPress={() => toggleSens(s.label)}
                activeOpacity={0.7}
              >
                <View style={[styles.sensIconCircle, { backgroundColor: s.color }]}>
                  <MaterialIcon name={s.icon} size={26} color={colors.primary} />
                </View>
                <Text style={styles.sensLabel}>{s.label}</Text>
                {checked && (
                  <View style={styles.checkDot}>
                    <MaterialIcon name="check" size={12} color={colors.onPrimary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.freeInputPanel}>
          <Text style={styles.freeInputLabel}>Pr{"é"}cisions (Optionnel)</Text>
          <TextInput
            style={styles.freeInput}
            placeholder="Détaillez une autre sensation..."
            placeholderTextColor={colors.outline}
            value={freeSens}
            onChangeText={setFreeSens}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.nextLabel}>Continuer</Text>
          <MaterialIcon name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  stepBadgeRow: { flexDirection: 'row', marginBottom: spacing.sm },
  stepBadge: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  stepBadgeText: { fontSize: 10, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onPrimaryContainer, textTransform: 'uppercase', letterSpacing: 1.2 },
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
  sensGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  sensCard: {
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: spacing.sm,
    position: 'relative',
    minHeight: 100,
  },
  sensCardChecked: { borderColor: colors.primary, backgroundColor: 'rgba(144,205,253,0.2)' },
  sensIconCircle: { width: 52, height: 52, borderRadius: radius.full, justifyContent: 'center', alignItems: 'center' },
  sensLabel: { fontSize: 12, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onSurface, textAlign: 'center' },
  checkDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  freeInputPanel: { backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', padding: spacing.md },
  freeInputLabel: { fontSize: 10, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm },
  freeInput: { ...typography.bodyLarge, fontFamily: 'Manrope_400Regular', color: colors.onSurface, minHeight: 44 },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
  },
  backBtn: { width: 56, height: 56, borderRadius: radius.full, backgroundColor: colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  nextBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.full, minHeight: 56 },
  nextLabel: { fontSize: 16, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onPrimary },
});

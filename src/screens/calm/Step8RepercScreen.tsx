import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { CalmProgressBar } from '../../components/ui/CalmProgressBar';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { useCalm } from '../../contexts/CalmContext';
import { entriesApi } from '../../api/emotionEntries';
import { CalmStackParams } from '../../navigation/CalmStack';
import { colors, typography, spacing, radius } from '../../theme';

type Nav = StackNavigationProp<CalmStackParams, 'Step8'>;

export function Step8RepercScreen() {
  const navigation = useNavigation<Nav>();
  const { draft, updateDraft, resetDraft } = useCalm();
  const [repercussions, setRepercussions] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    updateDraft({ repercussions: repercussions.trim() || undefined });
    const finalDraft = { ...draft, repercussions: repercussions.trim() || undefined };
    if (!finalDraft.emotion_name) {
      Alert.alert('Erreur', 'Aucune émotion sélectionnée');
      return;
    }
    if (finalDraft.intensity === undefined) finalDraft.intensity = 50;
    setLoading(true);
    try {
      await entriesApi.create(finalDraft as any);
      setSaved(true);
      resetDraft();
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || 'Erreur lors de la sauvegarde';
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <SafeScreen>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <MaterialIcon name="task-alt" size={48} color={colors.secondary} />
          </View>
          <Text style={styles.successTitle}>Observation sauvegardée !</Text>
          <Text style={styles.successSubtitle}>
            {"Félicitations pour votre travail de prise de conscience.
Chaque observation vous rapproche de votre équilibre."}
          </Text>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.getParent()?.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.doneBtnLabel}>Terminer</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <CalmProgressBar current={8} total={8} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.stepBadgeRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{"Étape 8"}</Text>
          </View>
        </View>
        <Text style={styles.heading}>Répercussions</Text>
        <Text style={styles.question}>Quelles sont les suites de cette émotion ?</Text>

        <View style={styles.glassPanel}>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={5}
            placeholder="Sensations persistantes, nouvelles pensées, écho émotionnel..."
            placeholderTextColor={colors.outline}
            value={repercussions}
            onChangeText={setRepercussions}
            textAlignVertical="top"
          />
        </View>

        <Text style={styles.summaryTitle}>Récapitulatif</Text>
        <View style={styles.summaryCard}>
          {draft.emotion_name ? <SummaryRow label="Émotion" value={draft.emotion_name} /> : null}
          {draft.trigger ? <SummaryRow label="Déclencheur" value={draft.trigger} /> : null}
          {draft.interpretations ? <SummaryRow label="Interprétations" value={draft.interpretations} /> : null}
          {draft.sensations ? <SummaryRow label="Sensations" value={draft.sensations} /> : null}
          {draft.urges ? <SummaryRow label="Urgences" value={draft.urges} /> : null}
          {draft.actions_taken ? <SummaryRow label="Actions" value={draft.actions_taken} /> : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <>
              <MaterialIcon name="task-alt" size={20} color={colors.onPrimary} />
              <Text style={styles.saveLabel}>Sauvegarder</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={summaryStyles.row}>
      <Text style={summaryStyles.label}>{label}</Text>
      <Text style={summaryStyles.value} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
  },
  label: { width: 110, ...typography.labelLarge, fontFamily: 'Manrope_600SemiBold', color: colors.onSurfaceVariant },
  value: { flex: 1, ...typography.bodyMedium, fontFamily: 'Manrope_400Regular', color: colors.onSurface },
});

const styles = StyleSheet.create({
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  stepBadgeRow: { flexDirection: 'row', marginBottom: spacing.sm },
  stepBadge: { backgroundColor: colors.primaryContainer, borderRadius: radius.full, paddingVertical: 4, paddingHorizontal: spacing.sm },
  stepBadgeText: { fontSize: 10, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onPrimaryContainer, textTransform: 'uppercase', letterSpacing: 1.2 },
  heading: { fontSize: 36, fontWeight: '800' as const, fontFamily: 'Manrope_800ExtraBold', color: colors.onBackground, letterSpacing: -0.5, marginBottom: spacing.xs },
  question: { ...typography.bodyLarge, fontFamily: 'Manrope_400Regular', color: colors.onSurfaceVariant, marginBottom: spacing.md, lineHeight: 24 },
  glassPanel: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  textarea: { ...typography.bodyLarge, fontFamily: 'Manrope_400Regular', color: colors.onSurface, minHeight: 120 },
  summaryTitle: { fontSize: 16, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onBackground, marginBottom: spacing.sm },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    padding: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
  },
  backBtn: { width: 56, height: 56, borderRadius: radius.full, backgroundColor: colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minHeight: 56,
  },
  saveLabel: { fontSize: 16, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onPrimary },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl, gap: spacing.lg },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: { fontSize: 28, fontWeight: '800' as const, fontFamily: 'Manrope_800ExtraBold', color: colors.onBackground, textAlign: 'center', letterSpacing: -0.3 },
  successSubtitle: { ...typography.bodyLarge, fontFamily: 'Manrope_400Regular', color: colors.onSurfaceVariant, textAlign: 'center', lineHeight: 24 },
  doneBtn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.md, paddingHorizontal: spacing.xxl, marginTop: spacing.md },
  doneBtnLabel: { fontSize: 16, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onPrimary },
});

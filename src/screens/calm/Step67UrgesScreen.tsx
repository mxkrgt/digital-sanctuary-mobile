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

type Nav = StackNavigationProp<CalmStackParams, 'Step67'>;

export function Step67UrgesScreen() {
  const navigation = useNavigation<Nav>();
  const { updateDraft } = useCalm();
  const [urges, setUrges] = useState('');
  const [bodyLanguage, setBodyLanguage] = useState('');
  const [wordsSaid, setWordsSaid] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');

  const handleNext = () => {
    updateDraft({
      urges: urges.trim() || undefined,
      body_language: bodyLanguage.trim() || undefined,
      words_said: wordsSaid.trim() || undefined,
      actions_taken: actionsTaken.trim() || undefined,
    });
    navigation.navigate('Step8');
  };

  return (
    <SafeScreen>
      <CalmProgressBar current={6} total={8} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Step 6 */}
        <View style={styles.stepBadgeRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{"Étape 6"}</Text>
          </View>
        </View>
        <Text style={styles.heading}>Urgences</Text>
        <Text style={styles.question}>Ce que vous vouliez faire</Text>
        <View style={styles.glassPanel}>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={4}
            placeholder="Vos impulsions, ce que vous vouliez faire ou dire..."
            placeholderTextColor={colors.outline}
            value={urges}
            onChangeText={setUrges}
            textAlignVertical="top"
          />
        </View>

        {/* Step 7 */}
        <View style={[styles.stepBadgeRow, { marginTop: spacing.xl }]}>
          <View style={[styles.stepBadge, { backgroundColor: colors.secondaryContainer }]}>
            <Text style={[styles.stepBadgeText, { color: colors.onSecondaryContainer }]}>{"Étape 7"}</Text>
          </View>
        </View>
        <Text style={styles.heading}>Expression</Text>
        <Text style={styles.question}>Comment vous vous {"êtes"} exprim{"é"}</Text>

        <ExpressionField
          label="Langage corporel"
          icon="accessibility"
          placeholder="Posture, gestes, expressions..."
          value={bodyLanguage}
          onChangeText={setBodyLanguage}
        />
        <ExpressionField
          label="Ce que j'ai dit"
          icon="chat-bubble-outline"
          placeholder="Mots, tons, silence..."
          value={wordsSaid}
          onChangeText={setWordsSaid}
        />
        <ExpressionField
          label="Ce que j'ai fait"
          icon="directions-run"
          placeholder="Actions, comportements, décisions..."
          value={actionsTaken}
          onChangeText={setActionsTaken}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.nextLabel}>Suivant</Text>
          <MaterialIcon name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

function ExpressionField({ label, icon, placeholder, value, onChangeText }: {
  label: string; icon: string; placeholder: string; value: string; onChangeText: (t: string) => void;
}) {
  return (
    <View style={exprStyles.panel}>
      <View style={exprStyles.labelRow}>
        <MaterialIcon name={icon} size={16} color={colors.primary} />
        <Text style={exprStyles.label}>{label}</Text>
      </View>
      <TextInput
        style={exprStyles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
        value={value}
        onChangeText={onChangeText}
        textAlignVertical="top"
        multiline
        numberOfLines={2}
      />
    </View>
  );
}

const exprStyles = StyleSheet.create({
  panel: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  label: { fontSize: 10, fontWeight: '700' as const, fontFamily: 'Manrope_700Bold', color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1.2 },
  input: { ...typography.bodyLarge, fontFamily: 'Manrope_400Regular', color: colors.onSurface, minHeight: 60 },
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
    marginBottom: spacing.md,
  },
  textarea: { ...typography.bodyLarge, fontFamily: 'Manrope_400Regular', color: colors.onSurface, minHeight: 100 },
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

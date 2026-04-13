import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { useAuth } from '../../contexts/AuthContext';
import { colors, typography, spacing, radius } from '../../theme';
import { AuthStackParams } from '../../navigation/AuthStack';

type Nav = StackNavigationProp<AuthStackParams, 'Register'>;

const BADGES = [
  { icon: 'verified-user', label: 'Sécurisé & Privé' },
  { icon: 'eco', label: 'DBT Approuvé' },
  { icon: 'favorite', label: 'Recommandé' },
];

export function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Champ requis';
    if (!email) e.email = 'Champ requis';
    if (password.length < 8) e.password = 'Au moins 8 caractères';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || "Erreur lors de l'inscription";
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Glass card */}
        <View style={styles.card}>
          {/* Branding */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <MaterialIcon name="spa" size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Digital Sanctuary</Text>
            <Text style={styles.subtitle}>Commencez votre voyage vers la sérénité.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="NOM COMPLET"
              icon="person"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            <Input
              label="ADRESSE E-MAIL"
              icon="mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              error={errors.email}
            />
            <Input
              label="MOT DE PASSE"
              icon="lock"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <Button
              label="Créer mon compte"
              onPress={handleSignup}
              loading={loading}
              style={styles.cta}
            />
          </View>

          {/* Login link */}
          <View style={styles.divider} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.loginBtn}
          >
            <Text style={styles.loginText}>
              Déjà un compte ? 
              <Text style={styles.loginBold}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trust chips */}
        <View style={styles.badges}>
          {BADGES.map((b) => (
            <View key={b.label} style={styles.badge}>
              <MaterialIcon name={b.icon} size={14} color={colors.secondary} />
              <Text style={styles.badgeText}>{b.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center', paddingVertical: spacing.xxl },
  card: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800' as const,
    fontFamily: 'Manrope_800ExtraBold',
    color: colors.onBackground,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyLarge,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  form: { gap: spacing.xs },
  cta: { marginTop: spacing.md },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: spacing.lg,
  },
  loginBtn: { alignItems: 'center' },
  loginText: {
    ...typography.bodyMedium,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurfaceVariant,
  },
  loginBold: {
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary,
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.5)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  badgeText: {
    ...typography.labelLarge,
    fontFamily: 'Manrope_500Medium',
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
});

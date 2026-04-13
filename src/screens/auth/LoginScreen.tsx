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

type Nav = StackNavigationProp<AuthStackParams, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Champ requis';
    if (!password) e.password = 'Champ requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || 'Identifiants incorrects';
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
            <Text style={styles.subtitle}>Retrouvez votre calme intérieur.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="E-MAIL"
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
            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>Oublié ?</Text>
            </TouchableOpacity>

            <Button
              label="Se connecter"
              onPress={handleLogin}
              loading={loading}
              style={styles.cta}
            />
          </View>

          {/* Register link */}
          <View style={styles.divider} />
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.registerText}>
              Pas encore de compte ? 
              <Text style={styles.registerBold}>Créer un compte</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Conditions · Confidentialité · Aide</Text>
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
  forgot: { alignSelf: 'flex-end', paddingVertical: spacing.xs, marginTop: -spacing.sm },
  forgotText: {
    ...typography.labelLarge,
    fontFamily: 'Manrope_500Medium',
    color: colors.primary,
  },
  cta: { marginTop: spacing.md },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: spacing.lg,
  },
  registerBtn: { alignItems: 'center' },
  registerText: {
    ...typography.bodyMedium,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurfaceVariant,
  },
  registerBold: {
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary,
  },
  footer: { alignItems: 'center', marginTop: spacing.xl, paddingBottom: spacing.lg },
  footerText: {
    ...typography.labelSmall,
    fontFamily: 'Manrope_300Light',
    color: colors.outlineVariant,
  },
});

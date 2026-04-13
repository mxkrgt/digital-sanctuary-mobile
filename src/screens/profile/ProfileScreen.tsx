import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { Card } from '../../components/ui/Card';
import { useEmotionEntries } from '../../hooks/useEmotionEntries';
import { statsApi } from '../../api/statistics';
import { useAuth } from '../../contexts/AuthContext';
import { Stats } from '../../types';
import { colors, typography, spacing, radius } from '../../theme';
import { RootStackParams } from '../../navigation/MainTabs';

type Nav = StackNavigationProp<RootStackParams>;

const STAT_LABELS = ['STABLE', 'ELEVATION', 'CALME', 'VITALITE'];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();
  const { entries, loading, refresh } = useEmotionEntries();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    refresh();
    statsApi.get().then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcon name="analytics" size={28} color={colors.primary} />
          <Text style={styles.headerTitle}>Data-Soul</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <MaterialIcon name="logout" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={entries}
        keyExtractor={(e) => e.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <>
            {/* User info */}
            <Card style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() ?? '?'}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </Card>

            {/* Stats */}
            {stats && (
              <View style={styles.statsRow}>
                <Card style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.total_entries}</Text>
                  <Text style={styles.statLabel}>Observations</Text>
                </Card>
                <Card style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.streak}</Text>
                  <Text style={styles.statLabel}>Jours streak</Text>
                </Card>
                <Card style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.reflections}</Text>
                  <Text style={styles.statLabel}>Reflexions</Text>
                </Card>
              </View>
            )}

            {/* Mini graph placeholder */}
            <Card style={styles.graphCard}>
              <Text style={styles.graphTitle}>15 derniers jours</Text>
              <View style={styles.graphBars}>
                {entries.slice(0, 15).map((e, i) => (
                  <View key={e.id} style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        { height: Math.max(4, (e.intensity / 100) * 60) },
                      ]}
                    />
                  </View>
                ))}
              </View>
              <View style={styles.graphLabels}>
                {STAT_LABELS.map((l) => (
                  <Text key={l} style={styles.graphLabel}>{l}</Text>
                ))}
              </View>
            </Card>

            <Text style={styles.sectionTitle}>Journal</Text>
          </>
        }
        renderItem={({ item: entry }) => (
          <Card elevated style={styles.entryCard}>
            <View style={styles.entryRow}>
              <View style={styles.entryIcon}>
                <MaterialIcon name="psychology" size={22} color={colors.primary} />
              </View>
              <View style={styles.entryBody}>
                <Text style={styles.entryEmotion}>{entry.emotion_name}</Text>
                <Text style={styles.entryTime}>{formatTime(entry.created_at)}</Text>
                {entry.trigger ? (
                  <Text style={styles.entryExcerpt} numberOfLines={2}>{entry.trigger}</Text>
                ) : null}
              </View>
              <Text style={styles.entryIntensity}>{entry.intensity}%</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <MaterialIcon name="menu-book" size={48} color={colors.outlineVariant} />
              <Text style={styles.emptyText}>Votre journal est vide</Text>
            </View>
          ) : null
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Calm')}
        activeOpacity={0.8}
      >
        <MaterialIcon name="add" size={24} color={colors.onPrimary} />
        <Text style={styles.fabLabel}>Ecrire</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerTitle: {
    ...typography.titleLarge,
    fontFamily: 'Manrope_500Medium',
    color: colors.onBackground,
  },
  list: { padding: spacing.md, paddingBottom: 100 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.titleLarge,
    fontFamily: 'Manrope_500Medium',
    color: colors.primary,
  },
  userInfo: { flex: 1 },
  userName: {
    ...typography.titleMedium,
    fontFamily: 'Manrope_500Medium',
    color: colors.onSurface,
  },
  userEmail: {
    ...typography.bodyMedium,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurfaceVariant,
  },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: {
    ...typography.headlineSmall,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary,
  },
  statLabel: {
    ...typography.labelSmall,
    fontFamily: 'Manrope_300Light',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  graphCard: { marginBottom: spacing.lg },
  graphTitle: {
    ...typography.titleMedium,
    fontFamily: 'Manrope_500Medium',
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  graphBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 64,
    gap: 4,
  },
  barWrapper: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  bar: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    opacity: 0.7,
  },
  graphLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  graphLabel: {
    ...typography.labelSmall,
    fontFamily: 'Manrope_300Light',
    color: colors.onSurfaceVariant,
  },
  sectionTitle: {
    ...typography.titleMedium,
    fontFamily: 'Manrope_500Medium',
    color: colors.onBackground,
    marginBottom: spacing.sm,
  },
  entryCard: { marginBottom: spacing.sm },
  entryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryBody: { flex: 1 },
  entryEmotion: {
    ...typography.titleMedium,
    fontFamily: 'Manrope_500Medium',
    color: colors.onSurface,
  },
  entryTime: {
    ...typography.labelSmall,
    fontFamily: 'Manrope_300Light',
    color: colors.onSurfaceVariant,
  },
  entryExcerpt: {
    ...typography.bodyMedium,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  entryIntensity: {
    ...typography.labelLarge,
    fontFamily: 'Manrope_500Medium',
    color: colors.primary,
  },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  emptyText: {
    ...typography.bodyLarge,
    fontFamily: 'Manrope_400Regular',
    color: colors.outlineVariant,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabLabel: {
    ...typography.labelLarge,
    fontFamily: 'Manrope_500Medium',
    color: colors.onPrimary,
  },
});

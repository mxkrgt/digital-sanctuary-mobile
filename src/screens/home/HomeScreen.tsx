import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeScreen } from '../../components/layout/SafeScreen';
import { MaterialIcon } from '../../components/ui/MaterialIcon';
import { useEmotionEntries } from '../../hooks/useEmotionEntries';
import { statsApi } from '../../api/statistics';
import { Stats, EmotionEntry } from '../../types';
import { colors, typography, spacing, radius } from '../../theme';
import { RootStackParams } from '../../navigation/MainTabs';

type Nav = StackNavigationProp<RootStackParams>;

const QUOTE = 'Chaque émotion est une info, pas une obligation.';

const EMOTION_COLORS: Record<string, string> = {
  Tristesse: colors.primaryContainer,
  'Colère': '#ffd5c2',
  Joie: colors.secondaryContainer,
  Peur: '#e6e6fa',
  Amour: '#ffd0d0',
  Honte: '#ffe4b5',
};

const EMOTION_ICON_MAP: Record<string, string> = {
  Tristesse: 'sentiment-very-dissatisfied',
  'Colère': 'mood-bad',
  Joie: 'sentiment-very-satisfied',
  Peur: 'warning',
  Amour: 'favorite',
  Honte: 'hide-source',
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function groupByDay(entries: EmotionEntry[]) {
  if (!Array.isArray(entries)) return [];
  const groups: { day: string; items: EmotionEntry[] }[] = [];
  let currentDay = '';
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const day = new Date(e.created_at).toDateString();
    if (day !== currentDay) {
      currentDay = day;
      groups.push({ day: formatDay(e.created_at), items: [] });
    }
    groups[groups.length - 1].items.push(e);
  }
  return groups;
}

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { entries, loading, refresh } = useEmotionEntries();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    refresh();
    statsApi.get().then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  const groups = groupByDay(entries);

  return (
    <SafeScreen>
      {/* App bar */}
      <View style={styles.appBar}>
        <View>
          <Text style={styles.appBarTitle}>Mes Observations</Text>
          <Text style={styles.appBarSub}>Journal émotionnel DBT</Text>
        </View>
        {stats && (
          <View style={styles.streakBadge}>
            <MaterialIcon name="local-fire-department" size={16} color={colors.error} />
            <Text style={styles.streakText}>{stats.streak}j</Text>
          </View>
        )}
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={groups}
        keyExtractor={(g) => g.day}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.quoteCard}>
            <MaterialIcon name="format-quote" size={18} color={colors.primary} />
            <Text style={styles.quote}>{QUOTE}</Text>
          </View>
        }
        renderItem={({ item: group }) => (
          <View style={styles.group}>
            <Text style={styles.dayLabel}>{group.day}</Text>
            {group.items.map((entry) => {
              const iconBg = EMOTION_COLORS[entry.emotion_name] ?? colors.primaryContainer;
              const intensity = entry.intensity ?? 0;
              return (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={[styles.entryIconCircle, { backgroundColor: iconBg }]}>
                    <MaterialIcon
                      name={EMOTION_ICON_MAP[entry.emotion_name] ?? 'psychology'}
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.entryInfo}>
                    <View style={styles.entryTopRow}>
                      <Text style={styles.emotionName}>{entry.emotion_name}</Text>
                      <Text style={styles.entryTime}>{formatTime(entry.created_at)}</Text>
                    </View>
                    <View style={styles.intensityRow}>
                      <View style={styles.intensityTrack}>
                        <View style={[styles.intensityFill, { width: `${intensity}%` }]} />
                      </View>
                      <Text style={styles.intensityPct}>{intensity}%</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <MaterialIcon name="inbox" size={48} color={colors.outlineVariant} />
              <Text style={styles.emptyText}>Aucune observation pour l'instant</Text>
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
        <MaterialIcon name="add" size={28} color={colors.onPrimary} />
      </TouchableOpacity>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.4)',
  },
  appBarTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    fontFamily: 'Manrope_800ExtraBold',
    color: colors.onBackground,
    letterSpacing: -0.3,
  },
  appBarSub: {
    ...typography.bodyMedium,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radius.full,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  streakText: {
    ...typography.labelLarge,
    fontFamily: 'Manrope_700Bold',
    color: colors.error,
  },
  list: { padding: spacing.md, paddingBottom: 100 },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  quote: {
    flex: 1,
    ...typography.bodyMedium,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  group: { marginBottom: spacing.lg },
  dayLabel: {
    ...typography.labelLarge,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.onSurfaceVariant,
    textTransform: 'capitalize',
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  entryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryInfo: { flex: 1 },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  emotionName: {
    fontSize: 15,
    fontWeight: '700' as const,
    fontFamily: 'Manrope_700Bold',
    color: colors.onSurface,
  },
  entryTime: {
    ...typography.bodyMedium,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  intensityTrack: {
    flex: 1,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
  },
  intensityFill: {
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  intensityPct: {
    ...typography.labelSmall,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.primary,
    fontSize: 11,
    minWidth: 28,
    textAlign: 'right',
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
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

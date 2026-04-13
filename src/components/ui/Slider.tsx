import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
};

export function Slider({ label, value, onChange, min = 0, max = 10 }: Props) {
  const trackWidth = useRef(0);
  const pct = (value - min) / (max - min);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        if (trackWidth.current === 0) return;
        const newPct = Math.max(0, Math.min(1, gs.moveX / trackWidth.current));
        const newVal = Math.round(newPct * (max - min) + min);
        onChange(newVal);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View
        style={styles.track}
        onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
        {...pan.panHandlers}
      >
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
        <View style={[styles.thumb, { left: `${pct * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  label: {
    ...typography.bodyMedium,
    fontFamily: 'Manrope_400Regular',
    color: colors.onSurface,
  },
  value: {
    ...typography.labelLarge,
    fontFamily: 'Manrope_500Medium',
    color: colors.primary,
  },
  track: {
    height: 6,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    position: 'relative',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    marginLeft: -10,
    top: -7,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

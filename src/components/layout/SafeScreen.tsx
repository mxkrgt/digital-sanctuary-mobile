import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function SafeScreen({ children, style }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.blobTopLeft} />
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomRight} />
      <View style={styles.blobBottomLeft} />
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  blobTopLeft: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primaryContainer,
    opacity: 0.55,
  },
  blobTopRight: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.secondaryContainer,
    opacity: 0.4,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.tertiaryContainer,
    opacity: 0.55,
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primaryContainer,
    opacity: 0.35,
  },
  content: { flex: 1 },
});

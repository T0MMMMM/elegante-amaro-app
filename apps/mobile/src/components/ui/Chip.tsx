import PressableScale from '@/src/components/ui/PressableScale';
import { theme } from '@/src/theme';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/** Pastille sélectionnable (catégories, filtres) avec rebond à la sélection. */
export default function Chip({ label, selected = false, onPress }: Props) {
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!selected) return;
    pop.setValue(1.12);
    Animated.spring(pop, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 12,
    }).start();
  }, [selected, pop]);

  return (
    <PressableScale onPress={onPress} scaleTo={0.92} style={styles.shell}>
      <Animated.View
        style={[
          styles.chip,
          selected ? styles.chipSelected : styles.chipIdle,
          { transform: [{ scale: pop }] },
        ]}
      >
        <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>
          {label}
        </Text>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: theme.radius.pill,
  },
  chip: {
    paddingHorizontal: theme.spacing.lg,
    height: 38,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipIdle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.espresso,
    borderColor: theme.colors.espresso,
  },
  label: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 13,
  },
  labelIdle: {
    color: theme.colors.textMuted,
  },
  labelSelected: {
    color: theme.colors.cream,
  },
});

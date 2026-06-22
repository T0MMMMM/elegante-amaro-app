import PressableScale from '@/src/components/ui/PressableScale';
import { theme } from '@/src/theme';
import { SIZES, Size } from '@/src/types';
import { Coffee } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface Props {
  value: Size;
  onChange: (size: Size) => void;
}

/** Taille d'icône illustrant chaque format (petit → grand). */
const ICON_SIZE: Record<Size, number> = {
  petit: 20,
  moyen: 26,
  grand: 32,
};

/** Sélecteur de taille : icône + libellé. Seule la taille choisie a une carte. */
export default function SizeSelector({ value, onChange }: Props) {
  return (
    <Animated.View style={styles.row}>
      {SIZES.map((s) => (
        <SizeOption
          key={s.value}
          size={s.value}
          label={s.label}
          selected={s.value === value}
          onPress={() => onChange(s.value)}
        />
      ))}
    </Animated.View>
  );
}

function SizeOption({
  size,
  label,
  selected,
  onPress,
}: {
  size: Size;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const pop = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(pop, {
      toValue: selected ? 1 : 0,
      useNativeDriver: true,
      speed: 30,
      bounciness: 12,
    }).start();
  }, [selected, pop]);

  const iconScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  return (
    <PressableScale
      onPress={onPress}
      containerStyle={styles.flex}
      style={[styles.segment, selected ? styles.selected : styles.idle]}
    >
      <Animated.View style={{ transform: [{ scale: iconScale }] }}>
        <Coffee
          size={ICON_SIZE[size]}
          color={selected ? theme.colors.goldDark : theme.colors.textMuted}
          strokeWidth={2}
        />
      </Animated.View>
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'stretch',
  },
  flex: {
    flex: 1,
  },
  segment: {
    height: 84,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    borderWidth: 1.5,
  },
  idle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.gold,
  },
  label: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 14,
  },
  labelIdle: {
    color: theme.colors.textMuted,
  },
  labelSelected: {
    color: theme.colors.espresso,
  },
});

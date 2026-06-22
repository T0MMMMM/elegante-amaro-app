import PressableScale from '@/src/components/ui/PressableScale';
import { formatPrice } from '@/src/constants/config';
import { haptics } from '@/src/lib/haptics';
import { theme } from '@/src/theme';
import { ItemOption } from '@/src/types';
import { Check } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface Props {
  option: ItemOption;
  selected: boolean;
  onToggle: () => void;
}

/** Ligne d'option (extra) sélectionnable avec son supplément de prix. */
export default function OptionToggle({ option, selected, onToggle }: Props) {
  const anim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: selected ? 1 : 0,
      useNativeDriver: true,
      speed: 30,
      bounciness: 14,
    }).start();
  }, [selected, anim]);

  const checkScale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  const handleToggle = () => {
    haptics.selection();
    onToggle();
  };

  return (
    <PressableScale onPress={handleToggle} scaleTo={0.97} style={styles.row}>
      <Animated.View style={[styles.box, selected ? styles.boxOn : styles.boxOff]}>
        <Animated.View style={{ opacity: anim, transform: [{ scale: checkScale }] }}>
          <Check size={14} color={theme.colors.espresso} strokeWidth={3} />
        </Animated.View>
      </Animated.View>
      <Text style={styles.name}>{option.name}</Text>
      <Text style={styles.extra}>+ {formatPrice(option.extraPrice)}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOff: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  boxOn: {
    borderColor: theme.colors.gold,
    backgroundColor: theme.colors.gold,
  },
  name: {
    flex: 1,
    fontFamily: theme.fontFamily.bodyMedium,
    fontSize: 15,
    color: theme.colors.espresso,
  },
  extra: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 14,
    color: theme.colors.goldDark,
  },
});

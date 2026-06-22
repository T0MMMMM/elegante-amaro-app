import { formatPrice } from '@/src/constants/config';
import { theme } from '@/src/theme';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TextStyle } from 'react-native';

interface Props {
  value: number;
  size?: number;
  color?: string;
  style?: TextStyle;
  /** Désactive le petit « pop » quand le prix change. */
  animate?: boolean;
}

/** Prix en police display (Bebas Neue). Petit rebond animé quand la valeur change. */
export default function Price({
  value,
  size = 22,
  color = theme.colors.goldDark,
  style,
  animate = true,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const mounted = useRef(false);

  useEffect(() => {
    if (!animate) return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    scale.setValue(1.18);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 10,
    }).start();
  }, [value, animate, scale]);

  return (
    <Animated.Text
      style={[styles.price, { fontSize: size, color }, style, { transform: [{ scale }] }]}
    >
      {formatPrice(value)}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  price: {
    fontFamily: theme.fontFamily.display,
    letterSpacing: 0.5,
  },
});

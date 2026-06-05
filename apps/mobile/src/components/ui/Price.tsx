import { formatPrice } from '@/src/constants/config';
import { theme } from '@/src/theme';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface Props {
  value: number;
  size?: number;
  color?: string;
  style?: TextStyle;
}

/** Affiche un prix en police display (Bebas Neue), accent doré par défaut. */
export default function Price({ value, size = 22, color = theme.colors.goldDark, style }: Props) {
  return <Text style={[styles.price, { fontSize: size, color }, style]}>{formatPrice(value)}</Text>;
}

const styles = StyleSheet.create({
  price: {
    fontFamily: theme.fontFamily.display,
    letterSpacing: 0.5,
  },
});

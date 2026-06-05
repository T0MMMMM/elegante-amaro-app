import { theme } from '@/src/theme';
import { StyleSheet, View, ViewStyle } from 'react-native';

/** Liseré fin. */
export default function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.line, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});

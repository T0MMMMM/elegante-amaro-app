import { theme } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  /** Petit sur-titre en capitales dorées. */
  overline?: string;
  title: string;
}

/** En-tête de section : sur-titre doré + titre display. */
export default function SectionHeader({ overline, title }: Props) {
  return (
    <View style={styles.wrap}>
      {overline ? <Text style={styles.overline}>{overline}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.xs,
  },
  overline: {
    ...theme.typography.label,
    color: theme.colors.goldDark,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.espresso,
  },
});

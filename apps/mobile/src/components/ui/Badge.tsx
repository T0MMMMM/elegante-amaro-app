import { theme } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';

/** Petite pastille de compteur (ex : nb d'articles dans le panier). */
export default function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.fontFamily.bodyBold,
    fontSize: 10,
    color: theme.colors.espresso,
  },
});

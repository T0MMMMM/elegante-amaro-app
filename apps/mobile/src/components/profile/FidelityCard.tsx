import { config } from '@/src/constants/config';
import { theme } from '@/src/theme';
import { Gift } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  points: number;
}

/** Carte fidélité (points + progression vers la prochaine récompense). */
export default function FidelityCard({ points }: Props) {
  const goal = config.fidelityGoal;
  const progress = Math.min(1, points / goal);
  const remaining = Math.max(0, goal - points);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.overline}>Programme fidélité</Text>
        <Gift size={20} color={theme.colors.gold} strokeWidth={2} />
      </View>

      <View style={styles.pointsRow}>
        <Text style={styles.points}>{points}</Text>
        <Text style={styles.pointsLabel}>points</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>

      <Text style={styles.hint}>
        {remaining > 0
          ? `Plus que ${remaining} points avant votre boisson offerte`
          : 'Une boisson offerte vous attend !'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.espresso,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    ...theme.shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overline: {
    ...theme.typography.label,
    color: theme.colors.gold,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.sm,
  },
  points: {
    fontFamily: theme.fontFamily.display,
    fontSize: 56,
    color: theme.colors.cream,
    letterSpacing: 1,
  },
  pointsLabel: {
    fontFamily: theme.fontFamily.body,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  track: {
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,250,237,0.15)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.gold,
  },
  hint: {
    fontFamily: theme.fontFamily.body,
    fontSize: 13,
    color: theme.colors.cream,
    opacity: 0.85,
  },
});

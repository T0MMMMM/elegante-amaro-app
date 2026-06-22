import { fidelityStatus } from '@/src/lib/fidelity';
import { theme } from '@/src/theme';
import { Crown } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  points: number;
}

/** Carte de membre : statut (palier) + privilège + progression vers le cercle suivant. */
export default function FidelityCard({ points }: Props) {
  const { tier, next, progress, toNext } = fidelityStatus(points);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.overline}>Cercle Elegante Amaro</Text>
        <Crown size={18} color={theme.colors.gold} strokeWidth={2} />
      </View>

      <Text style={styles.tier}>{tier.name}</Text>
      <Text style={styles.perk}>{tier.perk}</Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.points}>{points} points</Text>
        <Text style={styles.hint}>
          {next ? `Plus que ${toNext} avant ${next.name}` : 'Cercle au sommet atteint'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.espresso,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
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
  tier: {
    fontFamily: theme.fontFamily.display,
    fontSize: 40,
    letterSpacing: 1,
    color: theme.colors.cream,
    marginTop: theme.spacing.xs,
  },
  perk: {
    fontFamily: theme.fontFamily.body,
    fontSize: 13,
    color: theme.colors.cream,
    opacity: 0.85,
    marginBottom: theme.spacing.xs,
  },
  track: {
    height: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,250,237,0.15)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.gold,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  points: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 13,
    color: theme.colors.cream,
  },
  hint: {
    fontFamily: theme.fontFamily.body,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});

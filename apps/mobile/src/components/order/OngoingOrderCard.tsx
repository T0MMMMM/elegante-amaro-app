import { formatPrice } from '@/src/constants/config';
import { theme } from '@/src/theme';
import { OngoingOrder } from '@/src/types';
import { StyleSheet, Text, View } from 'react-native';

const STEPS = ['En attente', 'En préparation', 'Prête'];

/** Carte de commande en cours : n° de commande, suivi de statut, récap, total. */
export default function OngoingOrderCard({ order }: { order: OngoingOrder }) {
  const isReady = order.stateStep === 3;
  return (
    <View style={[styles.card, isReady && styles.cardReady]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.numberRow}>
            {isReady ? (
              <View style={styles.readyDot}>
                <View style={styles.readyDotInner} />
              </View>
            ) : null}
            <Text style={styles.number}>Commande {order.number}</Text>
          </View>
          <Text style={styles.placed}>{order.placedAtLabel}</Text>
        </View>
        <View style={[styles.statusChip, isReady && styles.statusChipReady]}>
          <Text style={[styles.statusText, isReady && styles.statusTextReady]}>
            {order.stateLabel}
          </Text>
        </View>
      </View>

      {/* Suivi de statut */}
      <View style={styles.dotsRow}>
        {STEPS.map((label, i) => {
          const done = i + 1 <= order.stateStep;
          const connectorDone = i + 1 < order.stateStep;
          return (
            <View key={label} style={styles.dotCell}>
              <View style={[styles.dot, done ? styles.dotDone : styles.dotIdle]} />
              {i < STEPS.length - 1 ? (
                <View style={[styles.connector, connectorDone ? styles.connectorDone : styles.connectorIdle]} />
              ) : null}
            </View>
          );
        })}
      </View>
      <View style={styles.labelsRow}>
        {STEPS.map((label, i) => (
          <Text
            key={label}
            style={[styles.stepLabel, i + 1 <= order.stateStep && styles.stepLabelActive]}
          >
            {label}
          </Text>
        ))}
      </View>

      {/* Récap */}
      <View style={styles.items}>
        {order.items.map((it, idx) => (
          <Text key={idx} style={styles.itemLine}>
            <Text style={styles.qty}>{it.quantity}× </Text>
            {it.name}
          </Text>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Text style={styles.type}>
          {order.typeLabel}
          {order.tableNumber ? ` · Table N°${order.tableNumber}` : ''}
        </Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.gold,
    ...theme.shadows.card,
  },
  cardReady: {
    borderColor: theme.colors.success,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    gap: 2,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  readyDot: {
    width: 16,
    height: 16,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(107,142,90,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyDotInner: {
    width: 9,
    height: 9,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.success,
  },
  number: {
    fontFamily: theme.fontFamily.display,
    fontSize: 22,
    letterSpacing: 0.5,
    color: theme.colors.espresso,
  },
  placed: {
    fontFamily: theme.fontFamily.body,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  statusChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.espresso,
  },
  statusChipReady: {
    backgroundColor: theme.colors.success,
  },
  statusText: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 12,
    color: theme.colors.gold,
  },
  statusTextReady: {
    color: theme.colors.cream,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotCell: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: theme.radius.pill,
  },
  dotDone: {
    backgroundColor: theme.colors.gold,
  },
  dotIdle: {
    backgroundColor: theme.colors.border,
  },
  connector: {
    flex: 1,
    height: 3,
    marginHorizontal: 4,
    borderRadius: theme.radius.pill,
  },
  connectorDone: {
    backgroundColor: theme.colors.gold,
  },
  connectorIdle: {
    backgroundColor: theme.colors.border,
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: -theme.spacing.sm,
  },
  stepLabel: {
    flex: 1,
    fontFamily: theme.fontFamily.body,
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  stepLabelActive: {
    fontFamily: theme.fontFamily.bodySemibold,
    color: theme.colors.espresso,
  },
  items: {
    gap: 4,
  },
  itemLine: {
    fontFamily: theme.fontFamily.body,
    fontSize: 14,
    color: theme.colors.espresso,
  },
  qty: {
    fontFamily: theme.fontFamily.bodySemibold,
    color: theme.colors.goldDark,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  type: {
    fontFamily: theme.fontFamily.bodyMedium,
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  total: {
    fontFamily: theme.fontFamily.display,
    fontSize: 22,
    color: theme.colors.goldDark,
  },
});

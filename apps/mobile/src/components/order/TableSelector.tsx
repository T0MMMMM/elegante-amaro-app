import { CafeTable } from '@/src/types';
import { theme } from '@/src/theme';
import { Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  tables: CafeTable[];
  selectedId?: number;
  onSelect: (id?: number) => void;
}

/** Sélecteur de table en dropdown (modale). */
export default function TableSelector({ tables, selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const selected = tables.find((t) => t.id === selectedId);

  const choose = (id?: number) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected ? `Table N°${selected.numero}` : 'Choisir une table'}
        </Text>
        <ChevronDown size={20} color={theme.colors.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>Choisir une table</Text>
            <FlatList
              data={tables}
              keyExtractor={(t) => String(t.id)}
              style={styles.list}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListHeaderComponent={
                <Row label="Aucune table" selected={!selected} onPress={() => choose(undefined)} />
              }
              renderItem={({ item }) => (
                <Row
                  label={`Table N°${item.numero}`}
                  selected={item.id === selectedId}
                  onPress={() => choose(item.id)}
                />
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function Row({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]}>{label}</Text>
      {selected ? <Check size={18} color={theme.colors.goldDark} strokeWidth={2.5} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  triggerText: {
    fontFamily: theme.fontFamily.bodySemibold,
    fontSize: 15,
    color: theme.colors.espresso,
  },
  placeholder: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.bodyMedium,
  },
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.cream,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    maxHeight: '60%',
  },
  sheetTitle: {
    fontFamily: theme.fontFamily.display,
    fontSize: 22,
    letterSpacing: 0.5,
    color: theme.colors.espresso,
    marginBottom: theme.spacing.md,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowLabel: {
    fontFamily: theme.fontFamily.bodyMedium,
    fontSize: 16,
    color: theme.colors.espresso,
  },
  rowLabelSelected: {
    fontFamily: theme.fontFamily.bodySemibold,
    color: theme.colors.goldDark,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});

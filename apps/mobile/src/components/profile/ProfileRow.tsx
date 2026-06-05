import { theme } from '@/src/theme';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

/** Ligne d'option du profil (icône + libellé + chevron). */
export default function ProfileRow({ icon: Icon, label, onPress, danger }: Props) {
  const color = danger ? theme.colors.danger : theme.colors.espresso;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, danger && styles.iconWrapDanger]}>
        <Icon size={20} color={color} strokeWidth={2} />
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <ChevronRight size={20} color={theme.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  pressed: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDanger: {
    backgroundColor: 'rgba(180,83,63,0.1)',
  },
  label: {
    flex: 1,
    fontFamily: theme.fontFamily.bodyMedium,
    fontSize: 15,
  },
});

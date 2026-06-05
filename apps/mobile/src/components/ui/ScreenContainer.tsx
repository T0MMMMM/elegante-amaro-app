import { theme } from '@/src/theme';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children?: React.ReactNode;
  /** Bords où appliquer la safe-area. Par défaut top. */
  edges?: Edge[];
  style?: ViewStyle;
  padded?: boolean;
}

/** Conteneur d'écran : fond crème + safe-area. */
export default function ScreenContainer({
  children,
  edges = ['top'],
  style,
  padded = false,
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={[styles.content, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: theme.spacing.xl,
  },
});

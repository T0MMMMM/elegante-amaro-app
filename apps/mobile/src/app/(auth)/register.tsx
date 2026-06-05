import { theme } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';

// Stub hors périmètre — à brancher avec l'authentification plus tard.
export default function RegisterScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>Inscription (à venir)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    fontFamily: theme.fontFamily.display,
    fontSize: 22,
    color: theme.colors.espresso,
  },
});

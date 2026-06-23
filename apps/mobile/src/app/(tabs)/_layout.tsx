import TabBar from '@/src/components/navigation/TabBar';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="accueil" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="carte" options={{ title: 'Carte' }} />
      <Tabs.Screen name="commande" options={{ title: 'Commande' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}

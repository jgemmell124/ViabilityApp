import { StyleSheet, Pressable } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from '@/components/Themed';
import { Link, Stack } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeScreen() {

  const colorScheme = useColorScheme();


  const devices = [
    { id: 1, name: 'Device 1', status: 'Active', temp: '54' },
  ]

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Viability',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="gear"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginLeft: 10, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerRight: () => (
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="plus"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 10, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <Text style={styles.title}>Devices ({devices.length})</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/home.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    /* justifyContent: 'center', */
  },
  title: {
    paddingTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

import { StyleSheet, Pressable } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, View } from '@/components/Themed';
import { Link, Stack } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import DeviceInfoCard from '../components/DeviceInfo';
import { ScrollView } from 'react-native';

export default function HomeScreen() {

  const colorScheme = useColorScheme();


  const devices = [
    { id: 1, name: 'Device 1', status: 'Active', temp: '54', battery: 20 },
    { id: 2, name: 'Device 2', status: 'Inactive', temp: '54', battery: 55 },
    { id: 3, name: 'Device 3', status: 'Active', temp: '30', battery: 100 },
    { id: 4, name: 'Device 4', status: 'Inactive', temp: '54', battery: 89 },
    { id: 5, name: 'Device 5', status: 'Active', temp: '54', battery: 10 },
    { id: 6, name: 'Device 6', status: 'Inactive', temp: '54', battery: 1 },
    { id: 7, name: 'Device 7', status: 'Inactive', temp: '54', battery: 0 },
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          width: '100%',
          paddingBottom: 10,
        }}
      >
        <Text style={styles.title}>My Devices ({devices.length})</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {devices.map((device) => (
          <DeviceInfoCard key={device.id} device={device} />
        ))}
        {/* <EditScreenInfo path="app/home.tsx" /> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /* alignItems: 'center', */
  },
  title: {
    paddingTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 4,
    height: 1,
    width: '80%',
  },
});

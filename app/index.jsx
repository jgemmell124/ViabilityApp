import { StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack, useNavigation } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import DeviceInfoCard from '../components/DeviceInfo';
import { ScrollView, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import log from '@/assets/images/VIAbility_logo.png';
import Separator from '../components/Seperator';
const logoUri = Image.resolveAssetSource(log).uri;

export default function HomeScreen() {

  const colorScheme = useColorScheme();
  const theme = useTheme();
  const navigation = useNavigation();

  const devices = [
    { id: 1, name: 'Device 1', status: 'Active', temp: '54', battery: 20 },
    { id: 2, name: 'Device 2', status: 'Inactive', temp: '54', battery: 55 },
    { id: 3, name: 'Device 3', status: 'Active', temp: '30', battery: 100 },
    { id: 4, name: 'Device 4', status: 'Inactive', temp: '54', battery: 89 },
    { id: 5, name: 'Device 5', status: 'Active', temp: '54', battery: 10 },
    { id: 6, name: 'Device 6', status: 'Inactive', temp: '54', battery: 1 },
    { id: 7, name: 'Device 7', status: 'Inactive', temp: '54', battery: 0 },
  ]

  const LogoTitle = () => {
    return (
      <Image source={{ uri: logoUri }} style={styles.imageTitle} />
    );
  }

  const HeaderLeftIcon = () => {
    return (
      <IconButton
        icon="cog"
        size={25}
        animated
        onPressOut={() => navigation.navigate('settings')}
        style={{
          marginLeft: 0,
          paddingLeft: 0,
        }}
      />
    )
  }

  const HeaderRightIcon = () => {
    return (
      <Pressable>
        <IconButton
          icon={'plus'}
          size={25}
          animated
          onPress={() => console.log('Add Device')}
          style={{
            marginRight: 0,
            paddingRight: 0,
          }}
        />
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: props => <LogoTitle {...props} />,
          headerTitleAlign: 'center',
          headerRight: () => <HeaderRightIcon />,
          headerLeft: () => <HeaderLeftIcon />,
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
        <Separator style={styles.separator} />
        {devices.map((device) => (
          <DeviceInfoCard key={device.id} device={device} />
        ))}
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
    width: '90%',
  },
  imageTitle: {
    height: 50,
    width: 180,
  }
});

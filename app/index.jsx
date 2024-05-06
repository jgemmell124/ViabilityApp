import { StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack, useNavigation } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';
import DeviceInfoCard from '../components/DeviceInfoCard';
import { ScrollView, View, Animated } from 'react-native';
import { Icon, IconButton, Text, useTheme } from 'react-native-paper';
import Separator from '../components/Seperator';
import { useDispatch, useSelector } from 'react-redux';
import { selectConnectedDevices, selectDevices } from '../state/store';
import { startListening, startScanning, stopScanning } from '@/state/BluetoothLowEnergy/slice';
import { useEffect, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import log from '@/assets/images/VIAbility_logo.png';
import { isLoading } from 'expo-font';
import { connectToDevice } from '@/state/BluetoothLowEnergy/listener';
const logoUri = Image.resolveAssetSource(log).uri;

export default function HomeScreen() {
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const devices =  useSelector(selectDevices);
  const connectedDevices = useSelector(selectConnectedDevices);

  const spinValue = new Animated.Value(0);
  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']

  })

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    // autoconnect to the devices recognized (if not connected);
    console.log('connected to devices');
    const unconnectedDevices = devices.filter(device => !connectedDevices.includes(device.id));
    for (const device of unconnectedDevices) {
      console.log('attempting to connect', device.id);
      dispatch(connectToDevice(device));
    }

  }, [devices]);


  useEffect(() => {
      for (const device of connectedDevices) {
        dispatch(startListening());
        console.log('listening');
      }
  }, [connectedDevices]);

  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }
    ).start(() => spin());
  }

  if (isSearching) {
    spin();
  }


  const LogoTitle = () => {
    return (
      <Image source={{ uri: logoUri }} style={styles.imageTitle} />
    );
  }

  const stopDeviceScanTimeout = () => {
    return setTimeout(() => {
      setIsSearching(false);
      dispatch(stopScanning());
    }, 8000);
  }


  const onAddDevice = () => {
    if (!isSearching) {
      dispatch(startScanning());
      timeoutRef.current = stopDeviceScanTimeout();
    }
    setIsSearching(!isSearching);
  };

  const onStopScanning = () => {
    clearTimeout(timeoutRef.current);
    setIsSearching(false);
    dispatch(stopScanning());
  }

  /**/
  /* if (devices?.length > 0) { */
  /*   // connect to the first device */
  /*   const firstDevice = devices[0]; */
  /*   dispatch(connectToDevice(firstDevice.id)); */
  /* } */


  const HeaderLeftIcon = () => {
    return (
      <IconButton
        icon="cog"
        size={25}
        animated
        onPress={() => navigation.navigate('settings')}
        style={{
          marginLeft: 0,
          paddingLeft: 0,
        }}
      />
    )
  }

  const HeaderRightIcon = () => {
    return (
      <>
        <Animated.View style={{ transform: [{ rotate }]}}>
          <MaterialCommunityIcons
            name='sync'
            size={24}
            style={{
              color: isSearching ? theme.colors.primary : 'transparent'
            }}
          />
        </Animated.View>
        <IconButton
          icon={'plus'}
          size={25}
          animated
          onPress={() => {
            if (isSearching) {
              onStopScanning();
            } else {
              onAddDevice();
            }
          }}
          iconColor={isSearching ? theme.colors.error : 'black' }
          style={{
            transform: [{ rotate: isSearching ? '45deg' : '0deg' }],
            marginRight: 0,
            paddingRight: 0,
          }}
        />
      </>
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
        {
          devices.map((device) => (
            <DeviceInfoCard
              navigation={navigation}
              key={device.id}
              device={device}
            />
          ))
        }
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

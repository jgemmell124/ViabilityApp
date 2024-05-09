import React, {
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import {
  IconButton, Text
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import DeviceInfoCard from '../components/DeviceInfoCard';
import Separator from '../components/Seperator';
import { selectConnectedDevices, selectDevices } from '../state/store';
import { startListening } from '../state/BluetoothLowEnergy/slice';
import LogoTitle from '../components/LogoTitle';

import { connectToDevice } from '../state/BluetoothLowEnergy/listener';
import ConnectDeviceButton from '@/components/ConnectDevices';

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
});

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const devices = useSelector(selectDevices);
  const connectedDevices = useSelector(selectConnectedDevices);


  useEffect(() => {
    // autoconnect to the devices recognized (if not connected);
    const unconnectedDevices = devices.filter((device) => !connectedDevices.includes(device.id));
    unconnectedDevices.forEach((device) => dispatch(connectToDevice(device)));
  }, [devices]);

  useEffect(() => {
    if (connectedDevices.length !== 0) {
      dispatch(startListening());
    }
  }, [connectedDevices]);

  const HeaderLeftIcon = () => (
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
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerTitleAlign: 'center',
          headerRight: () => <ConnectDeviceButton />,
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
        <Text style={styles.title}>
          My Devices (
          {devices.length}
          )
        </Text>
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

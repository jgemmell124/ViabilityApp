import PropTypes from 'prop-types';
import React, {
  StyleSheet,
  ScrollView,
  View,
  Animated,
  FlatList,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import {
  Button,
  IconButton, Portal, ProgressBar, Text, useTheme
} from 'react-native-paper';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import DeviceInfoCard from '../components/DeviceInfoCard';
import Separator from '../components/Seperator';
import { selectConnectedDevice, selectDevices } from '../state/store';
import { startListening } from '../state/BluetoothLowEnergy/slice';
import LogoTitle from '../components/LogoTitle';

import ConnectDeviceButton from '@/components/ConnectDevices';
import useBLE from '@/state/BluetoothLowEnergy/useBLE';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConnectDeviceModal from '@/components/ConnectDeviceModal';


const ConnectNewDeviceButton = ({ onPress }) => {
  const theme = useTheme();

  return (
    <Button
      mode='elevated'
      rippleColor={theme.colors.onPrimary}
      onPress={onPress}
      labelStyle={{
        padding: 5,
        fontSize: 20,
      }}
      textColor={theme.colors.onPrimary}
      style={{
        backgroundColor: theme.colors.primary,
        /* padding: 5, */
      }}
    >
      Connect New Device
    </Button>
  );
};

ConnectNewDeviceButton.propTypes = {
  onPress: PropTypes.func,
};

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const devices = useSelector(selectDevices);
  const connectedDevice = useSelector(selectConnectedDevice);
  const theme = useTheme();

  const { connectToDevice } = useBLE();

  console.log('devices', devices);
  console.log('connectedDevice', connectedDevice);
  
  if (devices.length > 0 && !connectedDevice) {
    console.log('connecting to device...');
    connectToDevice(devices[0]);
  }

  const HeaderLeftIcon = () => (
    <IconButton
      icon="cog"
      size={25}
      animated
      // TODO: device settings now?
      onPress={() => navigation.navigate('settings')}
      style={{
        marginLeft: 0,
        paddingLeft: 0,
      }}
    />
  );

  const spinValue = new Animated.Value(0);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],

  });

  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      },
    ).start(() => spin());
  };

  if (visible) {
    spin();
  }

  if (_.isEmpty(connectedDevice)) {
    return (
      <View style={{
        ...(styles.noDeviceContainer),
        backgroundColor: theme.colors.primaryContainer,
      }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Text>No device</Text>
        </View>
        <ConnectNewDeviceButton
          onPress={showDialog}
        />
        <ConnectDeviceModal
          setVisible={setVisible}
          visible={visible}
          onDismiss={hideDialog}
        />
      </View>
    );
  }

  return (
    <View 
      style={{
        backgroundColor: 'black'
      }}
    >
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
          {/* {devices.length} */}
          {connectedDevice ? 1 : 0}
          )
        </Text>
        <Separator style={styles.separator} />
        {
          [connectedDevice].map((device, index) => (
            <DeviceInfoCard
              navigation={navigation}
              key={device?.id ?? index}
              deviceName={device?.name}
              deviceId={device?.id}
            />
          ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    /* flex: 1, */
    /* alignItems: 'center', */
  },
  noDeviceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '50%'
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

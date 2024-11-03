import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  IconButton, useTheme,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
/* import { startScanning, stopScanning } from '../state/BluetoothLowEnergy/slice'; */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import useBLE from '@/state/BluetoothLowEnergy/useBLE';

const ConnectDeviceButton = () => {
  const [isSearching, setIsSearching] = useState(false);
  const theme = useTheme();
  const timeoutRef = useRef(null);
  /* const dispatch = useDispatch(); */
  const { scanForPeripherals, stopScanningForPeripherals } = useBLE();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

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

  if (isSearching) {
    spin();
  }

  const stopDeviceScanTimeout = () => setTimeout(() => {
    setIsSearching(false);
    /* dispatch(stopScanning()); */
    stopScanningForPeripherals();
  }, 8000);

  const onAddDevice = () => {
    if (!isSearching) {
      /* dispatch(startScanning()); */
      scanForPeripherals();
      timeoutRef.current = stopDeviceScanTimeout();
    }
    setIsSearching(!isSearching);
  };

  const onStopScanning = () => {
    clearTimeout(timeoutRef.current);
    setIsSearching(false);
    /* dispatch(stopScanning()); */
    stopScanningForPeripherals();
  };

  return (
    <>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <MaterialCommunityIcons
          name="sync"
          size={24}
          style={{
            color: isSearching ? theme.colors.primary : 'transparent',
          }}
        />
      </Animated.View>
      <IconButton
        icon="plus"
        size={25}
        animated
        onPress={() => {
          if (isSearching) {
            onStopScanning();
          } else {
            onAddDevice();
          }
        }}
        iconColor={isSearching ? theme.colors.error : 'black'}
        style={{
          transform: [{ rotate: isSearching ? '45deg' : '0deg' }],
          marginRight: 0,
          paddingRight: 0,
        }}
      />
    </>
  );
};

export default ConnectDeviceButton;

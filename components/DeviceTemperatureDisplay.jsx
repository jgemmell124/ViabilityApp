import React from 'react';
import { View } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectConnectedDevice, selectDevices, selectUnit } from '../state/store';

const DeviceTemperatureDisplay = () => {
  const tempUnit = useSelector(selectUnit);
  const connectedDevice = useSelector(selectConnectedDevice);
  const theme = useTheme();

  const calculateTempColor = (temp) => {
    if (temp < 40) {
      return 'blue';
    } else if (temp < 50) {
      return 'green';
    } else if (temp < 60) {
      return 'yellow';
    } else if (temp < 70) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  return (
    <View
      style={{
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        high: 'auto',
      }}
    >
      <View
        style={{
          paddingTop: 10,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Text variant='titleMedium'>Current Insulin Temperature</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          /* backgroundColor: 'green', */
        }}
      >

        <Text
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            color: calculateTempColor(connectedDevice?.temp ?? 43),
            fontSize: 100,
          }}
        >
          {connectedDevice?.temp ?? 43}
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            marginLeft: 8,
          }}
          variant='headlineLarge'
        >°{tempUnit}</Text>
      </View>
    </View>
  );
};


export default DeviceTemperatureDisplay;

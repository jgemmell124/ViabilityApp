import React from 'react';
import { View } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectConnectedDevice, selectDevices, selectUnit } from '../state/store';

const DeviceTemperatureDisplay = () => {
  const tempUnit = useSelector(selectUnit);
  const connectedDevice = useSelector(selectConnectedDevice);

  const currentTemp = useSelector(state => state.ble.retrievedTemp);

  const calculateTempColor = () => {
    // calculintg this in C
    const temp = currentTemp;
    if (temp < 0) {
      return 'blue';
    } else if (temp < 15) {
      return 'green';
    } else if (temp < 25) {
      return 'yellow';
    } else if (temp < 35) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  const renderTemp = () => {
    const decimals = 0;
    const temp = currentTemp;
    if (tempUnit === 'F') {
      const tempF = (temp * 9/5) + 32;
      return tempF.toFixed(decimals);
    } else {
      const tempC = temp.toFixed(decimals);
      return tempC;
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
            color: calculateTempColor(currentTemp),
            fontSize: 100,
          }}
        >
          {renderTemp()}
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

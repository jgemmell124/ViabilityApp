import React from 'react';
import { View } from 'react-native';
import {
  Text,
  Tooltip,
  Card,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectConnectedDevice, selectDevices, selectUnit } from '../state/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ss from 'simple-statistics';


// Convert data into points for regression
const calculateTrend = (data) => {
  const points = data.map((value, index) => [index, value]);

  // Calculate linear regression
  const regression = ss.linearRegression(points);

  slope = regression.m;
  const threshold = 0.08;

  if (slope > threshold) {
    // since we prepend temps, we need to flip it based on slope
    return 'down';
  } else if (slope < -threshold) {
    return 'up';
  } else  {
    return 'neutral';
  }
}


const TrendIcon = () => {
  const lastTemps = useSelector(state => state.ble.lastTemps);
  const trend = calculateTrend(lastTemps);

  let trendToolTipTitle;
  let color;
  if (trend === 'up') {
    trendToolTipTitle = 'Temperature is trending up';
    color = '#a83232';
  } else if (trend === 'down') {
    trendToolTipTitle = 'Temperature is trending down';
    color = '#327ba8';
  } else {
    trendToolTipTitle = 'Temperature is stable';
    color = '#32a850';
  }

  return (
    <Tooltip
      title={trendToolTipTitle}
      enterTouchDelay={50}
    >
      <IconButton
        icon={`trending-${trend}`}
        selected 
        size={42}
        iconColor={color}
        onPress={() => {}}
      />
    </Tooltip>
  );
};


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
        <Text variant='titleMedium'>Current Temperature</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            alignSelf: 'center',
            marginRight: 2,
            padding: 0,
          }}
        >
          <TrendIcon />
        </Text>

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

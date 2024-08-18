import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
  Text,
  Tooltip,
  IconButton,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectLastContact, selectUnit } from '../state/store';
import * as ss from 'simple-statistics';
import { timeAgoString } from '@/utils/utils';

// Convert data into points for regression
const calculateTrend = (data) => {
  const points = data.map((value, index) => [index, value]);

  // Calculate linear regression
  const regression = ss.linearRegression(points);

  const slope = regression.m;
  const threshold = 0.08;

  if (slope > threshold) {
    // since we prepend temps, we need to flip it based on slope
    return 'down';
  } else if (slope < -threshold) {
    return 'up';
  } else  {
    return 'neutral';
  }
};

const getTempColor = (trend) => {
  if (trend === 'up') {
    return 'red';
  } else if (trend === 'down') {
    return 'blue';
  } else {
    // stable
    return 'green';
  }
};

const TrendIcon = ({ trend }) => {

  let trendToolTipTitle;
  if (trend === 'up') {
    trendToolTipTitle = 'Temperature is trending up';
  } else if (trend === 'down') {
    trendToolTipTitle = 'Temperature is trending down';
  } else {
    trendToolTipTitle = 'Temperature is stable';
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
        iconColor={getTempColor(trend)}
        onPress={() => {}}
      />
    </Tooltip>
  );
};

TrendIcon.propTypes = {
  trend: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
};


const DeviceTemperatureDisplay = () => {
  const tempUnit = useSelector(selectUnit);
  const lastTemps = useSelector(state => state.ble.lastTemps);
  const lastContact = useSelector(selectLastContact);

  const trend = calculateTrend(lastTemps);

  const currentTemp = useSelector(state => state.ble.retrievedTemp);


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
            marginRight: 0,
            padding: 0,
          }}
        >
          <TrendIcon trend={trend} />
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            color: getTempColor(trend),
            fontSize: 100,
          }}
        >
          {renderTemp()}
        </Text>
        <Text
          style={{
            alignSelf: 'center',
            marginLeft: 8,
            marginRight: 8,
          }}
          variant='headlineLarge'
        >°{tempUnit}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingBottom: 10
        }}
      >
        <Text variant='labelSmall'>
          Updated {timeAgoString(lastContact)}
        </Text>
      </View>
    </View>
  );
};


export default DeviceTemperatureDisplay;

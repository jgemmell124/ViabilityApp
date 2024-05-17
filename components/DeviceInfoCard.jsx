/* import { View } from '@/components/Themed'; */
import PropTypes from 'prop-types';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Text, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import React from 'react';
import { selectConnectedDevice, selectUnit } from '@/state/store';

export default function DeviceInfoCard({ deviceId, deviceName, navigation }) {

  const device = useSelector(selectConnectedDevice);
  const temperature = useSelector(state => state.ble.retrievedTemp);
  const batteryLevel = useSelector(state => state.ble.batteryLevel);
  const tempUnit = useSelector(selectUnit);
  const lastContact = useSelector(state => state.ble.lastContact);
  const rssi = useSelector(state => state.ble.rssi);
  const theme = useTheme();


  if (device === null) {
    return <Text>No device</Text>;
  }

  const renderTemp = (temp, unit) => {
    const decimals = 1;
    if (unit === 'F') {
      const tempF = (temp * 9/5) + 32;
      return `${tempF.toFixed(decimals)} °F`;
    } else {
      const tempC = temp.toFixed(decimals);
      return `${tempC} °C`;
    }
  };


  const renderLastContact = () => {
    const now = new Date();
    const lastContactDate = new Date(lastContact);
    const timeDiff = now - lastContact;
    const isWithin15Minutes = timeDiff < 1000 * 60 * 10;
    return (
      <>
        <Text
          variant='titleSmall'
        >
          Last Contact:
        </Text>
        <Text
          variant='titleSmall'
          style={{ 
            justifyContent: 'flex-start',
            color: `${isWithin15Minutes ? 'green' : 'red'}`
          }}
        >
          {lastContactDate.toString().split(' ').slice(0, 5).join(' ')}
        </Text>
      </>
    );
  };


  /* useEffect(() => { */
  /*   console.log('connecting........ use effect'); */
  /*   dispatch(connectToDevice(device.id)); */
  /* }, []); */


  const getBatteryIconAndColor = (battery) => {
    let batteryIcon = 'battery-empty';
    let batteryColor = 'green';
    if (battery > 75) {
      batteryColor = 'green';
      batteryIcon = 'battery-full';
    } else if (battery > 50) {
      batteryColor = 'green';
      batteryIcon = 'battery-three-quarters';
    } else if (battery > 25) {
      batteryColor = 'blue';
      batteryIcon = 'battery-half';
    } else if (battery >= 10) {
      batteryColor = 'orange';
      batteryIcon = 'battery-quarter';
    } else {
      batteryIcon = 'battery-empty';
      batteryColor = 'red';
    }
    return { batteryIcon, batteryColor };
  };

  const getConnectionIconAndColor = (rssi) => {
    let connectionIcon = 'signal-cellular-3';
    let connectionColor = 'green';
    if (rssi > -40) {
      connectionColor = 'green';
      connectionIcon = 'signal-cellular-3';
    } else if (rssi > -70) {
      connectionColor = 'blue';
      connectionIcon = 'signal-cellular-2';
    } else if (rssi > -100) {
      connectionColor = 'orange';
      connectionIcon = 'signal-cellular-1';
    } else {
      connectionIcon = 'signal-cellular-outline';
      connectionColor = 'red';
    }
    return { connectionIcon, connectionColor };
  };

  const { batteryIcon, batteryColor } = getBatteryIconAndColor(batteryLevel);
  const { connectionIcon, connectionColor } = getConnectionIconAndColor(rssi);

  return (
    <Card
      style={{
        width: '90%',
        margin: 5,
        backgroundColor: 'white',
        /* borderRadius: 10, */
        /* shadowColor: '#000', */
        /* shadowOffset: { */
        /*   width: 0, */
        /*   height: 1, */
        /* }, */
        /* shadowOpacity: 0.25, */
        /* shadowRadius: 3.84, */
        /* elevation: 5, */
      }}
      theme={theme}
      mode='elevated'
      elevation={1}
      onPress={() => {
        navigation.navigate('(device)', { 
          screen: 'device',
          params: { name: device?.name, id: device?.id},
        });
      }}
    >
      <Card.Title
        title={device.name}
        titleStyle={{ fontSize: 20 }}
        subtitle={device.status}
        right={() => 
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: -30,
              paddingRight: 10,
            }}
          >
            <FontAwesome name={batteryIcon} color={batteryColor} /> {batteryLevel}%
            {' '}<MaterialCommunityIcons name={connectionIcon} color={connectionColor} />
          </Text>
        }
      />
      <Card.Content
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'space-evenly',
          padding: 4,
        }}
      >
        {/* Display the temp */}
        <Text
          variant='headlineLarge'
          style={{
            color: 'green',
          }}
        >
          {/* {`${device.temp} °F`} */}
          {renderTemp(temperature, tempUnit)}
        </Text>
        {/* display the threshold */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              marginRight: 10,
            }}
            variant='labelLarge'
          >
            Threshold:
          </Text>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Text variant='labelMedium'>
              Min: 32°{tempUnit}
            </Text>
            <Text variant='labelMedium'>
              Max: 100°{tempUnit}
            </Text>
          </View>
        </View>
      </Card.Content>
      {/* Estimated time */}
      {/* TODO: Add the estimated time of safe temperature instead of hardcode */}
      <Card.Content
        style={{
          paddingTop: 10,
        }}
      >
        <View>
          <Text
            variant='titleSmall'
          >
            Estimated Time of safe temperature:
          </Text>
          <Text
            variant='titleSmall'
            style={{ 
              justifyContent: 'flex-start',
              color: 'red',
            }}
          >
            <FontAwesome name='warning' /> 3 hours 10 minutes
          </Text>
        </View>
      </Card.Content>
      {/* Last Contact */}
      <Card.Content 
        style={{ 
          padding: 10,
          margin: 0,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <View>
          {renderLastContact()}
        </View>
      </Card.Content>
    </Card>
  );
}

DeviceInfoCard.propTypes = {
  deviceId: PropTypes.string.isRequired,
  deviceName: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
};


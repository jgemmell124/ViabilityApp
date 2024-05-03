/* import { View } from '@/components/Themed'; */
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import { View } from 'react-native';

export default function DeviceInfoCard({ device }) {

  const router = useRouter();

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

  const getConnectionIconAndColor = (connection) => {
    let connectionIcon = 'battery-empty';
    let connectionColor = 'green';
    if (connection > 66) {
      connectionColor = 'green';
      connectionIcon = 'signal-cellular-3';
    } else if (connection > 33) {
      connectionColor = 'blue';
      connectionIcon = 'signal-cellular-2';
    } else if (connection > 0) {
      connectionColor = 'orange';
      connectionIcon = 'signal-cellular-1';
    } else {
      connectionIcon = 'signal-cellular-outline';
      connectionColor = 'red';
    }
    return { connectionIcon, connectionColor };
  }

  const { batteryIcon, batteryColor } = getBatteryIconAndColor(device.battery);
  const { connectionIcon, connectionColor } = getConnectionIconAndColor(device.battery);

  const cardHeader = (
    <View 
      style={{
        backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Text 
        style={{
          color: 'white',
        }}
      >
        {device.name}
      </Text>
      <View style={{ flexGrow: 1 }} />
      <Text 
        style={{
          color: 'red',
        }}
        variant='titleSmall'>
        {device.temp}
      </Text>
    </View>
  );


  return (
    <Card
      style={{
        width: '90%',
        margin: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={() => {
        router.push({
          pathname: '/device',
          params: { name: device.name ?? 'foo' },
        });
      }}
    >
      <Card.Title
        title={device.name}
        titleStyle={{ fontSize: 20 }}
        subtitle={device.status}
        right={(props) => 
          <Text
            style={{
              alignSelf: 'flex-end',
              marginTop: -30,
              paddingRight: 10,
            }}
          >
            <FontAwesome name={batteryIcon} color={batteryColor} /> {device.battery}%
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
          {`${device.temp} °F`}
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
              Min: 32°F
            </Text>
            <Text variant='labelMedium'>
              Max: 100°F
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
          <Text
            variant='titleSmall'
          >
            Last Contact:
          </Text>
          <Text
            variant='titleSmall'
            style={{ 
              justifyContent: 'flex-start',
              color: `${device.status === 'Active' ? 'green' : 'red'}`
            }}
          >
            {(new Date()).toString().split(' ').slice(0, 5).join(' ')} (2 hours ago)
          </Text>
        </View>
      </Card.Content>
    </Card>
  )
};

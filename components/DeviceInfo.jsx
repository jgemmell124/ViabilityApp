import { Text, View } from '@/components/Themed';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Card, Button } from 'react-native-paper';

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
      batteryColor = 'yellow';
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
      connectionColor = 'yellow';
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

  return (
    <Card
      style={{
        width: '90%',
        margin: 5,
        padding: 5,
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
    >
      <Card.Title title={device.name} subtitle={device.status} />
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text>
            <FontAwesome name={batteryIcon} color={batteryColor} /> {device.battery}%
          </Text>
          <View style={{ width: 10 }} />
          <Text>
            {' '}<MaterialCommunityIcons adjustsFontSizeToFit  name={connectionIcon} color={connectionColor} />
          </Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() => {
            router.push(`/device/${device.name}`, { params: device });
          }}
        >
          Details
        </Button>
        <Link
          href={{
            pathname: '/device',
            params: { name: device.name ?? 'foo' },
          }} 
          asChild
        >
          <Pressable>
            {({ pressed }) => (
              <Text style={{ color: pressed ? 'grey' : 'blue' }}>View Details</Text>
            )}
          </Pressable>
        </Link>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  )
};

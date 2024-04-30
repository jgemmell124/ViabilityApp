import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { Card, Button } from 'react-native-paper';

export default function DeviceInfo({ device }) {

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
        <Text>Temperature: {device.temp}°C</Text>
      </Card.Content>
      <Card.Actions>
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

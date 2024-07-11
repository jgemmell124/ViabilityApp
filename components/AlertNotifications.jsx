import React from 'react';
import { FlatList, View } from 'react-native';
import { Text, Card, Button, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Separator from './Seperator';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAlert } from '@/state/Alerts/slice';

// TODO: could also implement a way to view the first one,
// then have a button that opens a modal to view the rest
// swipe to dismiss, or press x to dismiss

const AlertNotifications = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const alertsState = useSelector(state => state.alerts.alerts);


  const alerts = [
    {
      id: 1,
      message: 'Device 1 has disconnected',
    },
    {
      id: 2,
      message: 'Device 2 has disconnected',
    },
    {
      id: 3,
      message: 'Device 3 has disconnected',
    },
    {
      id: 4,
      message: 'Device 4 has disconnected',
    },
    {
      id: 5,
      message: 'Device 5 has disconnected',
    },
    {
      id: 6,
      message: 'Device 6 has disconnected',
    },
    {
      id: 7,
      message: 'Device 7 has disconnected',
    },
  ];

  /* const alerts = []; */

  return (
    <View
      style={{
        flex: 1,
        margin: 10,
        padding: 10,
        paddingTop: 15,
        paddingBottom: 15,
      }}
    >
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          /* alignItems: 'flex-start', */
          /* backgroundColor: '#f0f0f0', */
        }}
      >
        <Text style={{ fontSize: 24 }}>Alerts</Text>
        {
          alerts.length > 0 &&
            <Button
              onPress={() => dispatch(clearAlerts())}
              mode='contained'
              buttonColor={theme.colors.error}
              rippleColor={theme.colors.error}
            >
              Clear All
            </Button>
        }
      </View>
      <Separator
        style={{
          width: '100%',
          marginBottom: 5
        }}
      />

      {alerts?.length > 0 ?
        (

          <FlatList
            fadingEdgeLength={10}
            data={alerts}
            renderItem={({ item }) => <NotificationCard message={item.message} />}
            keyExtractor={(item) => item.id.toString()}
          />
        )
        :
        (
          <View
            style={{
              margin: 10,
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Text>No Alerts</Text>
          </View>
        )

      }
      <Separator
        style={{
          width: '100%',
          marginTop: 5
        }}
      />
    </View>
  );
}

export default AlertNotifications;


// TODO add in more props
const NotificationCard = ({ message }) => {
  const dispatch = useDispatch();

  const closeButton = () => {
    return (
      <IconButton
        icon='close'
        size={24}
        iconColor='red'
        onPress={() => dispatch(deleteAlert('TODO'))}
      />
    )
  }

  const notificationIcon = () => {
    return (
      <MaterialCommunityIcons
        name='alert-circle'
        size={24}
        color='black'
      />
    );
  }


  return (
    <View
      style={{
        margin: 2,
        padding: 5,
      }}
    >
      <Card
        mode='elevated'
      >
        <Card.Title 
          title={message} 
          subtitle={'10 minutes ago'}
          left={notificationIcon}
          right={closeButton}
        />
      </Card>
    </View>
  );
};

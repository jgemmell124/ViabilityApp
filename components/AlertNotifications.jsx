import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import { Text, Card, Button, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Separator from './Seperator';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert, deleteAlert, clearAlerts } from '@/state/Alerts/slice';
import { selectMaxTemp, selectMinTemp, selectUnit } from '@/state/store';

// TODO: could also implement a way to view the first one,
// then have a button that opens a modal to view the rest
// swipe to dismiss, or press x to dismiss

const AlertNotifications = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const alerts = useSelector(state => state.alerts.alerts);
  const unit = useSelector(selectUnit);

  const minTemp = useSelector(selectMinTemp);
  const maxTemp = useSelector(selectMaxTemp);

  const temperature = useSelector(state => state.ble.retrievedTemp);
  // TODO predict of insulin is bad based on levels

  if (temperature < minTemp || temperature > maxTemp) {
    const temp = unit === 'F' ? (temperature * 9/5) + 32 : temperature;
    dispatch(addAlert({
      id: alerts[0]?.id + 1 || 1,
      message: `Temperature is out of range: ${temp}°{unit}`,
      time: Date.now()
    }));
  }


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
            renderItem={({ item }) => <NotificationCard 
              message={item.message}
              id={item.id}
              time={item.time ?? '10 minutes ago'}
            />
            }
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
};

export default AlertNotifications;


// TODO add in more props
const NotificationCard = ({ id, message, time }) => {
  const dispatch = useDispatch();

  const closeButton = () => {
    return (
      <IconButton
        icon='close'
        size={24}
        iconColor='red'
        onPress={() => dispatch(deleteAlert(id))}
      />
    );
  };

  const notificationIcon = () => {
    return (
      <MaterialCommunityIcons
        name='alert-circle'
        size={24}
        color='black'
      />
    );
  };


  // convert time to seconds ago, minutes ago, hours, ago,
  const timeString = (time) => {
    const now = Date.now();
    const diff = now - time;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
      return `${seconds} seconds`;
    } else if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      return `${hours} hours`;
    }
  };


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
          subtitle={`${timeString(time)} ago`}
          left={notificationIcon}
          right={closeButton}
        />
      </Card>
    </View>
  );
};

NotificationCard.propTypes = {
  id: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.Date.isRequired,
};

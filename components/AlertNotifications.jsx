import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import { Text, Card, Button, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Separator from './Seperator';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert, deleteAlert, clearAlerts } from '@/state/Alerts/slice';
import { selectMaxTemp, selectMinTemp, selectUnit } from '@/state/store';
import AlertEnum, { iconsMap } from '@/constants/AlertEnum';
import AlertDialog from './AlertDialog';

const AlertNotifications = () => {
  const [visible, setVisible] = useState(false);
  const [currentAlertId, setCurrentAlertId] = useState(0);
  const theme = useTheme();
  const dispatch = useDispatch();
  const alerts = useSelector(state => state.alerts.alerts);
  const unit = useSelector(selectUnit);
  const lastContact = useSelector(state => state.ble.lastContact);

  // temperatures in C
  const minTemp = useSelector(selectMinTemp);
  const maxTemp = useSelector(selectMaxTemp);

  const temperature = useSelector(state => state.ble.retrievedTemp);

  if (temperature < minTemp || temperature > maxTemp) {
    if (lastContact < 60 * 1000 && // only update on new contact
      (alerts.length === 0 ||
      alerts[0].type !== AlertEnum.SEVERE)) {
      // only add if not already added
      dispatch(addAlert({
        id: alerts[0]?.id + 1 || 1,
        message: 'Device reached critical temperature',
        temp: temperature.toFixed(0),
        time: Date.now(),
        type: AlertEnum.SEVERE,
      }));
    }
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
          alerts?.length > 0 &&
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
              temp={item.temp ?? null}
              unit={unit}
              type={item.type}
              onPress={() =>  {
                setVisible(true);
                setCurrentAlertId(item.id);
              }}
              time={item.time ?? new Date() - 60}
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
      <AlertDialog
        visible={visible} 
        setVisible={setVisible}
        id={currentAlertId}
      />
    </View>
  );
};

export default AlertNotifications;


// TODO add in more props
const NotificationCard = ({ id, message, time, temp, unit, type, onPress }) => {
  console.log('temp', temp);
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
    const iconType = iconsMap[type];

    return (
      <MaterialCommunityIcons
        name={iconType.icon}
        size={24}
        color={iconType.color}
      />
    );
  };

  // convert temperature to string with correct unit
  const tempString = (temp, unit) => {
    if (!temp || !unit) {
      return '';
    }
    if (unit === 'C') {
      return `: ${temp}°C`;
    } else {
      const tempF = (temp * 9/5) + 32;
      return `: ${tempF}°F`;
    }
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

  const displayMessage = `${message}${tempString(temp, unit)}`;


  return (
    <View
      style={{
        margin: 2,
        padding: 5,
      }}
    >
      <Card
        mode='elevated'
        onPress={onPress}
      >
        <Card.Title 
          title={displayMessage} 
          titleNumberOfLines={2}
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
  time: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  temp: PropTypes.number,
  unit: PropTypes.string,
};

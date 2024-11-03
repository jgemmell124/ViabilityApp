import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animated, FlatList } from 'react-native';
import {
  Button,
  Checkbox,
  Dialog,
  Portal,
  Text, useTheme
} from 'react-native-paper';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { selectDevices } from '@/state/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useBLE from '@/state/BluetoothLowEnergy/useBLE';


const states = {
  SEARCHING: 'searching',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
};

const ConnectDeviceModal = ({ visible, setVisible, onDismiss}) => {
  const [selectedDevice, setSelectedDevice] = useState();
  const [error, setError] = useState('');
  const [state, setState] = useState(states.SEARCHING);
  const timeoutRef = useRef(null);
  const theme = useTheme();

  const { scanForPeripherals, stopScanningForPeripherals, connectToDevice } = useBLE();

  const devices = useSelector(selectDevices);

  const spinValue = new Animated.Value(0);

  const hideDialog = () => setVisible(false);


  useEffect(() => {
    const stopDeviceScanTimeout = () => setTimeout(() => {
      stopScanningForPeripherals();
    }, 8000);

    if (visible) {
      setSelectedDevice();
      scanForPeripherals();
    }
    timeoutRef.current = stopDeviceScanTimeout();
    setSelectedDevice();
    setState(states.SEARCHING);

    return clearTimeout(timeoutRef?.current);
  }, [visible]);


  const handleConfirmConnect = async () => {
    setState(states.CONNECTING);
    stopScanningForPeripherals();
    try {
      await connectToDevice(selectedDevice);
      setError(`Connected to ${selectedDevice?.name}`);
    } catch (e) {
      setError(e.reason);
    } finally {
      setState(states.CONNECTED);
    }
  };

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],

  });

  if (state === states.SEARCHING) {
    Animated.loop(
      Animated.timing(
        spinValue,
        {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        },
      )
    ).start(() => spinValue.setValue(0));
  }

  if (state === states.CONNECTING || state === states.CONNECTED) {
    return (
      <Dialog
        style={{ backgroundColor: 'white', borderRadius: 2 }}
        visible={visible}
        onDismiss={onDismiss}
      >
        <Dialog.Content
          style={{
            minHeight: 100,
            maxHeight: 400,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {state === states.CONNECTING ?
            (
              <Text >Connecting to {selectedDevice?.id}</Text>
            )
            :
            (
              <Text>{error}</Text>
            )
          }
        </Dialog.Content>
        <Dialog.Actions>
          {
            state === states.CONNECTING &&
              <Button
                onPress={hideDialog}
                background={theme.colors.error}
                style={{
                  backgroundColor: theme.colors.error,
                  padding: 5,
                  marginRight: 15,
                }}
                mode='contained'
              >
                Cancel
              </Button>
          }
          {
            state === states.CONNECTED &&
              <Button
                /* style={{ */
                /*   backgroundColor: theme.colors.primary, */
                /* }} */
                /* textColor={theme.colors.onPrimary} */
                mode='contained'
                disabled={!selectedDevice}
                style={{
                  padding: 5,
                }}
                onPress={hideDialog}
              >
                Finish
              </Button>
          }
        </Dialog.Actions>
      </Dialog>
    );
  }

  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: 'white', borderRadius: 2 }}
        visible={visible}
        onDismiss={onDismiss}
      >
        <Dialog.Title
          style={{
            paddingLeft: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              marginEnd: 10,
            }}
          >Searching for Devices </Text>
          <Animated.View
            style={{
              transform: [{ rotate }]
            }}>
            <MaterialCommunityIcons
              name="sync"
              size={24}
              style={{
                color: theme.colors.primary,
              }}
            />
          </Animated.View>
        </Dialog.Title>
        <Dialog.Content
          style={{
            minHeight: 100,
            maxHeight: 400,
          }}
        >
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Checkbox.Item
                label={item.name}
                status={_.isEqual(selectedDevice, item) ? 'checked' : 'unchecked'}
                onPress={() => {
                  if (_.isEqual(selectedDevice, item)) {
                    setSelectedDevice();
                  } else {
                    setSelectedDevice(item);
                  }
                }}
                style={{
                  backgroundColor: theme.colors.secondaryContainer,
                  margin: 5,
                }}
              />
            )}
          >
          </FlatList>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={hideDialog}
            background={theme.colors.error}
            style={{
              backgroundColor: theme.colors.error,
              padding: 5,
              marginRight: 15,
            }}
            mode='contained'
          >
            Cancel
          </Button>
          <Button
            /* style={{ */
            /*   backgroundColor: theme.colors.primary, */
            /* }} */
            /* textColor={theme.colors.onPrimary} */
            mode='contained'
            onPress={handleConfirmConnect}
            disabled={!selectedDevice}
            style={{
              padding: 5,
            }}
          >
            Connect
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

ConnectDeviceModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};


export default ConnectDeviceModal;

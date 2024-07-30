import PropTypes from 'prop-types';
import React, {
  StyleSheet,
  ScrollView,
  View,
  Animated,
  FlatList,
  Image,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import {
  Button,
  Card,
  IconButton, Portal, ProgressBar, Text, Title, useTheme
} from 'react-native-paper';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import DeviceInfoCard from '../components/DeviceInfoCard';
import Separator from '../components/Seperator';
import { selectConnectedDevice, selectDeviceType, selectDevices, selectUnit } from '../state/store';
import { startListening } from '../state/BluetoothLowEnergy/slice';
import LogoTitle from '../components/LogoTitle';

import ConnectDeviceButton from '@/components/ConnectDevices';
import useBLE from '@/state/BluetoothLowEnergy/useBLE';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConnectDeviceModal from '@/components/ConnectDeviceModal';
import DeviceTemperatureDisplay from '@/components/DeviceTemperatureDisplay';
import DownloadCSVButton from '@/components/DownloadCSV';
import AlertNotifications from '@/components/AlertNotifications';


const ConnectNewDeviceButton = ({ onPress }) => {
  const theme = useTheme();

  return (
    <Button
      mode='elevated'
      rippleColor={theme.colors.onPrimary}
      onPress={onPress}
      labelStyle={{
        padding: 5,
        fontSize: 20,
      }}
      textColor={theme.colors.onPrimary}
      style={{
        backgroundColor: theme.colors.primary,
        /* padding: 5, */
      }}
    >
      Connect New Device
    </Button>
  );
};

ConnectNewDeviceButton.propTypes = {
  onPress: PropTypes.func,
};

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const devices = useSelector(selectDevices);
  const connectedDevice = useSelector(selectConnectedDevice);
  const deviceType = useSelector(selectDeviceType);
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { connectToDevice } = useBLE();

  const bottleImage = Image.resolveAssetSource(require('../assets/images/OceanBottle-no-bg.png'));
  const insulinPenImg = Image.resolveAssetSource(require('../assets/images/insulin-pen.png'));

  const HeaderLeftIcon = () => (
    <IconButton
      icon='cog'
      size={25}
      animated
      onPress={() => navigation.navigate('settings')}
      style={{
        marginLeft: 0,
        paddingLeft: 0,
      }}
    />
  );

  const HeaderRightIcon = () => (
    _.isEmpty(connectedDevice) ? null : (
      <IconButton
        icon='account-edit'
        size={30}
        animated
        onPress={() => navigation.navigate('deviceSettings')}
        style={{
          marginLeft: 0,
          paddingLeft: 0,
        }}
      />
    )
  );

  let content;
  if (_.isEmpty(connectedDevice)) {
    // NO DEVICE CONNECTED
    content =  (
      <View style={styles.noDeviceContainer}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Text>No device</Text>
        </View>
        <ConnectNewDeviceButton
          onPress={showDialog}
        />
        <ConnectDeviceModal
          setVisible={setVisible}
          visible={visible}
          onDismiss={hideDialog}
        />
      </View>
    );
  } else {
    // CONNECTED DEVICE
    content = (
      <>
        <Text
          style={{
            margin: 10,
            padding: 5,
            alignSelf: 'center',
          }}
          variant='displaySmall'
        >
          {connectedDevice.friendlyName}
        </Text>
        <View
          style={{
            justifyContent: 'space-between' ,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              /* height: '50%', */
              paddingLeft: 15,
              alignItems: 'center',
            }}
          >
            <Image 
              style={{
                padding: 10,
                width: 140,
                height: 324,
              }}
              source={{ uri: bottleImage.uri }}
            />
          </View>
          <View
            style={{
              flex: 1,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <DeviceTemperatureDisplay />
            <View
              style={{
                marginTop: 30,
                /* padding: 10, */
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  padding: 10,
                  borderColor: 'black',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '100%',
                  high: 'auto',
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Device Type: {deviceType}
                </Text>
                <Image 
                  style={{
                    padding: 10,
                    alignSelf: 'center',
                    height: 100,
                    width: 190,
                  }}
                  source={{ uri: insulinPenImg.uri }}
                />
              </View>
            </View>
          </View>
        </View>
        <AlertNotifications />
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <DownloadCSVButton />
        </View>
      </>
    );
  }


  return (
    <View style={styles.container} >
      <Stack.Screen
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerTitleAlign: 'center',
          headerRight: () => <HeaderRightIcon />,
          headerLeft: () => <HeaderLeftIcon />,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.secondaryContainer,
          },
        }}
      />
      {content}
    </View>
  );
}

const makeStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.secondaryContainer,
    flex: 1,
    /* alignItems: 'center', */
  },
  noDeviceContainer: {
    backgroundColor: theme.colors.secondaryContainer,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '50%'
  },
  title: {
    paddingTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 4,
    height: 1,
    width: '90%',
  },
});

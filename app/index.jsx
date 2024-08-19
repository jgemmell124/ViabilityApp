import PropTypes from 'prop-types';
import React, {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import {
  Button,
  IconButton,
  Text,
  useTheme
} from 'react-native-paper';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { selectConnectedDevice, selectDeviceType, selectDevices, selectUnit } from '../state/store';
import LogoTitle from '../components/LogoTitle';

import useBLE from '@/state/BluetoothLowEnergy/useBLE';
import ConnectDeviceModal from '@/components/ConnectDeviceModal';
import DeviceTemperatureDisplay from '@/components/DeviceTemperatureDisplay';
import DownloadCSVButton from '@/components/DownloadCSV';
import AlertNotifications from '@/components/AlertNotifications';
import DeviceTypeDisplay from '@/components/DeviceTypeDisplay';


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
              <DeviceTypeDisplay />
            </View>
          </View>
        </View>
        <AlertNotifications />
        {/* <TemperatureChart /> */}
        <View
          style={{
            alignItems: 'center',
          }}
        >
          { /* Removing downloads for demo */}
          {/* <DownloadCSVButton /> */}
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

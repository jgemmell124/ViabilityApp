import React, {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import {
  IconButton,
  Text,
  useTheme
} from 'react-native-paper';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { selectConnectedDevice } from '../state/store';
import LogoTitle from '../components/LogoTitle';

import ConnectDeviceModal from '@/components/device/ConnectDeviceModal';
import DeviceTemperatureDisplay from '@/components/device/DeviceTemperatureDisplay';
import AlertNotifications from '@/components/AlertNotifications';
import DeviceTypeDisplay from '@/components/device/DeviceTypeDisplay';
import ConnectNewDeviceButton from '@/components/device/ConnectNewDeviceButton';

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const navigation = useNavigation();
  const connectedDevice = useSelector(selectConnectedDevice);
  const theme = useTheme();
  const styles = makeStyles(theme);

  const bottleImage = Image.resolveAssetSource(require('@/assets/images/Metal_BS_Capped.png'));

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
              marginTop: 24,
              alignItems: 'center',
            }}
          >
            <Image
              style={{
                padding: 10,
                width: 140,
                height: 400,
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

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
import { selectConnectedDevice, selectDevices, selectUnit } from '../state/store';
import { startListening } from '../state/BluetoothLowEnergy/slice';
import LogoTitle from '../components/LogoTitle';

import ConnectDeviceButton from '@/components/ConnectDevices';
import useBLE from '@/state/BluetoothLowEnergy/useBLE';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConnectDeviceModal from '@/components/ConnectDeviceModal';
import DeviceTemperatureDisplay from '@/components/DeviceTemperatureDisplay';


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
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { connectToDevice } = useBLE();

  const HeaderLeftIcon = () => (
    <IconButton
      icon="cog"
      size={25}
      animated
      // TODO: device settings now?
      onPress={() => navigation.navigate('settings')}
      style={{
        marginLeft: 0,
        paddingLeft: 0,
      }}
    />
  );

  if (_.isEmpty(connectedDevice)) {
    return (
      <View style={{
        ...(styles.noDeviceContainer),
        backgroundColor: theme.colors.primaryContainer,
      }}>
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
  }

  const bottleImage = Image.resolveAssetSource(require('../assets/images/OceanBottle-no-bg.png'));


  return (
    <View style={styles.container} >
      <Stack.Screen
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerTitleAlign: 'center',
          headerRight: () => <ConnectDeviceButton />,
          headerLeft: () => <HeaderLeftIcon />,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.secondaryContainer,
          },
        }}
      />
      <Text
        style={{
          margin: 10,
        }}
        variant='displaySmall'
      >
        {connectedDevice.id}
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between' ,
          flexDirection: 'row',
          /* alignItems: 'center', */
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
        </View>
      </View>
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

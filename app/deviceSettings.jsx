import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Separator from '../components/Seperator';
import {
  Text,
  Button,
  Card,
  useTheme,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useNavigation } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectConnectedDevice,
  selectDeviceType,
  selectMaxTemp,
  selectMinTemp,
  selectUnit,
} from '@/state/store';
import useBLE from '@/state/BluetoothLowEnergy/useBLE';

import { setConnectedDevice } from '@/state/BluetoothLowEnergy/slice';

import {
  setDeviceType,
  setMaxTempC,
  setMinTempC,
} from '@/state/Settings/slice';

import DeviceSettingsDialog from '@/components/device/DeviceSettingsDialog';

const deviceTypes = ['Insulin Pen', 'Insulin Vial', 'Insulin Cartridge'];

const preciseNumber = (num) => Math.round(num * 100) / 100;
const CtoF = (c) => preciseNumber(c * 9 / 5 + 32);
const FtoC = (f) => ((f - 32) * 5 / 9);

export default function DeviceSettingsScreen() {
  const { disconnectFromDevice } = useBLE();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const connectedDevice = useSelector(selectConnectedDevice);
  const unitTemp = useSelector(selectUnit);
  const deviceType = useSelector(selectDeviceType);

  const theme = useTheme();
  const styles = makeStyles(theme);

  const [visible, setVisible] = useState(false);
  const [selectedField, setSelectedField] = useState({});

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const onDelete = () => {
    disconnectFromDevice(connectedDevice?.id).then(
      () => navigation.navigate('index')
    );
  };

  let minTemp = useSelector(selectMinTemp);
  let maxTemp = useSelector(selectMaxTemp);
  // show temp in friendly format
  if (unitTemp === 'F') {
    minTemp = CtoF(minTemp);
    maxTemp = CtoF(maxTemp);
  } else {
    minTemp = preciseNumber(minTemp);
    maxTemp = preciseNumber(maxTemp);
  }

  const editFields = [
    {
      name: 'Name',
      value: connectedDevice?.friendlyName ?? '',
      type: 'text',
      handler: (value) => {
        dispatch(setConnectedDevice({ ...connectedDevice, friendlyName: value }));
      }
    },
    {
      name: 'Location',
      value: connectedDevice?.loc ?? 'living room',
      type: 'text',
      handler: () => {}
    },
    { name: 'Device Type',
      value: deviceType,
      type: 'enum',
      options: deviceTypes,
      handler: (value) => {
        dispatch(setDeviceType(value));
      },
    },
    { name: `Min Temp (°${unitTemp})`,
      value: minTemp,
      type: 'numeric',
      handler: (value) => {
        if (unitTemp === 'F') {
          console.log(value);
          value = FtoC(value);
        }
        dispatch(setMinTempC(value));
      }
    },
    { name: `Max Temp (°${unitTemp})`,
      value: maxTemp,
      type: 'numeric',
      handler: (value) => {
        if (unitTemp === 'F') {
          value = FtoC(value);
        }
        dispatch(setMaxTempC(value));
      }
    },
  ];

  const textHeader = (text) => (
    <View
      style={{
        margin: 6,
        width: '100%',
        /* backgroundColor: '#f0f0f0', */
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
        }}>
        {text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Device Settings',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.secondaryContainer,
          },
        }}
      />
      {textHeader('Device Settings')}
      <View style={{ marginTop: 0, marginBottom: 10, width: '100%' }}>
        <Card
          style={{
            width: '100%',
            borderRadius: 0,
            /* borderWidth: '80%', */
            /* shadowColor: 'transparent', */
            borderColor: 'transparent',
          }}
          mode='outlined'
          elevation={0}
        >
          {
            editFields.map((field, index) => (
              <View key={`${field.name}-${index}`}>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedField(field);
                    showDialog();
                  }}
                >
                  <Card.Title
                    title={field.name}
                    titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                    subtitle={`${field.value ?? 'N/A'}`}
                    subtitleStyle={{ color: 'gray' }}
                    rightStyle={{marginRight: 10}}
                    right={(props) => <MaterialCommunityIcons {...props} name='chevron-right' />}
                  />
                </TouchableOpacity>
                {
                  index < editFields.length - 1 &&
                    <Separator style={{ alignSelf: 'center', width: '95%' }} />
                }
              </View>
            ))
          }
        </Card>
      </View>
      <View>
        <DeviceSettingsDialog
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          visible={visible}
          hideDialog={hideDialog}
        />
      </View>
      <Button
        mode='contained-tonal'
        icon='delete'
        labelStyle={{ color: theme.colors.onError }}
        onPress={onDelete}
        buttonColor={theme.colors.error}
        style={{
          marginTop: 10,
          width: '90%',
          color: theme.colors.onSecondary,
        }}
      >
        Delete Device
      </Button>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const makeStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.secondaryContainer,
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 0,
  },
  separator: {
    /* marginVertical: 30, */
    marginVertical: 0,
    height: 1,
    width: '80%',
  },
});

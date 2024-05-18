import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Separator from '../components/Seperator';
import { Text, Button, Card, Dialog, Portal, TextInput, useTheme } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectConnectedDevice, selectDeviceById, selectUnit } from '@/state/store';
import useBLE from '@/state/BluetoothLowEnergy/useBLE';
import { setConnectedDevice } from '@/state/BluetoothLowEnergy/slice';

export default function DeviceSettingsScreen() {
  const { id } = useLocalSearchParams();
  /* const dispatch = useDispatch(); */
  const { disconnectFromDevice } = useBLE();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // TODO get device by id when supporting multiple devices
  /* const device = useSelector(selectDeviceById(id)); */
  const connectedDevice = useSelector(selectConnectedDevice);
  const unitTemp = useSelector(selectUnit);

  const theme = useTheme();
  const styles = makeStyles(theme);

  const [visible, setVisible] = useState(false);
  const [selectedField, setSelectedField] = useState();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleSaveChange = () => {
    if (selectedField.name === 'Name') {
      const newName = selectedField.value;
      dispatch(setConnectedDevice({ ...connectedDevice, friendlyName: newName }));
    }
    hideDialog();
  };

  const onDelete = () => {
    /* dispatch(disconnectFromDevice(device)); */
    disconnectFromDevice(connectedDevice?.id).then(
      () => navigation.navigate('index')
    );
  };

  const editFields = [
    { name: 'Location', value: connectedDevice?.loc ?? 'living room', type: 'text' },
    { name: `Min Temp (°${unitTemp})`, value: connectedDevice?.loc ?? 23, type: 'numeric' },
    { name: `Max Temp (°${unitTemp})`, value: connectedDevice?.loc ?? 100, type: 'numeric' },
  ];

  const nameField = { name: 'Name', value: connectedDevice?.friendlyName ?? '', type: 'text' };

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
          <View>
            <TouchableOpacity
              onPress={() => {
                setSelectedField(nameField);
                showDialog();
              }}
            >
              <Card.Title
                title={nameField.name}
                titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                subtitle={nameField.value}
                subtitleStyle={{ color: 'gray' }}
                rightStyle={{marginRight: 10}}
                right={(props) => <MaterialCommunityIcons {...props} name='chevron-right' />}
              />
            </TouchableOpacity>
            <Separator style={{ alignSelf: 'center', width: '95%' }} />
          </View>
          {
            editFields.map((field, index) => (
              <View key={index}>
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
                    subtitle={field.value}
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
        <Portal>
          <Dialog
            style={{ backgroundColor: 'white', borderRadius: 2 }}
            visible={visible}
            onDismiss={hideDialog}
          >
            <Dialog.Title>Edit {selectedField?.name}</Dialog.Title>
            <Dialog.Content>
              <TextInput
                inputMode={selectedField?.type}
                mode='outlined'
                autoFocus
                onChangeText={(value) => setSelectedField({ ...selectedField, value })}
                value={selectedField?.value}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                mode='outlined'
                onPress={hideDialog}
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
              >
                Cancel
              </Button>
              <Button 
                mode='contained'
                onPress={handleSaveChange}
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                }}
              >
                Save
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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

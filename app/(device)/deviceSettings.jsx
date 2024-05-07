import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Separator from '../../components/Seperator';
import { Text, Button, Card, Dialog, Portal, TextInput, useTheme } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Stack, useLocalSearchParams } from 'expo-router';

export default function DeviceSettingsScreen() {
  const device = useLocalSearchParams();

  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [selectedField, setSelectedField] = useState();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const editFields = [
    { name: 'Name', value: device.name },
    { name: 'Location', value: device.loc ?? 'living room' },
    { name: 'Max Temp', value: device.loc ?? '100' },
    { name: 'Min Temp', value: device.loc ?? '23' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${device.name} Settings`,
        }}
      />
      <Text style={styles.title}>Device Settings</Text>
      <View style={styles.separator} />
      <View style={{ marginTop: 0, marginBottom: 10, width: '100%' }}>
        <Card
          style={{
            width: '100%',
            borderRadius: 0,
            /* borderWidth: '80%', */
            /* shadowColor: 'transparent', */
          }}
          // TODO: fix this to look more like settings
          mode='outlined'
          elevation={0}
          onPressOut={() => {
            setSelectedField(field);
            showDialog();
          }}
        >
          {
            editFields.map((field, index) => (
              <>
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
              <Separator style={{ alignSelf: 'center', width: '95%' }} />
              </>
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
                mode='outlined'
                autoFocus
                value={selectedField?.value}
                onChangeText={(text) => console.log(text)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Save</Button>
              <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
      <Button
        mode='contained-tonal'
        icon='delete'
        labelStyle={{ color: theme.colors.onError }}
        onPress={() => console.log('delete device')}
        buttonColor={theme.colors.error}
        style={{
          marginTop: 10,
          width: '90%',
          borderRadius: 10,
          color: theme.colors.onError,
        }}
      >
        Delete Device
      </Button>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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

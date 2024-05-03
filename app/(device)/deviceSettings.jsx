import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Button, Card, Dialog, Portal, TextInput } from 'react-native-paper';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function DeviceSettingsScreen() {
  const device = useLocalSearchParams();

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
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={{ marginTop: 10, marginBottom: 10, width: '100%' }}>
        {
          editFields.map((field, index) => (
            <Card
              key={index}
              style={{
                width: '100%',
                borderRadius: 0,
                shadowColor: 'transparent',
              }}
              mode='outlined'
              elevation={0}
              onPressOut={() => {
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
            </Card>
          ))
        }
      </View>
      <View>
        <Portal>
          <Dialog
            style={{ borderRadius: 2 }}
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
        mode='contained'
        onPress={() => console.log('delete device')}
        buttonColor='red'
        style={{
          marginTop: 10,
          width: '90%',
          borderRadius: 10,
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
    margin: 5,
  },
  separator: {
    /* marginVertical: 30, */
    height: 1,
    width: '80%',
  },
});

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Platform, StyleSheet } from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import { Button, IconButton, SegmentedButtons, Text } from 'react-native-paper';

import { View } from 'react-native';
import Separator from '@/components/Seperator';
import { useLocalSearchParams } from 'expo-router';


export default function DeviceScreen() {
  // this is really just the device name
  const device = useLocalSearchParams();
  const [timeRange, setTimeRange] = useState('Hour');
  const navigation = useNavigation();

  const HeaderRightIcon = () => {
    return (
      <IconButton
        icon="cog"
        size={25}
        animated
        onPressOut={() => navigation.navigate('deviceSettings', { name: device?.name, id: device?.id })}
        style={{
          marginRight: 0,
          paddingRight: 0,
        }}
      />
    );
  };

  const buttons = [
    { value: 'Hour', label: 'Hour' },
    { value: 'Day', label: 'Day' },
    { value: 'Week', label: 'Week' },
    { value: 'Month', label: 'Month' },
  ];


  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${device?.name}`,
          headerTitleAlign: 'left',
          headerShown: true,
          headerRight: () => <HeaderRightIcon />,
        }}
      />
      <Text style={styles.title}>Device Details</Text>
      <Separator style={{}} />
      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          value={timeRange}
          onValueChange={setTimeRange}
          buttons={buttons}
          style={{
            margin: 10,
          }}
        />
      </SafeAreaView>
      <View style={styles.container}>
        <Button
          mode='contained-tonal'
          icon='download'
          style={styles.button}
        >
          Export Data
        </Button>
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    /* justifyContent: 'center', */
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    width: '90%',
  },
  separator: {
    marginVertical: 0,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
});

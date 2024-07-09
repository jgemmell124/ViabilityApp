import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Platform, StyleSheet } from 'react-native';
import { Stack, useNavigation } from 'expo-router';

/* import TemperatureChart from '@/components/TemperatureChart'; */

import { Button, IconButton, SegmentedButtons, Text } from 'react-native-paper';

import { View } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Separator from '@/components/Seperator';
import { useLocalSearchParams } from 'expo-router';


export default function DeviceScreen() {
  // this is really just the device name
  const device = useLocalSearchParams();
  const [timeRange, setTimeRange] = useState('Hour');
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const temps = useMemo(() => {
    const now = new Date();
    // get the time one year ago
    const oneYearAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365);

    const temps = [
      { temperature: 20, date: now },
      { temperature: 21, date: new Date(oneYearAgo.getTime() + 1000) },
      { temperature: 22, date: new Date(oneYearAgo.getTime() + 2000) },
      { temperature: 23, date: new Date(oneYearAgo.getTime() + 3000) },
      { temperature: 24, date: new Date(oneYearAgo.getTime() + 4000) },
      { temperature: 25, date: new Date(oneYearAgo.getTime() + 5000) },
      { temperature: 40, date: new Date(oneYearAgo.getTime() + 6000) },
      { temperature: 43, date: new Date(now.getTime() + 7000) },
      { temperature: 45, date: new Date(now.getTime() + 8000) },
    ];
    return temps;

  }, []);


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


  /* const generateData = () => { */
  /*   const temps = []; */
  /*   for (let i = 0; i < 100; i++) { */
  /*     temps.push({ */
  /*       temperature: Math.random() * 100, */
  /*       date: new Date(oneYearAgo.getTime() + i * 1000), */
  /*     }); */
  /*   } */
  /*   return temps; */
  /* } */

  /* const temps = useMemo(generateData, []); */

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
        {/* <TemperatureChart */}
        {/*   tempData={temps} */}
        {/*   timeRange={'Hour'} */}
        {/* /> */}
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

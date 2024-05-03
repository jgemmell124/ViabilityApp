import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Platform, StyleSheet, Pressable } from 'react-native';
import { Stack, Link } from 'expo-router';

import TemperatureChart from '@/components/TemperatureChart';

import { SegmentedButtons } from 'react-native-paper';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '@/components/useColorScheme';
import { useRouter, useLocalSearchParams, useSearchParams } from 'expo-router';
import tempData from '@/constants/temperature';

import { LineChart } from 'react-native-chart-kit';
import tempDate from '@/constants/temperature';

export default function DeviceScreen() {
  const device = useLocalSearchParams();
  const [timeRange, setTimeRange] = useState('Hour');

  const colorScheme = useColorScheme();

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


  const generateData = () => {
    const temps = [];
    for (let i = 0; i < 100; i++) {
      temps.push({
        temperature: Math.random() * 100,
        date: new Date(oneYearAgo.getTime() + i * 1000),
      });
    }
    return temps;
  }

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
          headerRight: () => (
            <Link
              href={{
                pathname: '/(device)/deviceSettings',
                params: { name: device.name ?? 'foo' },
              }} 
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="gear"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginLeft: 10, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Text style={styles.title}>Device Details</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>
        This is your device {device?.name}
      </Text>
      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          value={timeRange.toString()}
          onValueChange={(value) => setTimeRange(value)}
          buttons={buttons}
          style={{
            margin: 10,
          }}
        />
        <TemperatureChart
          tempData={temps}
          timeRange={timeRange}
        />
      </SafeAreaView>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    /* justifyContent: 'center', */
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

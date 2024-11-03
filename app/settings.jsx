import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { Card, Checkbox, Dialog, Portal, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

import { Stack } from 'expo-router';
import Separator from '../components/Seperator';
import { useDispatch, useSelector } from 'react-redux';
import { selectUnit } from '@/state/store';
import { setUnitC, setUnitF } from '@/state/Settings/slice';

export default function SettingsScreen() {
  const [visible, setVisible] = useState(false);

  const tempUnit = useSelector(selectUnit);
  const dispatch = useDispatch();
  const theme = useTheme();

  const styles = makeStyles(theme);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

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
          title: 'Settings',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.secondaryContainer,
          },
        }}
      />
      <View style={{ marginTop: 0, marginBottom: 10, width: '100%' }}>
        {textHeader('Unit Settings')}
        <Card
          style={{
            width: '100%',
            borderRadius: 0,
            shadowColor: 'transparent',
            borderColor: 'transparent',
          }}
          mode='outlined'
          elevation={0}
          onPressOut={showDialog}
        >
          <Card.Title
            title={'Temperature Unit'}
            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
            subtitle={`°${tempUnit}`}
            subtitleStyle={{ color: 'gray' }}
            rightStyle={{marginRight: 10}}
            right={(props) => <MaterialCommunityIcons {...props} name='chevron-right' />}
          />
        </Card>
        {textHeader('App Information')}
        <Card
          style={{
            width: '100%',
            borderRadius: 0,
            shadowColor: 'transparent',
            borderColor: 'transparent',
          }}
          mode='outlined'
          elevation={0}
        >
          <Card.Title
            title={'Privacy Policy'}
            titleStyle={{ paddingTop: 4, margin: 0, fontSize: 16, fontWeight: 'bold' }}
            rightStyle={{marginRight: 10}}
            right={(props) => <MaterialCommunityIcons {...props} name='chevron-right' />}
          />
          <Separator style={styles.separator} />
          <Card.Title
            title={'Feedback / Bug Report'}
            titleStyle={{ paddingTop: 4, margin: 0, fontSize: 16, fontWeight: 'bold' }}
            rightStyle={{marginRight: 10}}
            right={(props) => <MaterialCommunityIcons {...props} name='chevron-right' />}
          />
          <Separator style={styles.separator} />
          <Card.Title
            title={'App Version'}
            titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
            subtitle={'1.1.0'}
            subtitleStyle={{ color: 'gray' }}
            rightStyle={{marginRight: 10}}
            right={(props) => <MaterialCommunityIcons {...props} name='chevron-right' />}
          />
        </Card>
      </View>
      <View>
        <Portal>
          <Dialog
            style={{ backgroundColor: 'white', borderRadius: 2 }}
            visible={visible}
            onDismiss={hideDialog}
          >
            <Dialog.Title>Select Temperature Unit</Dialog.Title>
            <Dialog.Content>
              <Checkbox.Item
                label='Farhenheit (°F)'
                status={`${tempUnit === 'C' ? 'unchecked' : 'checked'}`}
                onPress={() => {
                  dispatch(setUnitF());
                  hideDialog();
                }} />
              <Checkbox.Item
                label='Celsius (°C)'
                status={`${tempUnit === 'C' ? 'checked' : 'unchecked'}`}
                onPress={() => {
                  dispatch(setUnitC());
                  hideDialog();
                }} />
            </Dialog.Content>
          </Dialog>
        </Portal>
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const makeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.secondaryContainer,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    /* marginVertical: 30, */
    height: 1,
    alignSelf: 'center',
    width: '90%',
  },
});

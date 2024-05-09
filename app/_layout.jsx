import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Provider } from 'react-redux';

import { store } from '@/state/store';
import { requestPermissions } from '@/state/BluetoothLowEnergy/utils';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

/* export const unstable_settings = { */
/*   // Ensure that reloading on `/modal` keeps a back button present. */
/*   initialRouteName: 'index', */
/* }; */

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    requestPermissions();
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  const theme = {
    ...MD3LightTheme,
    'colors': {
      'primary': 'rgb(0, 102, 136)',
      'onPrimary': 'rgb(255, 255, 255)',
      'primaryContainer': 'rgb(194, 232, 255)',
      'onPrimaryContainer': 'rgb(0, 30, 44)',
      'secondary': 'rgb(78, 97, 109)',
      'onSecondary': 'rgb(255, 255, 255)',
      'secondaryContainer': 'rgb(209, 229, 243)',
      'onSecondaryContainer': 'rgb(9, 30, 40)',
      'tertiary': 'rgb(96, 90, 125)',
      'onTertiary': 'rgb(255, 255, 255)',
      'tertiaryContainer': 'rgb(229, 222, 255)',
      'onTertiaryContainer': 'rgb(28, 23, 54)',
      'error': 'rgb(186, 26, 26)',
      'onError': 'rgb(255, 255, 255)',
      'errorContainer': 'rgb(255, 218, 214)',
      'onErrorContainer': 'rgb(65, 0, 2)',
      'background': 'rgb(251, 252, 254)',
      'onBackground': 'rgb(25, 28, 30)',
      'surface': 'rgb(251, 252, 254)',
      'onSurface': 'rgb(25, 28, 30)',
      'surfaceVariant': 'rgb(220, 227, 233)',
      'onSurfaceVariant': 'rgb(64, 72, 77)',
      'outline': 'rgb(113, 120, 125)',
      'outlineVariant': 'rgb(192, 199, 205)',
      'shadow': 'rgb(0, 0, 0)',
      'scrim': 'rgb(0, 0, 0)',
      'inverseSurface': 'rgb(46, 49, 51)',
      'inverseOnSurface': 'rgb(240, 241, 243)',
      'inversePrimary': 'rgb(119, 209, 255)',
      'elevation': {
        'level0': 'transparent',
        'level1': 'rgb(238, 245, 248)',
        'level2': 'rgb(231, 240, 245)',
        'level3': 'rgb(223, 236, 241)',
        'level4': 'rgb(221, 234, 240)',
        'level5': 'rgb(216, 231, 238)'
      },
      'surfaceDisabled': 'rgba(25, 28, 30, 0.12)',
      'onSurfaceDisabled': 'rgba(25, 28, 30, 0.38)',
      'backdrop': 'rgba(42, 49, 54, 0.4)'
    }
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerShown: true,
          }}
          initialRouteName='index'
        >
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="index" options={{ headerShown: true }} />
          {/* <Stack.Screen name="home" options={{ presentation: 'modal' }} /> */}
          <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(device)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </Provider>
  );
}

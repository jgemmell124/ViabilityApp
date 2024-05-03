import { Stack } from 'expo-router';

export default function DeviceNav() {

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="device" />
      <Stack.Screen name="deviceSettings" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

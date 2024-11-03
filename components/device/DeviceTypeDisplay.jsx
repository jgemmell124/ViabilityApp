import React from 'react';
import { selectDeviceType } from '@/state/store';
import { Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Text } from 'react-native-paper';


const DeviceTypeDisplay = () => {
  const deviceType = useSelector(selectDeviceType);
  let image;
  if (deviceType === 'Insulin Pen') {
    image = Image.resolveAssetSource(require('@/assets/images/insulin-pen.png'));
  } else if (deviceType === 'Insulin Vial') {
    image = Image.resolveAssetSource(require('@/assets/images/insulin-vial.png'));
  } else if (deviceType === 'Insulin Cartridge') {
    image = Image.resolveAssetSource(require('@/assets/images/insulin-cartridge.png'));
  }

  return (
    <View
      style={{
        padding: 10,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        height: 'auto',
      }}
    >
      <Text
        style={{
          marginBottom: 10,
          alignSelf: 'center',
          justifyContent: 'center',
        }}
      >
        Device Type: {deviceType}
      </Text>
      <Image
        style={{
          margin: 0,
          display: 'flex',
          padding: 10,
          alignSelf: 'center',
          width: '100%',
          height: 100,
          resizeMode: 'contain',
        }}
        source={{ uri: image.uri }}
      />
    </View>
  );
};

export default DeviceTypeDisplay;

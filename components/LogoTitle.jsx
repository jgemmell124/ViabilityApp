// Code for the LogoTitle component
import React, { Image } from 'react-native';
import logo from '../assets/images/logo-v2.png';

function LogoTitle() {
  const logoUri = Image.resolveAssetSource(logo).uri;
  return (
    <Image
      source={{ uri: logoUri }}
      style={{
        height: 40,
        width: 110,
      }}
    />
  );
}

export default LogoTitle;

// Code for the LogoTitle component
import React, { Image } from 'react-native';
import logo from '../assets/images/VIAbility_logo.png';

function LogoTitle() {
  const logoUri = Image.resolveAssetSource(logo).uri;
  return (
    <Image
      source={{ uri: logoUri }}
      style={{
        height: 50,
        width: 180,
      }}
    />
  );
}

export default LogoTitle;

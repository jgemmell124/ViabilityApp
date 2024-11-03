import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  useTheme
} from 'react-native-paper';

const ConnectNewDeviceButton = ({ onPress }) => {
  const theme = useTheme();

  return (
    <Button
      mode='elevated'
      rippleColor={theme.colors.onPrimary}
      onPress={onPress}
      labelStyle={{
        padding: 5,
        fontSize: 20,
      }}
      textColor={theme.colors.onPrimary}
      style={{
        backgroundColor: theme.colors.primary,
      }}
    >
      Connect New Device
    </Button>
  );
};

ConnectNewDeviceButton.propTypes = {
  onPress: PropTypes.func,
};

export default ConnectNewDeviceButton;

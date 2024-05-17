import React from 'react';
import PropTypes from 'prop-types';
import { Button, useTheme } from 'react-native-paper';

const CustomButton = ({ onPress, children, ...props }) => {
  const theme = useTheme();
  return (
    <Button
      onPress={onPress}
      labelStyle={{
        padding: 10,
        fontSize: 20,
      }}
      textColor={theme.colors.onPrimary}
      style={{
        backgroundColor: theme.colors.primary,
        padding: 5,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.node,
};

export default CustomButton;

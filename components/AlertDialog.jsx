import * as React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

const AlertDialog = ({ visible, setVisible, id }) => {
  const alerts = useSelector(state => state.alerts.alerts);
  const alert = alerts.find(alert => alert.id === id);

  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{alert.message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

AlertDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default AlertDialog;

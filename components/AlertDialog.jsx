import * as React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import AlertEnum, { iconsMap } from '@/constants/AlertEnum';

const AlertDialog = ({ visible, setVisible, id }) => {
  const alerts = useSelector(state => state.alerts.alerts);
  console.log('id', id);
  const alert = alerts.find(alert => alert.id === id);
  if (!alert) return;
  const alertType = alert?.type;

  const hideDialog = () => setVisible(false);

  let actionMessage = '';
  if (alertType === AlertEnum.SEVERE) {
    actionMessage = 'It is recommended to no longer use your unit';
  }

  const iconType = iconsMap[alertType];

  return (
    <Portal>
      <Dialog 
        visible={visible}
        onDismiss={hideDialog}
      >
        <Dialog.Icon 
          icon={iconType.icon}
          color={iconType.color}
          size={36} 
        />
        <Dialog.Title
          style={{
            textAlign: 'center',
          }}
        >
          {alertType} Alert
        </Dialog.Title>
        <Dialog.Content
          style={{
            alignContent: 'center',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
            }}
            variant="bodyMedium">{alert.message}</Text>
          {
            actionMessage &&
              <Text 
                style={{
                  textAlign: 'center',
                }}
                variant="bodyMedium">{actionMessage}</Text>
          }
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

import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  Portal,
  TextInput,
  Checkbox,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectDeviceType } from '@/state/store';


const DeviceSettingsDialog = ({ selectedField, setSelectedField, visible, hideDialog }) => {
  const deviceType = useSelector(selectDeviceType);

  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: 'white', borderRadius: 2 }}
        visible={visible}
        onDismiss={hideDialog}
      >
        <Dialog.Title>Edit {selectedField?.name}</Dialog.Title>
        <Dialog.Content>
          {
            selectedField?.type === 'enum' &&
              selectedField.options?.map((option, index) => (
                <Checkbox.Item
                  key={index}
                  label={option}
                  status={`${deviceType === option ? 'checked' : 'unchecked'}`}
                  onPress={() => {
                    selectedField.handler(option);
                    hideDialog();
                  }} />
              ))
          }
          {
            selectedField?.type === 'text' &&
              <TextInput
                inputMode={selectedField?.type}
                mode='outlined'
                autoFocus
                onChangeText={(value) => setSelectedField({ ...selectedField, value })}
                value={selectedField?.value}
              />
          }
          {
            selectedField?.type === 'numeric' &&
              <TextInput
                inputMode={selectedField?.type}
                mode='outlined'
                autoFocus
                keyboardType='numeric'
                onChangeText={(value) => setSelectedField({ ...selectedField, value })}
                value={selectedField?.value ?? 0}
              />
          }
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode='outlined'
            onPress={hideDialog}
            style={{
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            Cancel
          </Button>
          <Button
            mode='contained'
            onPress={() => {
              selectedField.handler(selectedField.value);
              hideDialog();
            }}
            style={{
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

DeviceSettingsDialog.propTypes = {
  selectedField: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.array,
    type: PropTypes.oneOf(['enum', 'text', 'numeric']),
    handler: PropTypes.func,
  }).isRequired,
  setSelectedField: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  hideDialog: PropTypes.func.isRequired,
};

export default DeviceSettingsDialog;

import { useEffect, useMemo, useState } from 'react';
import {
  BleManager
} from 'react-native-ble-plx';

import base64 from 'react-native-base64';
import { useDispatch, useSelector } from 'react-redux';
import { selectConnectedDevice, selectDevices } from '../store';
import { deleteDevice, setConnectedDevice, setDevice, setRetrievedTemp } from './slice';

const TEMP_SERVICE = '19b10000-e8f2-537e-4f6c-d104768a9274';
const TEMP_READ_CHARACTERISTIC = '19b10001-e8f2-537e-4f6c-d104768a9275';

const DEVICE_NAME = 'VIABILITY_DEVICE';

const bleManager = new BleManager();

function useBLE()  {
  const dispatch = useDispatch();
  const allDeivces = useSelector(selectDevices);
  const connectedDevice = useSelector(selectConnectedDevice);

  const isDuplicteDevice = (devices, nextDevice) => {
    console.log(devices, nextDevice.id);
    return devices.findIndex((device) => nextDevice.id === device.id) > -1;
  };

  const scanForPeripherals = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      console.log('hererere');
      if (error) {
        console.log(error);
      }
      if (isDuplicteDevice(allDeivces ?? [], device)) {
        return;
      }
      if (device.name === DEVICE_NAME) {
        dispatch(setDevice({ id: device.id, name: device.name }));
      }
    });
  };

  const stopScanningForPeripherals = () => {
    bleManager.stopDeviceScan();
  };

  const connectToDevice = async (device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      dispatch(setConnectedDevice({ id: deviceConnection.id, name: deviceConnection.name }));
      await deviceConnection.discoverAllServicesAndCharacteristics();
      _startStreamingData(deviceConnection);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = async (identifier) => {
    if (identifier) {
      try {
        await bleManager.cancelDeviceConnection(identifier);
      } catch (e) {
        console.log('FAILED TO DISCONNECT', e);
      } finally {
        dispatch(deleteDevice(identifier));
      }
    } else {
      console.log('No Device Connected');
    }
  };

  const _decodeTemp = (value) => {
    const rawData = base64.decode(value);
    const temp = parseInt(rawData, 16);
    return temp;
  };


  const _onReadTemperature = (error, characteristic) => {
    if (error) {
      console.log(error);
      return;
    }
    const temp = _decodeTemp(characteristic?.value);
    dispatch(setRetrievedTemp(temp));

  };

  const _startStreamingData = async (device) => {
    console.log('streaming data');
    if (device) {
      device.monitorCharacteristicForService(
        TEMP_SERVICE,
        TEMP_READ_CHARACTERISTIC,
        _onReadTemperature
      );
    } else {
      console.log('No Device Connected');
    }
  };

  return {
    scanForPeripherals,
    stopScanningForPeripherals,
    connectToDevice,
    disconnectFromDevice,
  };
}

export default useBLE;

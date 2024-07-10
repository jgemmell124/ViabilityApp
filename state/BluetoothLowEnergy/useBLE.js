import { useEffect, useMemo, useState } from 'react';
import { Buffer } from 'buffer';
import {
  BleManager,
} from 'react-native-ble-plx';
import * as FileSystem from 'expo-file-system';

import base64 from 'react-native-base64';
import { useDispatch, useSelector } from 'react-redux';
import { selectConnectedDevice, selectDevices } from '../store';
import { deleteDevice, setBatteryLevel, setConnectedDevice, setDevice, setRSSI, setRetrievedTemp } from './slice';

const UUID16_SVC_ENVIRONMENTAL_SENSING = '181A';
const UUID16_CHR_TEMPERATURE = '2A6E';
const UUID16_CHR_NEW_ALERT = '2A46';

const BATTERY_SERVICE = '0000180F-0000-1000-8000-00805F9B34FB';
const BATTERY_LEVEL_CHARACTERISTIC = '00002A19-0000-1000-8000-00805F9B34FB';

const UUID_LOG_TRANSFER_CUSTOM = '63CE';
const UUID_CHR_TRANSFER_LOG = '63CF';
const UUID_CHR_TRANSFER_LOG_TRIGGER = '63D0';

const DEVICE_NAME = 'VIABILITY_DEVICE';

const bleManager = new BleManager();

function useBLE()  {
  const dispatch = useDispatch();
  const allDeivces = useSelector(selectDevices);
  const connectedDevice = useSelector(selectConnectedDevice);
  const [isConnected, setIsConnected] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const isDuplicteDevice = (devices, nextDevice) => {
    console.log(devices, nextDevice.id);
    return devices.findIndex((device) => nextDevice.id === device.id) > -1;
  };

  useEffect(() => {
    const rssiSubscription = setInterval(async () => {
      if (connectedDevice) {
        try {
          const device = await bleManager.readRSSIForDevice(connectedDevice.id);
          dispatch(setRSSI(device.rssi));
        } catch (e) {
          console.log('FAILED TO READ RSSI', e);
          setIsConnected(false);
        }
      } else {
        console.log('No Device Connected');
      }
    }, 5000);

    return () => clearInterval(rssiSubscription);

  }, [connectedDevice]);

  useEffect(() => {

    const scanSubscription = setInterval(() => {
      // stop scan after 5 seconds
      if (connectedDevice && !isConnected) {
        console.log('starting scan');
        setIsConnected(true);
        reconnectDevice();
      }
      setTimeout(() => {
        stopScanningForPeripherals();
      }, 5000);
    }, 10000);

    return () => clearInterval(scanSubscription);
  }, [isConnected]);

  const scanForPeripherals = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }
      if (isDuplicteDevice(allDeivces ?? [], device)) {
        return;
      }
      if (device.name === DEVICE_NAME) {
        dispatch(setDevice({ id: device.id, name: device.name }));
        /* bleManager.stopDeviceScan(); */
      }
    });
  };

  const stopScanningForPeripherals = () => {
    bleManager.stopDeviceScan();
  };

  const connectToDevice = async (device) => {
    const deviceConnection = await bleManager.connectToDevice(device.id);
    dispatch(setConnectedDevice({ 
      id: deviceConnection.id,
      name: deviceConnection.name,
      friendlyName: deviceConnection.name
    }));
    await deviceConnection.discoverAllServicesAndCharacteristics();
    setIsConnected(true);
    _subscribeTemperatureData(deviceConnection);
    _subscribeTemperatureAlerts(deviceConnection)
    _subscribeBatteryLevel(deviceConnection);
  };

  // reconnected device after it has been disconnected
  const reconnectDevice = async () => {
    if (connectedDevice) {
      if (!bleManager.isDeviceConnected(connectedDevice.id)) {
        console.log('device already conneted');
        setIsConnected(true);
        return;
      }
      console.log('attempting to reconnect');
      bleManager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          console.log(error);
          return;
        }
        if (device.name === connectedDevice.name && device.id === connectedDevice.id) {
          console.log('reconnected to device');
          bleManager.stopDeviceScan();
          const deviceConnection = await bleManager.connectToDevice(connectedDevice.id);
          await deviceConnection.discoverAllServicesAndCharacteristics();
          setIsConnected(true);
          _subscribeTemperatureData(deviceConnection);
          _subscribeTemperatureAlerts(deviceConnection)
          _subscribeBatteryLevel(deviceConnection);
        }
      });
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

  const _decodeTemp = (base64Value) => {
    // temperature is sent as a float in Celcius
    const rawData = Buffer.from(base64Value, 'base64');
    const temp = rawData.readFloatLE();
    return temp;
  };

  const _onReadTemperature = (error, characteristic) => {
    if (error) {
      console.log('error', error);
      return;
    }
    const temp = _decodeTemp(characteristic?.value);
    dispatch(setRetrievedTemp(temp));
  };

  const _subscribeTemperatureData = async (device) => {
    if (device) {
      console.log('streaming data');
      device.monitorCharacteristicForService(
        UUID16_SVC_ENVIRONMENTAL_SENSING,
        UUID16_CHR_TEMPERATURE,
        _onReadTemperature
      );
    } else {
      console.log('No Device Connected');
    }
  };

  const _onReadAlert = (error, characteristic) => {
    if (error) {
      console.log('error', error);
      return;
    }
    const alert = _decodeTemp(characteristic?.value);
    console.log('ALERT', alert);
  };

  const _subscribeTemperatureAlerts = async (device) => {
    if (device) {
      console.log('subscribing to alerts');
      device.monitorCharacteristicForService(
        UUID16_SVC_ENVIRONMENTAL_SENSING,
        UUID16_CHR_NEW_ALERT,
        _onReadAlert
      );
    } else {
      console.log('No Device Connected');
    }
  };

  const _onReadBattery = (error, characteristic) => {
    if (error) {
      console.log('error', error);
      return;
    }
    const valueB64 = characteristic?.value;
    const decodedBatteryLevel = Buffer.from(valueB64, 'base64').readUInt8();
    dispatch(setBatteryLevel(decodedBatteryLevel));
  };

  const _subscribeBatteryLevel = async (device) => {
    if (device) {
      console.log(device);
      device.monitorCharacteristicForService(
        BATTERY_SERVICE,
        BATTERY_LEVEL_CHARACTERISTIC,
        _onReadBattery
      );
    }
  };

  const streamFileData = async () => {
    let fileSize = 0;
    let csvFile = '';
    let subscription;
    // TODO set timeout
    if (connectedDevice) {

      const p = {};
      p.resolve = () => {};
      p.promise = new Promise((resolve, reject) => {
        p.resolve = resolve;
        p.reject = reject;
      })

      // do this to retrieve device
      const device = (await bleManager.readRSSIForDevice(connectedDevice.id))

      console.log('rsii', device.rssi);

      const transactionId = 'FILE_DOWNLOAD';
      subscription = device?.monitorCharacteristicForService(
        UUID_LOG_TRANSFER_CUSTOM,
        UUID_CHR_TRANSFER_LOG,
        (error, characteristic) => {
          if (error) {
            console.log(' character error', error);
            return;
          }
          if (fileSize === 0) {
            // read the size of the file
            const sizeData = Buffer.from(characteristic?.value, 'base64');
            fileSize = sizeData.readUint32LE(); // little endian
            console.log('file size', fileSize);
          } else {
            const data = Buffer.from(characteristic?.value, 'base64');
            csvFile += data;
            setDownloadProgress(csvFile.length / fileSize * 100);
            console.log('DOWNLOADING', csvFile.length / fileSize * 100, '%');
          }
          if (csvFile.length >= fileSize) {
            // stop the stream (EOF)
            // TODO cancel transaction after timeout?
            bleManager.cancelTransaction(transactionId);
            console.log('resolving!');
            p.resolve();
          }
        },
        transactionId
      );
      console.log('awaiting');
      await p.promise;
      console.log('done awaiting');
    } else {
      console.log('No Device Connected');
    }
    subscription?.remove();
    console.log('subscription remove');
    setDownloadProgress(0);
    return csvFile.toString();
  }

  const triggerFileTransfer = async () => {
    if (!connectedDevice) {
      console.log('No Device Connected');
      return;
    }
    // do this to retrieve device
    const device = (await bleManager.readRSSIForDevice(connectedDevice.id))

    const p = {};
    p.resolve = () => {};
    p.promise = new Promise((resolve, reject) => {
      p.resolve = resolve;
      p.reject = reject;
    })

    // set up a stream for the file
    const transactionId = 'FILE_DOWNLOAD';
    subscription = device?.monitorCharacteristicForService(
      UUID_LOG_TRANSFER_CUSTOM,
      UUID_CHR_TRANSFER_LOG,
      (error, characteristic) => {
        if (error) {
          console.log(' character error', error);
          return;
        }
        if (fileSize === 0) {
          // read the size of the file
          const sizeData = Buffer.from(characteristic?.value, 'base64');
          fileSize = sizeData.readUint32LE(); // little endian
          console.log('file size', fileSize);
        } else {
          const data = Buffer.from(characteristic?.value, 'base64');
          csvFile += data;
          console.log('DOWNLOADING', csvFile.length / fileSize * 100, '%');
        }
        if (csvFile.length >= fileSize) {
          // stop the stream (EOF)
          // TODO cancel transaction after timeout?
          bleManager.cancelTransaction(transactionId);
          p.resolve();
        }
      },
      transactionId
    );

    // tell device we're ready for file transfter
    device.writeCharacteristicWithoutResponseForService(
      UUID_LOG_TRANSFER_CUSTOM,
      UUID_CHR_TRANSFER_LOG_TRIGGER,
      base64.encode('1')
    );

    // wait to stream file
    await p.promise;
    subscription?.remove();

    return csvFile.toString();
  };

  return {
    downloadProgress,
    scanForPeripherals,
    stopScanningForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    triggerFileTransfer,
    streamFileData,
  };
}

export default useBLE;

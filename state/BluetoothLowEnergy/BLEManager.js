import base64 from 'react-native-base64';
import {
  BleManager,
} from 'react-native-ble-plx';


const TEMP_SERVICE = '19b10000-e8f2-537e-4f6c-d104768a9274';
const TEMP_READ_CHARACTERISTIC = '19b10001-e8f2-537e-4f6c-d104768a9275';

// Singleton class to manage BLE connections
class BluetoothLeManager {
  isListening = false;

  constructor() {
    this.bleManager = new BleManager();
    this.device = null;
  }

  scanForPeripherals = (onDeviceFound) => {
    this.bleManager.startDeviceScan(null, null, (_, scannedDevice) => {
      onDeviceFound({
        id: scannedDevice?.id,
        name: scannedDevice?.localName ?? scannedDevice?.name,
      });
    });
  };

  stopScanningForPeripherals = () => {
    this.bleManager.stopDeviceScan();
  };

  connectToPeripheral = async (identifier) => {
    this.device = await this.bleManager.connectToDevice(identifier);
    await this.device?.discoverAllServicesAndCharacteristics();
    console.log('Connected to device', this.device?.name);
  };

  disconnectFromPeripheral = async (identifier) => {
    await this.bleManager.cancelDeviceConnection(identifier);
    this.device = null;
    this.isListening = false;
  };

  readTemp = async () => {
    try {
      const rawTemp = await this.bleManager.readCharacteristicForDevice(
        this.device?.id ?? '',
        TEMP_SERVICE,
        TEMP_READ_CHARACTERISTIC
      );
      return base64.decode(rawTemp.value);
    } catch (e) {
      /* console.log(e); */
    }
  };

  onTempUpdate = (error, charactaristic, emitter) => {
    if (error) {
      return emitter({ payload: '' });
    }

    const rawData = base64.decode(charactaristic?.value);
    const temp = parseInt(rawData, 16);

    emitter({ payload: temp });
  };

  startStreamingData = async (emitter) => {
    console.log('inside streaming');
    if (!this.isListening) {
      console.log('inside streaming if', this.device);
      // TODO check if device is already connected outside of this
      this.isListening = true;
      this.device?.monitorCharacteristicForService(
        TEMP_SERVICE,
        TEMP_READ_CHARACTERISTIC,
        (error, charactaristic) => {
          this.onTempUpdate(error, charactaristic, emitter);
        }
      );
    } else {
      console.log('already listening');
    }
  };
}

const manager = new BluetoothLeManager();

export default manager;

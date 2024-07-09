import React, { useState } from 'react';
import useBLE from '@/state/BluetoothLowEnergy/useBLE';
import { selectConnectedDevice } from '@/state/store';
import { Button, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import fileManager from '@/state/FileManager/FileManager';

const csvDir = FileSystem.documentDirectory + 'logs/';

/* Download CSV
 * @param {Date} startTime - The start time of the data to download
 * @param {Date} endTime - The end time of the data to download
 * @param {String} interval - The interval to download data (e.g. 'hour', 'day', 'month')
 *
 */
const DownloadCSVButton = ({ startTime, endTime, interval }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const connectedDevice = useSelector(selectConnectedDevice);

  const [fileContent, setFileContent] = useState('');
  // TODO make this a redux state

  const { downloadProgress, triggerFileTransfer } = useBLE();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const fileString = await triggerFileTransfer();
      await fileManager.writeFile(csvDir, 'log.csv', fileString);
      const fileContents = await fileManager.readFile(csvDir + 'log.csv');
      console.log(fileContents);
      await fileManager.exportFile(csvDir + 'log.csv', 'log.csv', 'text/csv');
    } catch (e) {
      console.log('err', e.message);
    }

    setIsDownloading(false);
  }

  return (
    <>
      <Button
        mode='contained'
        onPress={handleDownload}
        style={{
          width: '90%',
        }}
        loading={isDownloading}
      >
        {
          isDownloading ? `Downloading... ${downloadProgress.toPrecision(2)}%` : 'Download CSV'
        
        }
      </Button>
      <Text>
        {fileContent}
      </Text>
    </>
  );
};

export default DownloadCSVButton;

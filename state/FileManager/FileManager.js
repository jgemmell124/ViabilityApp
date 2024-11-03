import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

class FileManager {
  constructor() {
    this.files = [];
    this.csvDir = FileSystem.documentDirectory + 'logs/';
    this.tempDir = FileSystem.cacheDirectory;
  }

  async readFile(filePath) {
    return FileSystem.readAsStringAsync(filePath);
  }

  async writeFile(filePath, fileName, fileData) {
    this._ensureDirExists(filePath);
    this._ensureFileExists(filePath + fileName);
    return FileSystem.writeAsStringAsync(filePath + fileName, fileData);
  }

  async exportFile(internalFilePath, exportFileName, mimetype, saveLocally=false) {
    if (saveLocally && Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const internalFileContents = await FileSystem.readAsStringAsync(internalFilePath);
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, exportFileName, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, internalFileContents);
          })
          .catch(e => console.log(e));
      } else {
        await Sharing.shareAsync(internalFilePath);
      }
    } else {
      await Sharing.shareAsync(internalFilePath);
    }

  }

  _ensureDirExists(dir) {
    FileSystem.getInfoAsync(dir).then(({ exists }) => {
      if (!exists) {
        FileSystem.makeDirectoryAsync(dir);
      }
    });
  }

  _ensureFileExists(filePath) {
    FileSystem.getInfoAsync(filePath).then(({ exists }) => {
      if (!exists) {
        FileSystem.writeAsStringAsync(filePath, '');
      }
    });
  }
}

const fileManager = new FileManager();

export default fileManager;

const csvFileStringToJson = (csvFileString) => {
  const lines = csvFileString.split('\n');
  const headers = lines[0].split(',');
  // create a JSON object of each data point
  // key: timestamp, value: temperature in Celcius
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    return obj;
  });
  return data;
};


const jsonToCsvFileString = (jsonData) => {
  const headers = Object.keys(jsonData[0]).join(',');
  const lines = jsonData.map(dataPoint => {
    return Object.values(dataPoint).join(',');
  });
  return headers + '\n' + lines.join('\n');
};


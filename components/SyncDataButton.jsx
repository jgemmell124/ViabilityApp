import { Button } from "react-native-paper";
import useBLE from "@/state/BluetoothLowEnergy/useBLE";


const SyncDataButton = ({ onClick }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { streamFileData } = useBLE();

  const handleSync = async () => {
    const fileData = await streamFileData();
    // TODO make FS manager
    const fileString = await streamFileData(connectedDevice);
    try {
      await fileManager.writeFile(csvDir, 'log.csv', fileString);
    } catch (e) {
      console.log('err', e.message);
    }
  };

  return (
    <Button
      onPress={handleSync}
      loading={isSyncing}
    >
      {isSyncing ? 'Syncing...' : 'Sync Data'}
    </Button>
  );
};

export default SyncDataButton;

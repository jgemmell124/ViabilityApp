import { StyleSheet, View } from "react-native"

const Separator = ({ style }) => {
  return (
    <View
      style={{
        ...styles.separator,
        ...style
      }} 
    />
  )
};

const styles = StyleSheet.create({
  separator: {
    width: '90%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default Separator;

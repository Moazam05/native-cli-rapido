import {View, Modal, StatusBar, StyleSheet, Dimensions} from 'react-native';
import React from 'react';

const CustomModal = ({visible, children}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0, 0, 0, 0.5)"
      />
      <View style={styles.modalView}>
        <View style={styles.mainView}>{children}</View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
});

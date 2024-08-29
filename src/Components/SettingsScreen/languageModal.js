import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const LanguageModal = ({ visible, onClose, selectedTheme, systemLanguage }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={[styles.modalContent,{borderColor:selectedTheme.mainColor}]}>
        <Text style={[styles.modalText,{color:selectedTheme.mainColor}]}>
          Şu anki sistem diliniz: {systemLanguage}
        </Text>
        <Text style={[styles.modalText,{color:selectedTheme.fifthColor}]}>
          Uygulama dilini değiştirme özellikleri daha sonra eklenecektir.
        </Text>
        <TouchableOpacity style={[styles.closeButton,{borderColor:selectedTheme.mainColor}]} onPress={onClose}>
          <Text style={[styles.closeButtonText,{color:selectedTheme.mainColor}]}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth:3,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    borderWidth:2,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LanguageModal;

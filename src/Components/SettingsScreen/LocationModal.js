import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationModal = ({ visible, onClose, location, selectedTheme ,defaultRegion}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={[styles.modalContent,{backgroundColor:selectedTheme.mainColor,borderColor:selectedTheme.whiteColor}]}>
        <MapView
          style={styles.map}
          region={location ? {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          } : defaultRegion}
        >
          <Marker
            coordinate={location ? {
              latitude: parseFloat(location.latitude),
              longitude: parseFloat(location.longitude),
            } : defaultRegion}
            title={location ? "Mevcut Konum" : "Varsayılan Konum"}
          />
        </MapView>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: selectedTheme.secondaryColor }]}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Kapat</Text>
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
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth:3
  },
  map: {
    flex: 1,
    borderRadius: 10,
  },
  closeButton: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LocationModal;

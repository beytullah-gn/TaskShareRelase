import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LocationButton = ({ onPress, color }) => (
  <TouchableOpacity
    style={[styles.locationButton, { backgroundColor: color.whiteColor }]}
    onPress={onPress}
  >
    <Icon name="map-marker" size={30} color={color.fifthColor} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 0,
    width:50,
    height:50,
    borderRadius: 50,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white',
  },
});

export default LocationButton;

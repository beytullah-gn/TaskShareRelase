import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ThemeButton = ({ onPress, backgroundColor }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor }]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>Tema Seç</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 15,


  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ThemeButton;

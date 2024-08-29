import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Metni vurgulamak için yardımcı fonksiyon
export const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase()
      ? <Text key={index} style={styles.highlight}>{part}</Text>
      : <Text key={index}>{part}</Text>
  );
};

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: '#d0e7ff', // Mavi arka plan rengi
    color: '#0000ff', // Mavi metin rengi
  },
});

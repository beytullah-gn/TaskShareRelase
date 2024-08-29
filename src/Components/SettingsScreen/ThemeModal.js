import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, FlatList,Text } from 'react-native';

const ThemeModal = ({ visible, onClose, themes, onThemeChange, selectedTheme, palettes }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <FlatList
          data={themes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.themeOption, { borderColor: palettes[item].fifthColor, backgroundColor: palettes[item].mainColor }]}
              onPress={() => onThemeChange(item)}
            >
              <View style={styles.themeColorsContainer}>
                {Object.values(palettes[item]).map((color, index) => (
                  <View key={index} style={[styles.themeColorBox, { backgroundColor: color }]} />
                ))}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.flatListContent}
          ListFooterComponent={
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: selectedTheme.mainColor }]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          }
        />
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
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  flatListContent: {
    flexGrow: 1,
  },
  themeOption: {
    flex: 1,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#ececec',
    borderWidth: 1,
  },
  themeColorsContainer: {
    flex: 1, // Take full height of themeOption
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  themeColorBox: {
    width: 50,
    height: 50,

    borderRadius: 25,
  },
  closeButton: {
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    width: "100%",
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ThemeModal;

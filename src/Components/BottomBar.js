import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions,Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const BottomBar = ({ onProfile, onDepartments, onPersons, onQrScreen, onSettings, onMessages, onMapScreen, onNfc, activePage }) => {
  const [showMore, setShowMore] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowMore(false);
      };
    }, [activePage])
  );
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  const getIconName = (page, defaultIcon, activeIcon) => {
    return activePage === page ? activeIcon : defaultIcon;
  };

  return (
    <View style={styles.container}>
      
      <View style={[styles.buttonsContainer,{backgroundColor:selectedTheme.mainColor}]}>
        <TouchableOpacity
          style={[styles.button, activePage === 'profile' && { backgroundColor: selectedTheme.secondaryColor }|| {backgroundColor: selectedTheme.mainColor},{borderColor:selectedTheme.mainColor}]}
          onPress={onProfile}
          activeOpacity={1}
        >
          <Icon name={getIconName('profile', 'person-circle-outline', 'person-circle')} size={activePage === "profile" && 35 || 24} color={activePage === 'profile' && selectedTheme.mainColor || selectedTheme.secondaryColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, activePage === 'departments' && { backgroundColor: selectedTheme.secondaryColor }|| {backgroundColor: selectedTheme.mainColor},{borderColor:selectedTheme.mainColor}]}
          onPress={onDepartments}
          activeOpacity={1}
        >
          <Icon name={getIconName('departments', 'layers-outline', 'layers')} size={activePage === "departments" && 35 || 24} color={activePage === 'departments' && selectedTheme.mainColor || selectedTheme.secondaryColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, activePage === 'persons' && { backgroundColor: selectedTheme.secondaryColor }|| {backgroundColor: selectedTheme.mainColor},{borderColor:selectedTheme.mainColor}]}
          onPress={onPersons}
          activeOpacity={1}
        >
          <Icon name={getIconName('persons', 'people-outline', 'people')} size={activePage === "persons" && 35 || 24} color={activePage === 'persons' && selectedTheme.mainColor || selectedTheme.secondaryColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, ['more', 'settings', 'nfc', 'qr', 'map', 'messages'].includes(activePage)
            ? { backgroundColor: selectedTheme.secondaryColor }
            : { backgroundColor: selectedTheme.mainColor },
          { borderColor: selectedTheme.mainColor }
        ]}
          onPress={() => setShowMore(!showMore)}
          activeOpacity={1}
        >
          <Icon name={getIconName('more', 'menu-outline', 'menu')} size={['more', 'settings', 'nfc', 'qr', 'map', 'messages'].includes(activePage) ? 35 : 24} color={['more', 'settings', 'nfc', 'qr', 'map', 'messages'].includes(activePage) ? selectedTheme.mainColor : selectedTheme.secondaryColor} />
        </TouchableOpacity>
      </View>

  

{showMore && (
        <View style={[styles.moreOptionsContainer, { backgroundColor: selectedTheme.mainColor,borderColor:selectedTheme.fourthColor}]}>
          <TouchableOpacity activeOpacity={1} style={[styles.moreButton, activePage === 'settings' && { backgroundColor: selectedTheme.secondaryColor }|| {backgroundColor: selectedTheme.mainColor}]} onPress={onSettings}>
            <Icon name={getIconName('settings', 'settings-outline', 'settings')} size={24} color={activePage === 'settings' && selectedTheme.fifthColor || selectedTheme.fourthColor} />
            <Text style={[styles.moreButtonText,activePage === 'settings' && { color: selectedTheme.fifthColor }|| {color: selectedTheme.fourthColor}]}>Ayarlar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.moreButton, activePage === 'qr' && { backgroundColor: selectedTheme.secondaryColor }|| {backgroundColor: selectedTheme.mainColor}]} onPress={onQrScreen}>
            <Icon name={getIconName('qr', 'scan-outline', 'scan')} size={24}  color={activePage === 'qr' && selectedTheme.fifthColor || selectedTheme.fourthColor} />
            <Text activeOpacity={1} style={[styles.moreButtonText,activePage === 'qr' && { color: selectedTheme.fifthColor }|| {color: selectedTheme.fourthColor}]}>Tara</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[styles.moreButton, activePage === 'messages' && { backgroundColor: selectedTheme.secondaryColor }|| {backgroundColor: selectedTheme.mainColor}]} onPress={onMessages}>
            <Icon name={getIconName('messages', 'mail-outline', 'mail')} size={24}  color={activePage === 'messages' && selectedTheme.fifthColor || selectedTheme.fourthColor} />
            <Text style={[styles.moreButtonText,activePage === 'messages' && { color: selectedTheme.fifthColor }|| {color: selectedTheme.fourthColor}]}>Mesajlar</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[styles.moreButton, activePage === 'map' && { backgroundColor: selectedTheme.secondaryColor }|| {backgroundColor: selectedTheme.mainColor}]} onPress={onMapScreen}>
            <Icon name={getIconName('map', 'map-outline', 'map')} size={24}  color={activePage === 'map' && selectedTheme.fifthColor || selectedTheme.fourthColor} />
            <Text style={[styles.moreButtonText,activePage === 'map' && { color: selectedTheme.fifthColor }|| {color: selectedTheme.fourthColor}]}>Harita</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={[styles.moreButton, activePage === 'nfc' && { backgroundColor: selectedTheme.secondaryColor }|| {backgroundColor: selectedTheme.mainColor}]} onPress={onNfc}>
            <Icon name={getIconName('nfc', 'id-card-outline', 'id-card')} size={24} color={activePage === 'nfc' && selectedTheme.fifthColor || selectedTheme.fourthColor} />
            <Text style={[styles.moreButtonText,activePage === 'nfc' && { color: selectedTheme.fifthColor }|| {color: selectedTheme.fourthColor}]}>Nfc</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingTop: 70,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: height * 0.1 -30,
    backgroundColor: '#fff',
    paddingBottom: 10, // Adds space between buttons and the bottom bar
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70, // Adjust size as needed
    height: 70,
    borderRadius: 35,
    marginTop: -35, // To create the semicircle cutout effect
    backgroundColor: '#fff', // Change to match your theme
    marginBottom: 10, // Adds space between the buttons and the bottom bar
    borderWidth:5,
    
    
  },
  moreOptionsContainer: {
    position: 'absolute',
    bottom: height * 0.11,
    right: 20, // Sağ taraftan biraz daha içeride olsun
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
    width: 200, // Biraz daha geniş yapıldı
    backgroundColor: '#fff', // Beyaz arka plan
    borderWidth: 1,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    width: '100%',
    borderBottomColor: '#ccc', // Butonlar arasında ince bir çizgi
    borderBottomWidth: 1,

    
  },
  moreButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default BottomBar;


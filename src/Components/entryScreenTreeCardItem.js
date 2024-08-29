import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

// Renk skalası: en yetkili (level 0) için açık gri (#f7f7f7), en az yetkili için koyu gri (#2c2c2c)
const getBackgroundColor = (level) => {
  const maxLevel = 6; // Örnek için maksimum seviye 10 olarak belirlenmiştir
  const lightGray = 247; // Açık gri (RGB: 247)
  const darkGray = 44; // Koyu gri (RGB: 44)
  
  const grayValue = lightGray - ((lightGray - darkGray) / maxLevel) * level;
  return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
};

const TreeCardItem = ({ item, expandedItems, onToggleExpand, level = 0, navigation }) => {
  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const screenwidth = Dimensions.get('window').width;
  const cardWidth = screenwidth * 0.9; // Kart genişliği ekran genişliğinin %90'ı olacak şekilde ayarlandı

  const handleDetailPress = () => {
    navigation.navigate('EntryDocument', { pdfUrl: item.PDFUrl });
  };

  return (
    <View style={styles.centeredContainer}>
      <View style={[styles.cardContainer]}>
        <TouchableOpacity
          onPress={() => onToggleExpand(item.id)}
          style={[styles.card, { width: cardWidth, backgroundColor: getBackgroundColor(level) }]}
        >
          <View style={styles.cardHeader}>
            {hasChildren && (
              <Ionicons
                name={isExpanded ? 'chevron-down-outline' : 'chevron-forward-outline'}
                size={20}
                color="#000"
                style={styles.icon}
              />
            )}
            <Text style={styles.cardTitle}>
              {item.DepartmentName}
            </Text>
            <TouchableOpacity style={styles.detailsButton} onPress={handleDetailPress}>
              <FontAwesome6
                name="file-pdf"
                size={30}
                color="#d62e22"
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {isExpanded && hasChildren && (
          <ScrollView horizontal={true}>
            <View style={styles.childContainer}>
              {item.children.map(child => (
                <TreeCardItem
                  key={child.id}
                  item={child}
                  expandedItems={expandedItems}
                  onToggleExpand={onToggleExpand}
                  level={level + 1}
                  navigation={navigation}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: 'center', // Yatayda ortalanmış
    justifyContent: 'center', // Gerektiğinde dikeyde ortalanmış
  },
  cardContainer: {
    marginVertical: 5,
    alignItems: 'center', // Çocukları yatayda ortala
  },
  card: {
    borderRadius: 10,
    elevation: 2,
    padding: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Butonu sağa hizala
    width: '100%',
  },
  cardTitle: {
    flex: 0.7, // Genişliğin %70'i
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    flex: 0.1, // Genişliğin %10'u
    marginRight: 10,
  },
  detailsButton: {
    flex: 0.15, // Genişliğin %15'i
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childContainer: {
    marginTop: 10,
  },
});

export default TreeCardItem;

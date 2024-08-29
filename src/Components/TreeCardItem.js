import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const TreeCardItem = ({ item, expandedItems, onToggleExpand, level = 0, navigation }) => {
  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const screenwidth = Dimensions.get('window').width;
  const cardWidth = screenwidth * 0.9; // Width of the card set to 90% of screen width

  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  const handleDetailPress = () => {
    navigation.navigate('SelectedDepartment', { id: item.id });
  };

  // Function to get background color based on level
  const getBackgroundColor = (level) => {
    const color = selectedTheme.fifthColor; // Assuming it's in hex format
    const hexToRgb = (hex) => {
      let r = 0, g = 0, b = 0;
      // 3 digits
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      }
      // 6 digits
      else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
      }
      return [r, g, b];
    };

    const [r, g, b] = hexToRgb(color);
    const lightenAmount = Math.min(30 * level, 150); // Lighten up to a maximum of 150 units
    const newR = Math.min(r + lightenAmount, 255);
    const newG = Math.min(g + lightenAmount, 255);
    const newB = Math.min(b + lightenAmount, 255);

    return `rgb(${newR}, ${newG}, ${newB})`; // Convert to RGB
  };

  // Function to get text color based on level
  const getTextColor = (level) => {
    return level > 3 ? selectedTheme.fifthColor : selectedTheme.whiteColor;
  };

  // Function to get info button background color based on level
  const getInfoButtonColor = (level) => {
    return level >  3? selectedTheme.fifthColor : selectedTheme.secondaryColor;
  };

  const getExpandedButtonColor = (level) => {
    return level >  3? selectedTheme.fifthColor : selectedTheme.secondaryColor;
  };

  return (
    <View style={[styles.cardContainer]}>
      <TouchableOpacity
        onPress={() => onToggleExpand(item.id)}
        style={[styles.card, { width: cardWidth, backgroundColor: getBackgroundColor(level), marginHorizontal: 20, paddingLeft: 15 }]}
      >
        <View style={styles.cardHeader}>
          {hasChildren && (
            <Ionicons
              name={isExpanded ? 'chevron-down-outline' : 'chevron-forward-outline'}
              size={20}
              color={getExpandedButtonColor(level)}
              style={styles.icon}
            />
          )}
          <Text style={[styles.cardTitle, { color: getTextColor(level) }]}>
            {item.DepartmentName}
          </Text>
          <TouchableOpacity style={[styles.detailsButton, { backgroundColor: getInfoButtonColor(level) }]} onPress={handleDetailPress}>
            <Ionicons
              name="information-circle-outline"
              size={30}
              color={selectedTheme.whiteColor}
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
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 5,
  },
  card: {
    borderRadius: 10,
    elevation: 2,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align button to the right
    width: '100%',
  },
  cardTitle: {
    flex: 0.75, // 70% width
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  icon: {
    flex: 0.1, // 10% width
  },
  detailsButton: {
    flex: 0.15, // 15% width
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childContainer: {
    marginTop: 10,
  },
});

export default TreeCardItem;

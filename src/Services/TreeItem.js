import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,FlatList } from 'react-native';
import { highlightText } from './TextUtils'; 

const TreeItem = ({ item, level = 0, expandedItems, onToggleExpand, searchTerm }) => {
  const [expanded, setExpanded] = useState(expandedItems.includes(item.id));
  const hasChildren = item.children && item.children.length > 0;

  const handlePress = () => {
    setExpanded(!expanded);
    onToggleExpand(item.id);
  };

  return (
    <View style={{ paddingLeft: level * 20 }}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={[styles.itemText, { fontWeight: 'bold' }]}>
          {hasChildren ? (expanded ? '[-]' : '[+]') : ' '} {highlightText(item.DepartmentName, searchTerm)}
        </Text>
        <Text style={styles.itemDescription}>
          {highlightText(item.DepartmentDescription, searchTerm)}
        </Text>
      </TouchableOpacity>
      {expanded && item.children && (
        <FlatList
          data={item.children}
          renderItem={({ item }) => <TreeItem item={item} level={level + 1} expandedItems={expandedItems} onToggleExpand={onToggleExpand} searchTerm={searchTerm} />}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemText: {
    fontSize: 16,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default TreeItem;

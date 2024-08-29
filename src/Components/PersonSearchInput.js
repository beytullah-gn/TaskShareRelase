import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const PersonSearchInput = ({ searchTerm, onSearch }) => {
    const selectedTheme = useSelector((state) => state.theme.selectedTheme);

    return (
        <View style={[styles.header, { backgroundColor: selectedTheme.mainColor }]}>
            <TextInput
                style={[styles.searchInput, { backgroundColor: selectedTheme.whiteColor }]}
                placeholder="Ara..."
                placeholderTextColor={selectedTheme.mainColor}
                value={searchTerm}
                onChangeText={onSearch}
            />
            
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    searchButton: {
        borderRadius: 20,
        padding: 10,
    },
});

export default PersonSearchInput;

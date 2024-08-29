import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from 'react-redux';

const PersonToggleButton = ({ selectedType, onSelectType }) => {
    const selectedTheme = useSelector((state) => state.theme.selectedTheme);

    return (
        <View style={styles.toggleContainer}>
            <TouchableOpacity
                style={[
                    styles.toggleButton,
                    { backgroundColor: selectedTheme.secondaryColor },
                    selectedType === "Employee" && { backgroundColor: selectedTheme.fifthColor }
                ]}
                onPress={() => onSelectType("Employee")}
            >
                <Text style={[styles.toggleButtonText, { color: selectedTheme.whiteColor }]}>Çalışanlar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.toggleButton,
                    { backgroundColor: selectedTheme.secondaryColor },
                    selectedType === "Client" && { backgroundColor: selectedTheme.fifthColor }
                ]}
                onPress={() => onSelectType("Client")}
            >
                <Text style={[styles.toggleButtonText, { color: selectedTheme.whiteColor }]}>Müşteriler</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    toggleButton: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderRadius: 20,
        marginHorizontal: 5,
    },
    toggleButtonText: {
        fontWeight: 'bold',
    },
});

export default PersonToggleButton;

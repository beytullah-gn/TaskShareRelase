import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";


const PersonAddButton = ({onAdd}) => {
    const selectedTheme = useSelector((state) => state.theme.selectedTheme);
    return (
        <TouchableOpacity style={[styles.addButton,{backgroundColor:selectedTheme.fifthColor}]} onPress={onAdd}>
            <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        position: 'absolute',
        bottom: 90,
        right: 20,
    },
});

export default PersonAddButton;

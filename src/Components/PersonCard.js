import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import Constants from 'expo-constants';

const PersonCard = ({ person, searchTerm, highlightText, onPerson }) => {
    const selectedTheme = useSelector((state) => state.theme.selectedTheme);
    const uri = Constants.expoConfig.extra.uri;

    return (
        <TouchableOpacity 
            style={[styles.personCard, { backgroundColor: selectedTheme.thirdColor }]} 
            onPress={() => onPerson(person)}
        >
            <View style={[styles.profilePictureContainer, { borderColor: selectedTheme.secondaryColor }]}>
                {person && person.ProfilePictureUrl ? (
                    <Image 
                        source={{ uri: person.ProfilePictureUrl }} 
                        style={styles.profilePicture} 
                    />
                ) : (
                    <Image 
                        source={{ uri: uri }} 
                        style={styles.profilePicture} 
                    />
                )}
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.personName, { color: selectedTheme.fifthColor,fontWeight:'bold' }]}>
                    {highlightText(person.Name, searchTerm)} {highlightText(person.Surname, searchTerm)}
                </Text>
            </View>
            <Ionicons
                name={'arrow-forward'}
                size={40}
                color={selectedTheme.fifthColor}
                style={styles.icon}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    personCard: {
        padding: 3,
        borderRadius: 10,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        marginBottom: 10,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profilePictureContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginRight: 15,
        borderWidth: 1,
    },
    profilePicture: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        flex: 1,
    },
    personName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon: {
        marginLeft: 10,
    },
});

export default PersonCard;

import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, Text, View, SafeAreaView } from "react-native";
import BottomBar from "../Components/BottomBar";
import { useSelector } from 'react-redux';
import fetchAllPersons from "../Services/fetchAllPersons";
import { fetchDepartmentEmployeeData } from "../Services/fetchDepartmentEmployees";
import PersonToggleButton from "../Components/PersonToggleButton";
import PersonCard from "../Components/PersonCard";
import PersonSearchInput from "../Components/PersonSearchInput";
import PersonAddButton from "../Components/PersonAddButton";
import { useFocusEffect } from '@react-navigation/native';

const PersonsScreen = ({ navigation }) => {
    const [persons, setPersons] = useState([]);
    const [showAddButton, setShowAddButton] = useState(false);
    const [selectedType, setSelectedType] = useState("Employee");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedPerson, setExpandedPerson] = useState(null);

    const selectedTheme = useSelector((state) => state.theme.selectedTheme);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const personsData = await fetchAllPersons();
                    if (personsData) {
                        personsData.sort((a, b) => a.Name.localeCompare(b.Name));
                    }
                    setPersons(personsData);
                } catch (error) {
                    console.log("Error fetching persons: ", error);
                }
            };

            const checkPermissions = async () => {
                try {
                    const department = await fetchDepartmentEmployeeData();
                    if (department && department.Permissions && department.Permissions.ManagePersons) {
                        setShowAddButton(true);
                    } else {
                        setShowAddButton(false);
                    }
                } catch (error) {
                    console.log("Error fetching department: ", error);
                    setShowAddButton(false);
                }
            };

            fetchData();
            checkPermissions();
        }, [])
    );

    const handleSearch = (text) => {
        setSearchTerm(text);
    };

    const filteredPersons = persons
        .filter(person => person.AccountType === selectedType)
        .filter(person =>
            person.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.Surname.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const highlightText = (text, highlight) => {
        if (!highlight) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <Text key={index} style={[styles.highlight, { backgroundColor: selectedTheme.fourthColor }]}>{part}</Text>
            ) : (
                part
            )
        );
    };

    const handleDepartments = () => navigation.navigate('Departments');
    const handleProfile = () => navigation.navigate('MyProfile');
    const handleSettings = () => navigation.navigate('Settings');
    const handleAddPerson = () => navigation.navigate("AddPerson");
    const handlePerson = (person) => navigation.navigate("SelectedPerson", { person });
    const handleQrScreen = () => navigation.navigate("QrScreen");
    const handleOnMessages = () => navigation.navigate('Messages');
    const handleOnMapScreen = () => navigation.navigate('MapScreen');
    const handleOnNfc = () => navigation.navigate("NfcScreen");

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: selectedTheme.fourthColor }]}>
            <View style={[styles.header, { backgroundColor: selectedTheme.mainColor }]}/>
            <PersonSearchInput searchTerm={searchTerm} onSearch={handleSearch} />
            <PersonToggleButton selectedType={selectedType} onSelectType={setSelectedType} />
            <View style={styles.content}>
                <ScrollView>
                    {filteredPersons.length > 0 ? (
                        filteredPersons.map(person => (
                            <PersonCard
                                key={person.id}
                                person={person}
                                expandedPerson={expandedPerson}
                                showEditButton={showAddButton}
                                searchTerm={searchTerm}
                                highlightText={highlightText}
                                onPerson={handlePerson}
                            />
                        ))
                    ) : (
                        <View style={styles.noResultsContainer}>
                            <Text style={[styles.errorText, { color: selectedTheme.fifthColor }]}>Kişi bulunamadı</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
            {showAddButton && <PersonAddButton onAdd={handleAddPerson} />}
            <BottomBar
                onProfile={handleProfile}
                onDepartments={handleDepartments}
                onSettings={handleSettings}
                onQrScreen={handleQrScreen}
                onMessages={handleOnMessages}
                onMapScreen={handleOnMapScreen}
                onNfc={handleOnNfc}
                activePage="persons"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 20,
    },
    content: {
        flex: 1,
        padding: 10,
        paddingBottom: 80,
    },
    highlight: {
        backgroundColor: 'yellow',
    },
    noResultsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    errorText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
});

export default PersonsScreen;

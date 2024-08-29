import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Modal, ActivityIndicator, Alert, TouchableOpacity, Image, Dimensions } from "react-native";
import { useSelector } from 'react-redux';
import BottomBar from "../Components/BottomBar";
import { fetchPersonData } from "../Services/fetchPersonData";
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import updateNfcData from "../Services/updateNfcData";
import fetchAllPersons from "../Services/fetchAllPersons";
import fetchPersonById from "../Services/fetchPersonById";

const NfcScreen = ({ navigation }) => {
    const [person, setPerson] = useState(null);
    const [scannedNfc, setScannedNfc] = useState(null);
    const [hasNfc, setHasNfc] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [toggleOption, setToggleOption] = useState('add');

    const selectedTheme = useSelector((state) => state.theme.selectedTheme);

    useEffect(() => {
        NfcManager.start();

        const fetchData = async () => {
            const person = await fetchPersonData();
            if (person) {
                setPerson(person);
                if (person.NfcId) {
                    setHasNfc(true);
                }
            }
        };

        fetchData();
    }, []);

    const handleNfcScan = async () => {
        try {
            setIsScanning(true);
            setUpdateMessage('');
            setMessageType('');
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();
            console.log('Scanned NFC Tag:', tag);
            setScannedNfc(tag);

            if (tag.id) {
                if (toggleOption === 'add') {
                    if (person && person.PersonId) {
                        if (person.NfcId === tag.id) {
                            setUpdateMessage('Mevcut NFC ile taranan NFC aynı işlem yapılmadı.');
                            setMessageType('error');
                        } else {
                            await updateNfcData(tag.id, person.PersonId);
                            setUpdateMessage('NFC verisi başarıyla güncellendi!');
                            setMessageType('success');

                            const updatedPerson = await fetchPersonData();
                            if (updatedPerson) {
                                setPerson(updatedPerson);
                            }
                        }
                    }
                } else if (toggleOption === 'navigate') {
                    const persons = await fetchAllPersons();
                    const matchedPerson = persons.find(p => p.NfcId === tag.id);

                    if (matchedPerson && matchedPerson.PersonId) {
                        const person = await fetchPersonById(matchedPerson.PersonId);

                        if (person) {
                            navigation.navigate('SelectedPerson', { person });
                        } else {
                            Alert.alert(
                                'Kişi Bulunamadı',
                                'Bu NFC ID ile ilişkilendirilmiş kişi bulunamadı.',
                                [{ text: 'Tamam' }]
                            );
                        }
                    } else {
                        Alert.alert(
                            'Kişi Bulunamadı',
                            'Bu NFC ID ile ilişkilendirilmiş kişi bulunamadı.',
                            [{ text: 'Tamam' }]
                        );
                    }
                }
            }
        } catch (ex) {
            console.warn('NFC scanning failed', ex);
            setUpdateMessage('NFC güncellenirken hata oluştu.');
            setMessageType('error');
        } finally {
            setIsScanning(false);
            NfcManager.cancelTechnologyRequest();
        }
    };

    const handleCancelScan = () => {
        setIsScanning(false);
        NfcManager.cancelTechnologyRequest();
    };

    const handleDepartments = () => {
        navigation.navigate('Departments');
    };

    const handlePersons = () => {
        navigation.navigate('Persons');
    };

    const handleQrScreen = () => {
        navigation.navigate('QrScreen');
    };

    const handleSettings = () => {
        navigation.navigate('Settings');
    };

    const handleOnMessages = () => {
        navigation.navigate('Messages');
    };

    const handleProfile = () => {
        navigation.navigate('MyProfile');
    };

    const handleOnMap = () => {
        navigation.navigate("MapScreen");
    };

    const buttonText = toggleOption === 'add' ? (hasNfc ? "Mevcut NFC'yi Değiştir" : "Yeni NFC Ekle") : "NFC ile Kişiye Git";

    const screenWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: selectedTheme.fourthColor }]}>
            <View style={[styles.tabContainer, { backgroundColor: selectedTheme.mainColor }]}>
                <TouchableOpacity
                    style={[styles.tabButton, toggleOption === 'add' && styles.activeTab]}
                    onPress={() => setToggleOption('add')}
                >
                    <Text style={[styles.tabButtonText, toggleOption === 'add' && styles.activeTabText ,{color:selectedTheme.whiteColor}]}>NFC Ekle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, toggleOption === 'navigate' && styles.activeTab]}
                    onPress={() => setToggleOption('navigate')}
                >
                    <Text style={[styles.tabButtonText, toggleOption === 'navigate' && styles.activeTabText,{color:selectedTheme.whiteColor}]}>NFC ile Kişiye Git</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <Image
                    source={require('../../assets/nfc.png')}
                    style={[styles.nfcImage, { width: screenWidth * 0.9, height: screenWidth * 0.9, opacity: 0.6 }]}
                />
                <TouchableOpacity style={[styles.button, { backgroundColor: selectedTheme.mainColor }]} onPress={handleNfcScan}>
                    <Text style={[styles.buttonText, { color: selectedTheme.whiteColor }]}>
                        {buttonText}
                    </Text>
                </TouchableOpacity>
                {updateMessage ? (
                    <Text style={[styles.updateMessage, messageType === 'success' ? styles.successMessage : styles.errorMessage]}>
                        {updateMessage}
                    </Text>
                ) : null}
            </View>

            <Modal
                transparent={true}
                animationType="fade"
                visible={isScanning}
                onRequestClose={handleCancelScan}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color={selectedTheme.mainColor} />
                        <Text style={[styles.modalText, { color: selectedTheme.mainColor }]}>NFC Okunuyor...</Text>
                        <TouchableOpacity style={[styles.cancelButton, { backgroundColor: selectedTheme.secondaryColor }]} onPress={handleCancelScan}>
                            <Text style={[styles.cancelButtonText, { color: selectedTheme.whiteColor }]}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <BottomBar
                onProfile={handleProfile}
                onDepartments={handleDepartments}
                onSettings={handleSettings}
                onQrScreen={handleQrScreen}
                onMessages={handleOnMessages}
                onPersons={handlePersons}
                onMapScreen={handleOnMap}
                activePage="nfc"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-around',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    tabButtonText: {
        fontSize: 16,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#fff',
    },
    activeTabText: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateMessage: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    successMessage: {
        color: '#065535',
    },
    errorMessage: {
        color: '#d11141',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 200,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        fontWeight: 'bold',
    },
    nfcImage: {
        marginBottom: 20,
    },
    button: {
        padding: 10,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonText: {
        fontWeight: 'bold',
    }
});

export default NfcScreen;


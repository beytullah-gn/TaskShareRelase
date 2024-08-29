import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import fetchDepartmentSubjects from '../Services/fetchDepartmentSubjects';
import { Picker } from '@react-native-picker/picker';
import createRequest from '../Services/createRequest';
import fetchDepartments from '../Services/fetchActiveDepartments';
import { useSelector } from 'react-redux';

const NewMessage = () => {
    const selectedTheme = useSelector((state) => state.theme.selectedTheme);

    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchDepartments().then(data => setDepartments(data));
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchDepartmentSubjects(selectedDepartment).then(data => {
                setSubjects(data);
                setFilteredSubjects(data.filter(subject => subject.DepartmentId === selectedDepartment));
            });
        } else {
            setSubjects([]);
            setFilteredSubjects([]);
        }
    }, [selectedDepartment]);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Hata', 'Başlık alanını doldurmalısınız.');
            return;
        }
        if (!message.trim()) {
            Alert.alert('Hata', 'Mesaj alanını doldurmalısınız.');
            return;
        }
        if (!selectedDepartment) {
            Alert.alert('Hata', 'Departman seçmelisiniz.');
            return;
        }
        if (!selectedSubject) {
            Alert.alert('Hata', 'Konu seçmelisiniz.');
            return;
        }

        try {
            await createRequest(title, selectedDepartment, selectedSubject, message);
            Alert.alert('Başarı', 'Talep başarıyla oluşturuldu.');
            setTitle('');
            setMessage('');
            setSelectedDepartment('');
            setSelectedSubject('');
        } catch (error) {
            Alert.alert('Hata', 'Talep oluşturulurken bir hata oluştu.');
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: selectedTheme.secondaryColor }]}>
            <View style={[styles.card, { backgroundColor: selectedTheme.thirdColor, borderColor: selectedTheme.mainColor }]}>
                <Text style={[styles.header, { color: selectedTheme.mainColor }]}>Yeni Talep Oluştur</Text>

                <TextInput
                    style={[styles.input, { backgroundColor: selectedTheme.whiteColor, color: selectedTheme.fifthColor }]}
                    placeholder="Başlık"
                    placeholderTextColor={selectedTheme.fifthColor}
                    value={title}
                    onChangeText={setTitle}
                />

                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: selectedTheme.whiteColor, color: selectedTheme.fifthColor }]}
                    placeholder="Mesaj"
                    placeholderTextColor={selectedTheme.fifthColor}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />

                <View style={styles.pickerContainer}>
                    <Text style={[styles.pickerLabel, { color: selectedTheme.fifthColor }]}>Departman:</Text>
                    <Picker
                        selectedValue={selectedDepartment}
                        onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
                        style={[styles.picker, { backgroundColor: selectedTheme.whiteColor, color: selectedTheme.fifthColor }]}
                    >
                        <Picker.Item label="Seçiniz" value="" />
                        {departments.map(dept => (
                            <Picker.Item key={dept.id} label={dept.DepartmentName} value={dept.id} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Text style={[styles.pickerLabel, { color: selectedTheme.fifthColor }]}>Konu:</Text>
                    <Picker
                        selectedValue={selectedSubject}
                        onValueChange={(itemValue) => setSelectedSubject(itemValue)}
                        enabled={!!selectedDepartment}
                        style={[styles.picker, { backgroundColor: selectedTheme.whiteColor, color: selectedTheme.fifthColor }]}
                    >
                        <Picker.Item label="Seçiniz" value="" />
                        {filteredSubjects.map(subj => (
                            <Picker.Item key={subj.id} label={subj.Title} value={subj.id} />
                        ))}
                    </Picker>
                </View>
            </View>

            <TouchableOpacity style={[styles.submitButton, { backgroundColor: selectedTheme.fifthColor }]} onPress={handleSubmit}>
                <Text style={[styles.submitButtonText, { color: selectedTheme.whiteColor }]}>Gönder</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
    },
    card: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginVertical: 10,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingVertical: 10,
    },
    pickerContainer: {
        marginBottom: 15,
    },
    pickerLabel: {
        fontSize: 18,
        marginBottom: 8,
    },
    picker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    submitButton: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default NewMessage;

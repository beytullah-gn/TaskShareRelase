import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons'; 
import fetchMessagesByRequestId from "../Services/fetchMessagesByRequestId";
import { fetchPersonData } from "../Services/fetchPersonData";
import sendMessage from "../Services/sendMessage";
import { fetchEligiblePersons } from '../Services/fetchEligiblePersons';
import updateRequestResponsiblePerson from "../Services/updateRequestResponsiblePerson";
import moment from 'moment-timezone';
import markAsCompleted from "../Services/markAsCompleted";
import { translateMessage } from "../Services/translateMessage"; // Adjust path as necessary
import { useSelector } from "react-redux";

const SelectedRequest = ({ route, navigation }) => {
  const { request } = route.params || {};
  const requestId = request?.id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentPersonId, setCurrentPersonId] = useState(null);
  const [showActions, setShowActions] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [eligiblePersons, setEligiblePersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [requestCompleted, setRequestCompleted] = useState(request?.Completed || false);
  const [translatedMessages, setTranslatedMessages] = useState({});
  const [isSending, setIsSending] = useState(false); // Loading state
  const language = useSelector((state) => state.language);
  const selectedTheme = useSelector((state) => state.theme.selectedTheme);

  useEffect(() => {
    fetchPersonData().then(data => setCurrentPersonId(data.PersonId));

    if (requestId) {
      const unsubscribe = fetchMessagesByRequestId(requestId, setMessages);
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [requestId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setIsSending(true); // Set loading state to true
      sendMessage(newMessage, requestId, request)
        .then(() => {
          setNewMessage('');
          setIsSending(false); // Set loading state to false
        })
        .catch(error => {
          console.error("Error sending message: ", error);
          setIsSending(false); // Set loading state to false in case of error
        });
    }
  };

  const handleTranslateMessage = async (messageId, messageText) => {
    setTranslatedMessages(prevState => {
      const isTranslated = prevState[messageId] !== undefined;
      return {
        ...prevState,
        [messageId]: isTranslated ? '' : messageText // Orijinal metni döndür veya çeviri yap
      };
    });
    
    if (!translatedMessages[messageId]) {
      const translatedText = await translateMessage(messageText, language);
      if (translatedText) {
        setTranslatedMessages(prevState => ({
          ...prevState,
          [messageId]: translatedText
        }));
      }
    }
  };

  const handleCompleted = () => {
    Alert.alert(
      "Onay",
      `Görevi ${requestCompleted ? "tamamlanmadı" : "tamamlandı"} olarak işaretlemek istiyor musunuz?`,
      [
        {
          text: "Vazgeç",
          style: "cancel"
        },
        {
          text: "Tamam",
          onPress: () => {
            markAsCompleted(requestId).then(() => {
              setRequestCompleted(prevState => !prevState); // Toggle the state
            });
          }
        }
      ]
    );
  };

  const toggleActions = () => {
    setShowActions(prevState => !prevState);
  };

  const handleAssignToAnotherPerson = () => {
    if (request.DepartmentId && currentPersonId) {
      fetchEligiblePersons(request.DepartmentId, currentPersonId)
        .then(persons => {
          setEligiblePersons(persons);
          setShowModal(true);
        })
        .catch(error => {
          console.error("Error fetching eligible persons: ", error);
        });
    }
  };

  const handleSaveButtonPress = () => {
    if (selectedPerson && requestId) {
      updateRequestResponsiblePerson(requestId, selectedPerson.PersonId)
        .then(() => {
          console.log("Responsible person updated:", selectedPerson);
          setShowModal(false);
          navigation.navigate("Messages");
        })
        .catch(error => {
          console.error("Error updating responsible person: ", error);
        });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formatSendTime = (timestamp) => {
    return moment(timestamp).tz('Europe/Istanbul').format('HH:mm:ss YYYY-MM-DD');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: selectedTheme.thirdColor }]}>
      <View style={[styles.header, { backgroundColor: selectedTheme.mainColor }]}>
        {currentPersonId === request.ResponsiblePersonId && (
          <>
            {showActions && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: selectedTheme.secondaryColor }]} onPress={handleCompleted}>
                  <Text style={[styles.actionButtonText, { color: selectedTheme.whiteColor }]}>{requestCompleted ? "Tamamlanmadı" : "Tamamlandı"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: selectedTheme.secondaryColor }]} onPress={handleAssignToAnotherPerson}>
                  <Text style={[styles.actionButtonText, { color: selectedTheme.whiteColor }]}>Ata</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={toggleActions}>
              <Ionicons name="settings-outline" size={24} color={selectedTheme.whiteColor} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={[styles.content, { backgroundColor: selectedTheme.thirdColor }]}>
        {requestId ? (
          messages.length > 0 ? (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={[styles.messageCard, { backgroundColor: selectedTheme.whiteColor }]}>
                  <Text style={[styles.senderText, { color: selectedTheme.mainColor }]}>{item.senderName}</Text>
                  <Text style={styles.messageText}>
                    {translatedMessages[item.id] || item.Message}
                  </Text>
                  <Text style={[styles.sendTimeText, { color: selectedTheme.fifthColor }]}>{formatSendTime(item.SendTime)}</Text>
                  <TouchableOpacity
                    style={styles.translateButton}
                    onPress={() => handleTranslateMessage(item.id, item.Message)}
                  >
                    <Text style={[styles.translateButtonText, { color: selectedTheme.mainColor }]}>
                      {translatedMessages[item.id] ? 'Orijinal' : 'Çevir'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={[styles.text, { color: selectedTheme.mainColor }]}>Bu istek için mesaj bulunamadı</Text>
          )
        ) : (
          <Text style={[styles.text, { color: selectedTheme.mainColor }]}>Seçili istek bulunamadı</Text>
        )}
      </View>

      <View style={[styles.footer, { backgroundColor: selectedTheme.whiteColor }]}>
        <TextInput
          style={[styles.input, { backgroundColor: selectedTheme.fourthColor, height: 60 }]} 
          placeholder="Mesajınızı yazın"
          placeholderTextColor={selectedTheme.fifthColor}
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity 
          style={[styles.sendButton, isSending && styles.disabledButton, { backgroundColor: selectedTheme.mainColor }]} 
          onPress={handleSendMessage}
          disabled={isSending} // Disable button if sending
        >
          <Text style={[styles.sendButtonText, { color: selectedTheme.whiteColor }]}>{isSending ? 'Gönderiliyor...' : 'Gönder'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: selectedTheme.whiteColor }]}>
            <Text style={[styles.modalTitle, { color: selectedTheme.mainColor }]}>Bir Kişi Seçin</Text>
            <FlatList
              data={eligiblePersons}
              keyExtractor={(item) => item.PersonId.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    { backgroundColor: selectedTheme.fourthColor },
                    selectedPerson?.PersonId === item.PersonId && styles.selectedItem
                  ]}
                  onPress={() => setSelectedPerson(item)}
                >
                  <Text style={[styles.modalItemText, { color: selectedTheme.mainColor }]}>{item.Name} {item.Surname}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: '#ff5a5f' }]} // Red color for cancel button
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: selectedTheme.mainColor }]}
                onPress={handleSaveButtonPress}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems:'center',
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  actionButtons: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal:20
  },
  actionButton: {
    flex:1,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginHorizontal: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  messageCard: {
    borderRadius: 10,
    padding: 20,
    marginVertical: 5,
    elevation: 5,
  },
  senderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    marginTop: 5,
  },
  sendTimeText: {
    fontSize: 14,
    marginTop: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    elevation: 3,
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#b0b0b0', // Gray color for disabled button
  },
  sendButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  selectedItem: {
    backgroundColor: '#dfe3ee',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default SelectedRequest;

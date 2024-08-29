import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';

const InfoModal = ({ visible, onClose, selectedTheme }) => {
  const handleLinkPress = () => {
    Linking.openURL('https://beytullah-gn.github.io/');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { borderColor: selectedTheme.mainColor }]}>
          <Text style={[styles.modalTitle, { color: selectedTheme.mainColor }]}>Hakkında</Text>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={[styles.modalText, { color: selectedTheme.fifthColor }]}>
              - Şifre sıfırlama işlemleri, gereksiz e-postaların düşmemesi için dikkatli bir şekilde yapılmalıdır.
              {'\n\n'}
              - Profilim ekranında, eğer bir fotoğrafınız varsa bu fotoğraf gösterilecektir; aksi takdirde varsayılan bir fotoğraf görüntülenecektir.
              {'\n\n'}
              - Kişisel bilgilerinizi, fotoğrafınızı, hesap türünüzü ve departman bilgilerinizi yalnızca yetkili kişiler düzenleyebilir.
              {'\n\n'}
              - Adres bilgisi girildiğinde, belirtilen adres gösterilecektir; adres girilmediğinde ise sabit bir yer gösterilecektir.
              {'\n\n'}
              - Mevcut departman, aktif olarak çalıştığınız departmanın bilgilerini ve iş başlama-bitirme tarihinizi içerir.
              {'\n\n'}
              - Eski departmanlar, önceki işleriniz ve başlangıç-bitiş tarihleri hakkında bilgi verir.
              {'\n\n'}
              - Departmanlar ekranındaki departmanlar, renk değişikliği ile hiyerarşi belirginleştirilmiştir.
              {'\n\n'}
              - Departmanın yanındaki bilgi butonuna tıklayarak detayları görüntüleyebilirsiniz.
              {'\n\n'}
              - Departman ekleme ve düzenleme işlemlerini yalnızca yetkili kişiler gerçekleştirebilir.
              {'\n\n'}
              - Kişiler sayfasında arama yapabilir ve yetkiniz varsa yeni kullanıcılar ekleyebilirsiniz.
              {'\n\n'}
              - Hesap oluşturulduktan sonra, hesabı oluşturan kişi sistemden çıkartılacaktır.
              {'\n\n'}
              - Yetkili kişiler, kişi bilgilerini düzenleyebilir.
              {'\n\n'}
              - NFC kart ekleyerek kendi hesabınıza bir NFC tanımlayabilirsiniz.
              {'\n\n'}
              - Başkasının adına tanımlanmış bir NFC ile "kişiye git" yaptığınızda, ilgili kişinin detaylı sayfasına yönlendirilirsiniz.
              {'\n\n'}
              - Kişinin detaylı sayfasında, kişiye SMS gönderebilirsiniz.
              {'\n\n'}
              - Yetkili kişiler işe alma ve işten çıkarma işlemlerini gerçekleştirebilir.
              {'\n\n'}
              - Harita ekranında, tüm kullanıcıların adres bilgileri yer almaktadır.
              {'\n\n'}
              - Mesajlar ekranında yeni talepler oluşturabilirsiniz.
              {'\n\n'}
              - Yetkiniz varsa, departmanınıza gönderilen taleplere yanıt verebilirsiniz.
              {'\n\n'}
              - Taleplere yanıt vermek, sizi o talebin yetkilisi yapar.
              {'\n\n'}
              - Talepleri görüntüledikten sonra, sağ üst köşedeki ayarlar kısmından talebi kendi departmanınızdaki başka bir yetkiliye atayabilir veya tamamlandı olarak işaretleyebilirsiniz.
              {'\n\n'}
              - Talepler, güncellenme tarihine göre sıralanır.
              {'\n\n'}
              - Tara kısmında, kişinin QR kodunu taratarak kişisel sayfasına ulaşabilirsiniz.
              {'\n\n'}
              - Ayarlar sayfasında tema değişikliği yapabilirsiniz.
              {'\n\n'}
              - Çıkış yap seçeneği ile giriş ekranına yönlendirileceksiniz.
              {'\n\n'}
              - Sağ üst köşedeki konum işareti, IP adresinize göre yaklaşık konumunuzu belirleyecektir.  
            </Text>
          </ScrollView>
          <TouchableOpacity style={[styles.closeButton, { borderColor: selectedTheme.secondaryColor,backgroundColor:selectedTheme.mainColor }]} onPress={handleLinkPress}>
            <Text style={[styles.closeButtonText, { color: selectedTheme.whiteColor,fontSize:12}]}>Daha fazla bilgi için [bu bağlantıya](https://beytullah-gn.github.io/) göz atabilirsiniz.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.closeButton, { borderColor: selectedTheme.mainColor }]} onPress={onClose}>
            <Text style={[styles.closeButtonText, { color: selectedTheme.mainColor }]}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20, // Extra padding to ensure content is fully visible
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left', // Start text from the left
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 2,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InfoModal;

// src/screens/TaskCompleteCoinModal.jsx

import React from 'react';
import { View, Text, StyleSheet, Modal, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const TaskCompleteCoinModal = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Image source={require('../../../assets/coin.png')} style={styles.obooniImage} />
          <Text style={styles.messageText}>
            {t('task.complete_coin')}
          </Text>
          <Button title={t('task.ok')} onPress={onClose} style={styles.confirmButton} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 불투명 배경
  },
  modalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  obooniImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  messageText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  confirmButton: {
    width: '70%',
  },
});

export default TaskCompleteCoinModal;

// src/screens/PhotoUploadModal.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // 이미지 피커 라이브러리
import * as MediaLibrary from 'expo-media-library'; // 미디어 라이브러리 접근

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

// expo-image-picker, expo-media-library 설치 필요: expo install expo-image-picker expo-media-library

const PhotoUploadModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [memo, setMemo] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // 카메라 권한 요청 및 사진 촬영
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('album.need_permission_title'), t('album.need_camera'));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 갤러리 권한 요청 및 사진 선택
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('album.need_permission_title'), t('album.need_gallery'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSavePhoto = () => {
    if (!imageUri) {
      Alert.alert(t('reminder.location_required_title'), t('album.need_image'));
      return;
    }
    Alert.alert(t('album.saved_title'), t('album.saved_message', { memo }));
    // 실제로는 사진 업로드 및 메모 저장 (백엔드 연동)
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('album.upload_title')}</Text>

          <View style={styles.photoPreviewContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.placeholderText}>{t('album.preview')}</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.photoActionButton} onPress={takePhoto}>
              <FontAwesome5 name="camera" size={24} color={Colors.secondaryBrown} />
              <Text style={styles.photoActionButtonText}>{t('album.camera')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoActionButton} onPress={pickImage}>
              <FontAwesome5 name="images" size={24} color={Colors.secondaryBrown} />
              <Text style={styles.photoActionButtonText}>{t('album.gallery')}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.memoInput}
            placeholder={t('album.memo_placeholder')}
            placeholderTextColor={Colors.secondaryBrown}
            value={memo}
            onChangeText={setMemo}
            multiline={true}
            numberOfLines={2}
            textAlignVertical="top"
          />

          <View style={styles.actionButtonContainer}>
            <Button title={t('album.cancel')} onPress={onClose} primary={false} style={styles.actionButton} />
            <Button title={t('album.save')} onPress={handleSavePhoto} style={styles.actionButton} />
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  photoPreviewContainer: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden', // 이미지가 둥근 모서리 밖으로 나가지 않도록
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  photoActionButton: {
    backgroundColor: Colors.primaryBeige,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  photoActionButtonText: {
    fontSize: FontSizes.small,
    color: Colors.textDark,
    marginTop: 5,
    textAlign: 'center',
  },
  memoInput: {
    width: '100%',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default PhotoUploadModal;

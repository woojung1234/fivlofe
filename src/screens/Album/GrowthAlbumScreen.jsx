// src/screens/GrowthAlbumScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

// PhotoUploadModal, GrowthAlbumCalendarView, GrowthAlbumCategoryView 임포트 (아직 생성 안 했지만 미리 선언)
import PhotoUploadModal from './PhotoUploadModal';
import GrowthAlbumCalendarView from './GrowthAlbumCalendarView';
import GrowthAlbumCategoryView from './GrowthAlbumCategoryView';

const GrowthAlbumScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' 또는 'category'
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);

  // Task 완료 시 사진 촬영/갤러리 업로드 팝업 (임시 트리거)
  const handleTriggerPhotoUpload = () => {
    setIsPhotoModalVisible(true);
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('album.header')} showBackButton={true} />

      <View style={styles.contentContainer}>
        {/* 탭바: 캘린더 형식 / 카테고리별 형식 */}
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity
            style={[styles.viewToggleButton, activeView === 'calendar' && styles.viewToggleButtonActive]}
            onPress={() => setActiveView('calendar')}
          >
            <Text style={[styles.viewButtonText, activeView === 'calendar' && styles.viewButtonTextActive]}>{t('album.tab_calendar')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggleButton, activeView === 'category' && styles.viewToggleButtonActive]}
            onPress={() => setActiveView('category')}
          >
            <Text style={[styles.viewButtonText, activeView === 'category' && styles.viewButtonTextActive]}>{t('album.tab_category')}</Text>
          </TouchableOpacity>
        </View>

        {/* 뷰에 따라 다른 컴포넌트 렌더링 */}
        {activeView === 'calendar' ? (
          <GrowthAlbumCalendarView />
        ) : (
          <GrowthAlbumCategoryView />
        )}

        {/* 테스트용 사진 업로드 트리거 버튼 (실제로는 Task 완료 시 호출) */}
        <TouchableOpacity style={styles.testPhotoButton} onPress={handleTriggerPhotoUpload}>
          <Text style={styles.testPhotoButtonText}>{t('album.test_upload')}</Text>
        </TouchableOpacity>
      </View>

      {/* 사진 촬영/갤러리 업로드 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPhotoModalVisible}
        onRequestClose={() => setIsPhotoModalVisible(false)}
      >
        <PhotoUploadModal onClose={() => setIsPhotoModalVisible(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    marginBottom: 20,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 15,
  },
  viewToggleButtonActive: {
    backgroundColor: Colors.accentApricot,
  },
  viewButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.medium,
  },
  viewButtonTextActive: {
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
  testPhotoButton: {
    backgroundColor: Colors.secondaryBrown,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  testPhotoButtonText: {
    color: Colors.textLight,
    fontSize: FontSizes.small,
  },
});

export default GrowthAlbumScreen;

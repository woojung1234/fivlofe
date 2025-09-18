// src/screens/GrowthAlbumCategoryView.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'; // ScrollView 임포트 확인!

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color'; // <-- 사용자님 파일명에 맞춰 'color'로 수정!
import { FontSizes, FontWeights } from '../../styles/Fonts'; // <-- 사용자님 파일명에 맞춰 'Fonts'로 수정!
import { useTranslation } from 'react-i18next';

const GrowthAlbumCategoryView = () => {
  const { t } = useTranslation();
  // 임시 카테고리별 사진 데이터 (실제로는 백엔드에서 가져옴)
  const mockCategoryPhotos = {
    '운동': [
      { id: 'p1', uri: 'https://placehold.co/100x100/FFD1DC/000000?text=운동1', memo: '오전 운동 후' },
      { id: 'p5', uri: 'https://placehold.co/100x100/FFABAB/000000?text=운동2', memo: '저녁 조깅' },
    ],
    '공부': [
      { id: 'p2', uri: 'https://placehold.co/100x100/99DDFF/000000?text=개발', memo: 'FIVLO 개발 중' },
      { id: 'p6', uri: 'https://placehold.co/100x100/A0FFC3/000000?text=공부', memo: '새로운 기술 학습' },
    ],
    '일상': [
      { id: 'p3', uri: 'https://placehold.co/100x100/FFABAB/000000?text=식사', memo: '건강한 점심' },
    ],
    '업무': [
      { id: 'p4', uri: 'https://placehold.co/100x100/D1B5FF/000000?text=보고서', memo: '보고서 작성 완료' },
    ],
  };

  // 카테고리 목록 (색상 정보 포함)
  const categories = [
    { name: '운동', color: '#FFABAB' },
    { name: '공부', color: '#99DDFF' },
    { name: '일상', color: Colors.primaryBeige },
    { name: '업무', color: '#D1B5FF' },
    { name: '취미', color: '#A0FFC3' },
  ];

  const renderPhotoThumbnail = ({ item }) => (
    <TouchableOpacity style={styles.photoThumbnailContainer}>
      <Image source={{ uri: item.uri }} style={styles.photoThumbnail} />
      <Text style={styles.photoMemo}>{item.memo}</Text>
    </TouchableOpacity>
  );

  const renderCategorySection = ({ item: category }) => (
    <View style={styles.categorySection}>
      <View style={[styles.categoryHeader, { backgroundColor: category.color }]}>
        <Text style={styles.categoryTitle}>{category.name}</Text>
      </View>
      {mockCategoryPhotos[category.name] && mockCategoryPhotos[category.name].length > 0 ? (
        <FlatList
          data={mockCategoryPhotos[category.name]}
          renderItem={renderPhotoThumbnail}
          keyExtractor={photo => photo.id}
          numColumns={3}
          contentContainerStyle={styles.photoGrid}
          scrollEnabled={false} // 부모 ScrollView가 스크롤 담당
        />
      ) : (
        <Text style={styles.noPhotoText}>{t('album.no_photos_in_category')}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}> {/* ScrollView로 감싸기 */}
      <FlatList
        data={categories}
        renderItem={renderCategorySection}
        keyExtractor={item => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.categoryListContent}
        scrollEnabled={false} // 부모 ScrollView가 스크롤 담당
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.primaryBeige,
  },
  categoryListContent: {
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 20,
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 10,
  },
  categoryHeader: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBeige,
  },
  categoryTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  photoGrid: {
    justifyContent: 'center',
    width: '100%',
    padding: 10,
  },
  photoThumbnailContainer: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoMemo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: Colors.textLight,
    fontSize: FontSizes.small - 2,
    paddingVertical: 3,
    textAlign: 'center',
  },
  noPhotoText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginTop: 30,
  },
});

export default GrowthAlbumCategoryView;

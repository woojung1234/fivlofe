// src/screens/GrowthAlbumCalendarView.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import { useTranslation } from 'react-i18next';

// 캘린더 한국어 설정 (TaskCalendarScreen과 동일)
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const GrowthAlbumCalendarView = () => {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // 임시 사진 데이터 (실제로는 백엔드에서 가져옴)
  const mockPhotos = {
    '2025-07-20': [
      { id: 'p1', uri: 'https://placehold.co/100x100/FFD1DC/000000?text=운동', memo: '오전 운동 후', category: '운동' },
      { id: 'p2', uri: 'https://placehold.co/100x100/99DDFF/000000?text=개발', memo: 'FIVLO 개발 중', category: '공부' },
    ],
    '2025-07-21': [
      { id: 'p3', uri: 'https://placehold.co/100x100/FFABAB/000000?text=식사', memo: '건강한 점심', category: '일상' },
    ],
    '2025-07-25': [
      { id: 'p4', uri: 'https://placehold.co/100x100/D1B5FF/000000?text=보고서', memo: '보고서 작성 완료', category: '업무' },
    ],
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const markedDates = Object.keys(mockPhotos).reduce((acc, dateString) => {
    const photos = mockPhotos[dateString];
    if (photos && photos.length > 0) {
      acc[dateString] = {
        dots: photos.map(photo => ({
          key: photo.id,
          color: photo.category === '운동' ? Colors.accentApricot : Colors.secondaryBrown, // 카테고리별 색상 예시
          selectedDotColor: Colors.textLight,
        })),
        selected: isSameDay(new Date(dateString), new Date(selectedDate)),
        selectedColor: Colors.accentApricot,
      };
    }
    return acc;
  }, {});

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: Colors.accentApricot,
    };
  }

  const photosForSelectedDate = mockPhotos[selectedDate] || [];

  const renderPhotoItem = ({ item }) => (
    <TouchableOpacity style={styles.photoThumbnailContainer}>
      <Image source={{ uri: item.uri }} style={styles.photoThumbnail} />
      <Text style={styles.photoMemo}>{item.memo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType={'dots'}
        theme={{
          backgroundColor: Colors.primaryBeige,
          calendarBackground: Colors.primaryBeige,
          textSectionTitleColor: Colors.secondaryBrown,
          selectedDayBackgroundColor: Colors.accentApricot,
          selectedDayTextColor: Colors.textLight,
          todayTextColor: Colors.accentApricot,
          dayTextColor: Colors.textDark,
          textDisabledColor: '#d9e1e8',
          dotColor: Colors.accentApricot,
          selectedDotColor: Colors.textLight,
          arrowColor: Colors.secondaryBrown,
          monthTextColor: Colors.textDark,
          textMonthFontWeight: FontWeights.bold,
          textMonthFontSize: FontSizes.large,
          textDayHeaderFontWeight: FontWeights.medium,
          textDayFontSize: FontSizes.medium,
          textDayFontWeight: FontWeights.regular,
        }}
        style={styles.calendar}
      />
      
      <Text style={styles.selectedDateTitle}>{format(new Date(selectedDate), i18n.language === 'ko' ? 'yyyy년 MM월 dd일' : 'yyyy-MM-dd')}</Text>
      {photosForSelectedDate.length > 0 ? (
        <FlatList
          data={photosForSelectedDate}
          renderItem={renderPhotoItem}
          keyExtractor={item => item.id}
          numColumns={3} // 한 줄에 3개 썸네일
          contentContainerStyle={styles.photoGrid}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noPhotoText}>{t('album.no_photos_selected')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.primaryBeige,
  },
  calendar: {
    width: '100%',
    aspectRatio: 1,
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.textLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  selectedDateTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  photoGrid: {
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  photoThumbnailContainer: {
    width: '30%', // 3개씩
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

export default GrowthAlbumCalendarView;

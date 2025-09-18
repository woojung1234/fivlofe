// src/screens/ReminderScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { format } from 'date-fns';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import { useTranslation } from 'react-i18next';

const ReminderScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused(); // 화면 포커스 여부 확인
  const { t } = useTranslation();

  // 임시 알림 목록 (실제로는 백엔드에서 가져오거나 전역 상태 관리)
  const [reminders, setReminders] = useState([
    { id: 'r1', title: '약 챙기기', time: '07:30', location: '집', isPremiumLocation: true, checklist: ['지갑', '폰', '약'] },
    { id: 'r2', title: '점심 약 먹기', time: '13:30', location: '', isPremiumLocation: false, checklist: ['점심 약'] }, // 장소 설정 안 함
    { id: 'r3', title: '지갑 챙기기', time: '08:00', location: '', isPremiumLocation: false, checklist: ['지갑', '열쇠'] },
  ]);

  // ReminderAddEditScreen에서 알림이 추가/수정되었을 때 목록 업데이트
  useEffect(() => {
    // 실제 앱에서는 백엔드 API를 호출하여 최신 알림 목록을 가져옵니다.
    // 여기서는 임시로 목록을 새로고침하는 효과를 줍니다.
    if (isFocused) {
      // 예를 들어, navigation.getParam('newReminder') 등으로 새 알림을 받아 처리할 수 있습니다.
      // 또는 전역 상태 관리 (Zustand 등)를 통해 알림 목록을 관리할 수 있습니다.
    }
  }, [isFocused]);

  // 알림 항목 클릭 시 수정 페이지로 이동
  const handleEditReminder = (reminder) => {
    navigation.navigate('ReminderAddEdit', { reminder: reminder });
  };

  // "+" 버튼 클릭 시 새 알림 추가 페이지로 이동
  const handleAddReminder = () => {
    navigation.navigate('ReminderAddEdit', { reminder: null }); // 새 알림 추가 모드
  };

  const renderReminderItem = ({ item }) => (
    <TouchableOpacity style={styles.reminderItem} onPress={() => handleEditReminder(item)}>
      <View style={styles.reminderContent}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text style={styles.reminderTime}>{item.time}</Text>
      </View>
      <View style={styles.reminderLocation}>
        <Text style={styles.reminderLocationText}>
          {item.location ? item.location : t('reminder.location_not_set')}
        </Text>
        {item.isPremiumLocation && !item.location && ( // 유료 기능인데 장소 설정 안 했으면 잠금 표시
          <FontAwesome5 name="lock" size={16} color={Colors.secondaryBrown} style={styles.lockIcon} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('reminder.title')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {reminders.length > 0 ? (
          <FlatList
            data={reminders}
            renderItem={renderReminderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.reminderListContent}
            scrollEnabled={false} // 부모 ScrollView가 스크롤 담당
          />
        ) : (
          <Text style={styles.noRemindersText}>{t('reminder.empty_list')}</Text>
        )}
      </ScrollView>

      {/* "+" 버튼 (2번) */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
        <FontAwesome5 name="plus" size={24} color={Colors.textLight} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80, // 하단 버튼과의 간격
    paddingTop: 10,
  },
  reminderListContent: {
    flexGrow: 1,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 5,
  },
  reminderTime: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
  },
  reminderLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderLocationText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginRight: 5,
  },
  lockIcon: {
    marginLeft: 5,
  },
  noRemindersText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginTop: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.accentApricot,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default ReminderScreen;

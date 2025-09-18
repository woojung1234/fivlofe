// src/screens/ReminderChecklistScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-native';

// ReminderCompleteCoinModal 임포트 (아직 생성 안 했지만 미리 선언)
import ReminderCompleteCoinModal from './ReminderCompleteCoinModal';

const ReminderChecklistScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { reminderTitle, checklistItems: initialChecklistItems } = route.params || {
    reminderTitle: t('reminder.title'),
    checklistItems: ['지갑', '폰', '열쇠']
  };

  const [checklist, setChecklist] = useState(
    initialChecklistItems.map(item => ({ text: item, completed: false }))
  );
  const [showCoinModal, setShowCoinModal] = useState(false);

  // 모든 항목 완료 여부 확인
  useEffect(() => {
    const allCompleted = checklist.every(item => item.completed);
    if (allCompleted && checklist.length > 0) {
      // 모든 항목 완료 시 코인 지급 모달 띄우기 (유료 사용자에게만)
      // 실제로는 유료 사용자 여부와 1일 1회 지급 로직 확인 후 띄움
      setShowCoinModal(true);
    }
  }, [checklist]);

  const toggleChecklistItem = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setChecklist(newChecklist);
  };

  const renderChecklistItem = ({ item, index }) => (
    <TouchableOpacity style={styles.checklistItem} onPress={() => toggleChecklistItem(index)}>
      <View style={styles.checkbox}>
        <FontAwesome5
          name={item.completed ? 'check-square' : 'square'}
          size={24}
          color={item.completed ? Colors.accentApricot : Colors.secondaryBrown}
        />
      </View>
      <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={reminderTitle} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.instructionText}>{t('reminder.checklist_question')}</Text>
        
        <FlatList
          data={checklist}
          renderItem={renderChecklistItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.checklistContent}
          scrollEnabled={false} // 부모 ScrollView가 스크롤 담당
        />

        <View style={styles.actionButtonContainer}>
          <Button title={t('reminder.remind_in_5m')} onPress={() => Alert.alert(t('reminder.location_required_title'), '5m')} primary={false} style={styles.actionButton} />
          <Button title={t('reminder.skip_today')} onPress={() => Alert.alert(t('reminder.location_required_title'), 'skip')} primary={false} style={styles.actionButton} />
        </View>
      </ScrollView>

      {/* 코인 지급 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCoinModal}
        onRequestClose={() => setShowCoinModal(false)}
      >
        <ReminderCompleteCoinModal onClose={() => setShowCoinModal(false)} />
      </Modal>
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
    paddingBottom: 40,
    paddingTop: 10,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 30,
    textAlign: 'center',
  },
  checklistContent: {
    width: '100%',
    paddingBottom: 20,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 15,
  },
  itemText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.secondaryBrown,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ReminderChecklistScreen;

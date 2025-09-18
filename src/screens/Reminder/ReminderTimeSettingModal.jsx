// src/screens/ReminderTimeSettingModal.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // 시간 선택 UI
import { format, setHours, setMinutes } from 'date-fns';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const ReminderTimeSettingModal = ({ initialTime, onTimeSelected, onClose }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date()); // DateTimePicker는 Date 객체 사용
  const [selectedDays, setSelectedDays] = useState({
    '일': false, '월': false, '화': false, '수': false, '목': false, '금': false, '토': false
  });

  // 초기 시간 설정
  useEffect(() => {
    if (initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      setSelectedDate(setMinutes(setHours(new Date(), hours), minutes));
    }
  }, [initialTime]);

  const onChangeTime = (event, newDate) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSave = () => {
    const timeString = format(selectedDate, 'HH:mm');
    const selectedRepeatDays = Object.keys(selectedDays).filter(day => selectedDays[day]);

    if (onTimeSelected) {
      onTimeSelected(timeString, selectedRepeatDays); // 시간과 요일 전달
    }
    onClose();
  };

  const daysOfWeek = t('reminder.days', { returnObjects: true });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('reminder.time_setting')}</Text>

          {/* 시간 선택 (6번 페이지) */}
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display="spinner" // 스크롤 형식
            onChange={onChangeTime}
            style={styles.timePicker}
          />

          {/* 요일 반복 설정 */}
          <Text style={styles.sectionTitle}>{t('reminder.repeat_days')}</Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map(day => (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, selectedDays[day] && styles.dayButtonActive]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.dayButtonText, selectedDays[day] && styles.dayButtonTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Button title={t('reminder.cancel')} onPress={onClose} primary={false} style={styles.actionButton} />
            <Button title={t('reminder.save')} onPress={handleSave} style={styles.actionButton} />
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
    maxHeight: '85%',
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
  timePicker: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
    marginTop: 15,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryBeige,
    margin: 5,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  dayButtonActive: {
    backgroundColor: Colors.accentApricot,
  },
  dayButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  dayButtonTextActive: {
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ReminderTimeSettingModal;

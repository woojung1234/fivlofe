// src/screens/PomodoroGoalCreationScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons'; // 아이콘 사용

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

// 포모도로 목표 색상 팔레트 (20가지 색상 예시)
const COLOR_PALETTE = [
  '#FFD1DC', '#FFABAB', '#FFC3A0', '#FFDD99', '#FFFFB5', '#D1FFB5', '#A0FFC3', '#ABFFFF',
  '#D1B5FF', '#FFB5FF', '#C3A0FF', '#99DDFF', '#B5FFFF', '#B5FFD1', '#A0FFAB', '#C3FFAB',
  '#E0BBE4', '#957DAD', '#D291BC', '#FFC72C', // 추가적인 색상
];

const PomodoroGoalCreationScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [goalText, setGoalText] = useState(''); // 목표 텍스트
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]); // 선택된 색상
  const [showColorPicker, setShowColorPicker] = useState(false); // 색상 선택기 모달 표시 여부

  // "저장" 버튼 클릭 핸들러
  const handleSaveGoal = () => {
    if (!goalText.trim()) {
      Alert.alert(t('reminder.location_required_title'), t('pomodoro.create_goal_placeholder'));
      return;
    }
    // 목표와 색상을 저장하고 다음 화면으로 이동
    // 실제로는 백엔드에 저장 (REQ-BE-POMO-001)
    Alert.alert(t('reminder.saved_title'), t('reminder.saved_message', { title: goalText }));
    navigation.navigate('PomodoroGoalSelection', {
      newGoal: { text: goalText, color: selectedColor, id: Date.now().toString() }
    });
  };

  // 색상 아이템 렌더링
  const renderColorItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.colorOption, { backgroundColor: item }]}
      onPress={() => {
        setSelectedColor(item);
        setShowColorPicker(false);
      }}
    >
      {selectedColor === item && (
        <FontAwesome5 name="check" size={20} color={Colors.textLight} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('pomodoro.create_header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {/* 목표 작성 칸 (이미지 4번) */}
        <Text style={styles.sectionTitle}>{t('pomodoro.create_goal_label')}</Text>
        <TextInput
          style={styles.goalInput}
          placeholder={t('pomodoro.create_goal_placeholder')}
          placeholderTextColor={Colors.secondaryBrown}
          value={goalText}
          onChangeText={setGoalText}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* 색상 설정 칸 (이미지 5번) */}
        <Text style={styles.sectionTitle}>{t('pomodoro.color_label')}</Text>
        <TouchableOpacity style={styles.colorDisplayButton} onPress={() => setShowColorPicker(true)}>
          <View style={[styles.selectedColorPreview, { backgroundColor: selectedColor }]} />
          <Text style={styles.colorButtonText}>{t('pomodoro.color_select')}</Text>
        </TouchableOpacity>

        {/* 저장 버튼 */}
        <Button title={t('pomodoro.save')} onPress={handleSaveGoal} style={styles.saveButton} />
      </ScrollView>

      {/* 색상 선택 모달 (이미지 7번) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showColorPicker}
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.colorPickerOverlay}>
          <View style={styles.colorPickerContent}>
            <Text style={styles.colorPickerTitle}>{t('pomodoro.color_modal_title')}</Text>
            <FlatList
              data={COLOR_PALETTE}
              renderItem={renderColorItem}
              keyExtractor={item => item}
              numColumns={5} // 한 줄에 5개씩 표시
              contentContainerStyle={styles.colorOptionsGrid}
            />
            <Button title={t('pomodoro.done')} onPress={() => setShowColorPicker(false)} style={styles.colorPickerDoneButton} />
          </View>
        </View>
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
    alignItems: 'center',
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 25,
    marginBottom: 10,
    width: '100%',
    textAlign: 'left',
  },
  goalInput: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 100,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  colorDisplayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedColorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  colorButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
  saveButton: {
    marginTop: 40,
    width: '100%',
  },
  // 색상 선택 모달 스타일
  colorPickerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  colorPickerContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  colorPickerTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
  },
  colorOptionsGrid: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  colorOption: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    margin: 8,
    borderWidth: 2,
    borderColor: Colors.secondaryBrown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerDoneButton: {
    marginTop: 20,
    width: '80%',
  },
});

export default PomodoroGoalCreationScreen;

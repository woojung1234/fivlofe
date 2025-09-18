// src/screens/RoutineSettingScreen.jsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Modal, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons'; // 아이콘 사용을 위해 FontAwesome5 임포트

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Header from '../components/common/Header';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useTranslation } from 'react-i18next';

// @react-native-community/datetimepicker 설치 필요: npm install @react-native-community/datetimepicker
// FontAwesome5 아이콘 사용을 위해 @expo/vector-icons 설치 필요 (이전에 FontAwesome 설치했으면 이미 있을 수 있음)

const RoutineSettingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const [goal, setGoal] = useState(''); // 상위 목표 입력
  const [targetDate, setTargetDate] = useState(new Date()); // 달성 기간 설정 (특정 날짜)
  const [isContinuous, setIsContinuous] = useState(false); // 종료 기한 없이 지속 여부
  const [showDatePicker, setShowDatePicker] = useState(false); // 날짜 선택기 표시 여부
  const [isLoadingAI, setIsLoadingAI] = useState(false); // AI 로딩 상태

  // AI가 추천하는 단기 계획 목록
  const [aiRecommendedTasks, setAiRecommendedTasks] = useState([]);
  const [isEditingTask, setIsEditingTask] = useState(false); // 수정 모달 표시 여부
  const [currentEditingTask, setCurrentEditingTask] = useState(null); // 현재 수정 중인 태스크
  const [editedTaskText, setEditedTaskText] = useState(''); // 수정된 태스크 텍스트

  // 날짜 선택기 변경 핸들러
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || targetDate;
    setShowDatePicker(false);
    setTargetDate(currentDate);
  };

  // "맞춤일정 생성하기" 클릭 핸들러 (AI 세분화 요청)
  const handleGenerateSchedule = () => {
    if (!goal.trim()) {
      Alert.alert(t('core.routine.required_title'), t('core.routine.required_goal'));
      return;
    }

    setIsLoadingAI(true); // 로딩 시작
    setAiRecommendedTasks([]); // 이전 목록 초기화

    // AI 세분화 로직 (백엔드 연동 전 임시 데이터)
    setTimeout(() => {
      const generatedTasks = [
        { id: 'ai1', text: '매일 아침 10분 스트레칭', type: 'daily', editable: true },
        { id: 'ai2', text: '주 3회 헬스장 방문', type: 'weekly', editable: true },
        { id: 'ai3', text: '매일 저녁 샐러드 먹기', type: 'daily', editable: true },
        { id: 'ai4', text: '매주 주말 등산하기', type: 'weekly', editable: true },
        { id: 'ai5', text: '매일 자기 전 명상 5분', type: 'daily', editable: true },
        { id: 'ai6', text: '매월 첫째 주 목표 점검', type: 'monthly', editable: true },
        { id: 'ai7', text: '매일 아침 10분 스트레칭', type: 'daily', editable: true },
        { id: 'ai8', text: '주 3회 헬스장 방문', type: 'weekly', editable: true },
        { id: 'ai9', text: '매일 저녁 샐러드 먹기', type: 'daily', editable: true },
        { id: 'ai10', text: '매주 주말 등산하기', type: 'weekly', editable: true },
        { id: 'ai11', text: '매일 자기 전 명상 5분', type: 'daily', editable: true },
        { id: 'ai12', text: '매월 첫째 주 목표 점검', type: 'monthly', editable: true },
      ];
      setAiRecommendedTasks(generatedTasks);
      setIsLoadingAI(false); // 로딩 종료
    }, 2000); // 2초 후 데이터 로드 (로딩 시뮬레이션)

    // 실제로는 백엔드 AI API (REQ-BE-AI-001) 호출
    // const response = await getAiSuggestions(goal, isContinuous ? null : format(targetDate, 'yyyy-MM-dd'));
  };

  // TASK에 추가하기 버튼 클릭 핸들러
  const handleAddTaskToTask = (task) => {
    Alert.alert('TASK에 추가', `"${task.text}" 항목을 TASK에 추가합니다.`);
    // 실제로는 백엔드 API (REQ-BE-AI-003) 호출하여 TASK로 전환
    // navigation.navigate('HomeScreen'); // 홈 화면으로 돌아가거나, Task 캘린더 화면으로 이동
  };

  // 수정 아이콘 클릭 핸들러
  const handleEditIconClick = (task) => {
    setCurrentEditingTask(task);
    setEditedTaskText(task.text);
    setIsEditingTask(true); // 수정 모달 열기
  };

  // 수정 모달 저장 핸들러
  const handleSaveEditedTask = () => {
    setAiRecommendedTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === currentEditingTask.id ? { ...task, text: editedTaskText } : task
      )
    );
    setIsEditingTask(false); // 수정 모달 닫기
    setCurrentEditingTask(null);
    setEditedTaskText('');
    Alert.alert('저장 완료', '일정이 수정되었습니다.');
    // 실제로는 백엔드 API (REQ-BE-AI-002) 호출하여 수정 내용 반영
  };

  // 수정 모달 취소 핸들러
  const handleCancelEdit = () => {
    setIsEditingTask(false);
    setCurrentEditingTask(null);
    setEditedTaskText('');
  };

  // AI 추천 태스크 아이템 렌더링
  const renderAiTaskItem = ({ item }) => (
    <View style={styles.aiTaskItem}>
      <Text style={styles.aiTaskText}>{item.text}</Text>
      <View style={styles.aiTaskActions}>
        <TouchableOpacity onPress={() => handleEditIconClick(item)} style={styles.aiTaskActionButton}>
          <FontAwesome5 name="edit" size={20} color={Colors.secondaryBrown} />
        </TouchableOpacity>
        <Button
          title="TASK에 추가하기"
          onPress={() => handleAddTaskToTask(item)}
          style={styles.addTaskButton}
          textStyle={styles.addTaskButtonText}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('core.routine.header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {/* 상위 목표 입력 필드 */}
        <Text style={styles.sectionTitle}>{t('core.routine.goal_input_label')}</Text>
        <Input
          placeholder={t('core.routine.goal_input_placeholder')}
          value={goal}
          onChangeText={setGoal}
          multiline={true}
          numberOfLines={3}
          style={styles.goalInput}
        />

        {/* 목표 달성 기간 설정 칸 */}
        <Text style={styles.sectionTitle}>{t('core.routine.target_period_label')}</Text>
        <View style={styles.dateOptionContainer}>
          <TouchableOpacity
            style={[styles.dateOptionButton, isContinuous && styles.dateOptionButtonActive]}
            onPress={() => setIsContinuous(true)}
          >
            <Text style={[styles.dateOptionText, isContinuous && styles.dateOptionTextActive]}>{t('core.routine.continuous')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dateOptionButton, !isContinuous && styles.dateOptionButtonActive]}
            onPress={() => setIsContinuous(false)}
          >
            <Text style={[styles.dateOptionText, !isContinuous && styles.dateOptionTextActive]}>{t('core.routine.set_period')}</Text>
          </TouchableOpacity>
        </View>

        {!isContinuous && (
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerButtonText}>
              {format(targetDate, i18n.language === 'ko' ? 'yyyy년 MM월 dd일' : 'yyyy-MM-dd')}
            </Text>
          </TouchableOpacity>
        )}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={targetDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()} // 오늘 날짜부터 선택 가능
          />
        )}

        {/* 맞춤일정 생성하기 버튼 */}
        <Button
          title={t('core.routine.generate')}
          onPress={handleGenerateSchedule}
          style={styles.generateButton}
        />

        {/* AI 세분화 로딩 창 (2-2) */}
        {isLoadingAI && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondaryBrown} />
            <Text style={styles.loadingText}>{t('core.routine.loading')}</Text>
          </View>
        )}

        {/* AI가 추천하는 반복일정 칸 (2-3, 3-3) */}
        {aiRecommendedTasks.length > 0 && !isLoadingAI && (
          <View style={styles.aiRecommendationsContainer}>
            <Text style={styles.aiRecommendationsTitle}>{t('core.routine.ai_title')}</Text>
            {isContinuous ? (
              // 종료 기한 없이 지속 선택 시 (2-3)
              <FlatList
                data={aiRecommendedTasks}
                renderItem={renderAiTaskItem}
                keyExtractor={item => item.id}
                scrollEnabled={false} // ScrollView가 스크롤 담당
                contentContainerStyle={styles.aiFlatListContent}
              />
            ) : (
              // 달성 기간 설정 시 (3-3) - 주차별 목표 및 일정
              <View style={styles.weeklyGoalsPlaceholder}>
                <Text style={styles.placeholderText}>{t('core.routine.weekly_placeholder_1')}</Text>
                <Text style={styles.placeholderText}>{t('core.routine.weekly_placeholder_2')}</Text>
                {/* 실제 주차별 목표 FlatList 또는 UI 구현 */}
                <FlatList
                  data={aiRecommendedTasks} // 임시로 같은 데이터 사용, 실제로는 주차별 데이터
                  renderItem={renderAiTaskItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.aiFlatListContent}
                />
              </View>
            )}
          </View>
        )}

        {/* 수정 모달 (2-5, 3-4) */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isEditingTask}
          onRequestClose={handleCancelEdit}
        >
          <View style={styles.editModalOverlay}>
            <View style={styles.editModalContent}>
              <Text style={styles.editModalTitle}>{t('core.routine.edit_title')}</Text>
              <TextInput
                style={styles.editModalInput}
                value={editedTaskText}
                onChangeText={setEditedTaskText}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
              <View style={styles.editModalButtons}>
                <Button title={t('task.cancel')} onPress={handleCancelEdit} primary={false} style={styles.editModalButton} />
                <Button title={t('task.save')} onPress={handleSaveEditedTask} style={styles.editModalButton} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
    paddingBottom: 15,
  },
  dateOptionContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateOptionButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  dateOptionButtonActive: {
    backgroundColor: Colors.accentApricot, // 활성 상태 배경색
  },
  dateOptionText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.regular,
  },
  dateOptionTextActive: {
    color: Colors.textLight, // 활성 상태 텍스트 색상
    fontWeight: FontWeights.bold,
  },
  datePickerButton: {
    width: '100%',
    backgroundColor: Colors.textLight,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  datePickerButtonText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.regular,
  },
  generateButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 50,
  },
  loadingText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  aiRecommendationsContainer: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  aiRecommendationsTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  aiFlatListContent: {
    paddingBottom: 10,
  },
  aiTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBeige,
  },
  aiTaskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
    marginRight: 10,
  },
  aiTaskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTaskActionButton: {
    padding: 5,
    marginRight: 10,
  },
  addTaskButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.accentApricot,
    minWidth: 100,
  },
  addTaskButtonText: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  weeklyGoalsPlaceholder: {
    width: '100%',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  placeholderText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    lineHeight: 20,
  },
  // 수정 모달 스타일
  editModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  editModalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editModalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
  },
  editModalInput: {
    width: '100%',
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 100,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  editModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  editModalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default RoutineSettingScreen;

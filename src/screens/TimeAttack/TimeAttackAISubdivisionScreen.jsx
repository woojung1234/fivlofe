// src/screens/TimeAttackAISubdivisionScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, FlatList, TextInput, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color'; // <-- 사용자님 파일명에 맞춰 'color'로 수정!
import { FontSizes, FontWeights } from '../../styles/Fonts'; // <-- 사용자님 파일명에 맞춰 'Fonts'로 수정!
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';


const TimeAttackAISubdivisionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { selectedGoal, totalMinutes } = route.params;

  const [isLoadingAI, setIsLoadingAI] = useState(true);
  const [subdividedTasks, setSubdividedTasks] = useState([]);

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [currentEditingTask, setCurrentEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [editedTaskTime, setEditedTaskTime] = useState('');

  useEffect(() => {
    // AI 세분화 로직 시뮬레이션
    setTimeout(() => {
      const generatedTasks = [
        { id: 't1', text: '머리 감기', time: 5, unit: '분', editable: true },
        { id: 't2', text: '샤워하기', time: 10, unit: '분', editable: true },
        { id: 't3', text: '옷 입기', time: 5, unit: '분', editable: true },
        { id: 't4', text: '아침 식사', time: 15, unit: '분', editable: true },
        { id: 't5', text: '쓰레기 버리기', time: 3, unit: '분', editable: true },
        { id: 't6', text: '출근 준비', time: 10, unit: '분', editable: true },
        { id: 't7', text: '준비 완료', time: 0, unit: '분', editable: false }, // 마지막 단계
      ];
      setSubdividedTasks(generatedTasks);
      setIsLoadingAI(false);
    }, 2000); // 2초 로딩 시뮬레이션
  }, []);

  const handleEditTask = (task) => {
    setCurrentEditingTask(task);
    setEditedTaskText(task.text);
    setEditedTaskTime(task.time.toString());
    setIsEditingTask(true);
  };

  const handleSaveEditedTask = () => {
    const time = parseInt(editedTaskTime, 10);
    if (isNaN(time) || time < 0) {
      Alert.alert('알림', '유효한 시간을 입력해주세요.');
      return;
    }
    setSubdividedTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === currentEditingTask.id ? { ...task, text: editedTaskText, time: time } : task
      )
    );
    setIsEditingTask(false);
    setCurrentEditingTask(null);
    setEditedTaskText('');
    setEditedTaskTime('');
    Alert.alert('저장 완료', '일정이 수정되었습니다.');
  };

  const handleCancelEdit = () => {
    setIsEditingTask(false);
    setCurrentEditingTask(null);
    setEditedTaskText('');
    setEditedTaskTime('');
  };

  const handleStartAttack = () => {
    Alert.alert('타임어택 시작', '세분화된 목표로 타임어택을 시작합니다!');
    navigation.navigate('TimeAttackInProgress', { selectedGoal, subdividedTasks });
  };

  const renderSubdividedTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item.text}</Text>
      <View style={styles.taskTimeContainer}>
        {item.editable ? (
          <TouchableOpacity onPress={() => handleEditTask(item)} style={styles.editTimeButton}>
            <Text style={styles.editTimeButtonText}>{item.time} {item.unit}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.staticTimeText}>{item.time} {item.unit}</Text>
        )}
        <TouchableOpacity onPress={() => handleEditTask(item)} style={styles.editIcon}>
          <FontAwesome5 name="edit" size={18} color={Colors.secondaryBrown} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title="타임어택 기능" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {isLoadingAI ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondaryBrown} />
            <Text style={styles.loadingText}>오분이가 당신을 위한{"\n"}40분 타임어택을 만들어요!</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>오분이가 당신을 위한{"\n"}40분 타임어택을 만들었어요!</Text>
            <FlatList
              data={subdividedTasks}
              renderItem={renderSubdividedTaskItem}
              keyExtractor={item => item.id}
              scrollEnabled={false} // 부모 ScrollView가 스크롤 담당
              contentContainerStyle={styles.flatListContent}
            />
            <Button
              title="타임어택 시작"
              onPress={handleStartAttack}
              style={styles.startButton}
            />
          </>
        )}
      </ScrollView>

      {/* 수정 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditingTask}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.editModalTitle}>시간 수정</Text>
            <View style={styles.editModalInputContainer}>
              <TextInput
                style={styles.editModalTextInput}
                value={editedTaskText}
                onChangeText={setEditedTaskText}
                placeholder="목표 내용"
              />
              <TextInput
                style={styles.editModalTimeInput}
                value={editedTaskTime}
                onChangeText={(text) => setEditedTaskTime(text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="분"
              />
              <Text style={styles.editModalTimeUnit}>분</Text>
            </View>
            <View style={styles.editModalButtons}>
              <Button title="취소" onPress={handleCancelEdit} primary={false} style={styles.editModalButton} />
              <Button title="저장" onPress={handleSaveEditedTask} style={styles.editModalButton} />
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 100,
  },
  loadingText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.secondaryBrown,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: 25,
    marginBottom: 15,
    width: '100%',
    textAlign: 'center',
    lineHeight: 30,
  },
  flatListContent: {
    width: '100%',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  taskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
    marginRight: 10,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editTimeButton: {
    backgroundColor: Colors.primaryBeige,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  editTimeButtonText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.bold,
  },
  staticTimeText: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.bold,
    marginRight: 10,
  },
  editIcon: {
    padding: 5,
  },
  startButton: {
    marginTop: 30,
    width: '100%',
  },
  // 수정 모달 스타일
  editModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  editModalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  editModalTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20,
  },
  editModalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    backgroundColor: Colors.primaryBeige,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  editModalTextInput: {
    flex: 1,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    minHeight: 50,
    textAlignVertical: 'center',
  },
  editModalTimeInput: {
    width: 60,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    textAlign: 'right',
    marginRight: 5,
  },
  editModalTimeUnit: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
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

export default TimeAttackAISubdivisionScreen;

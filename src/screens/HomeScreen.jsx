// src/screens/HomeScreen.jsx

import React, {useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, addDays, subDays } from 'date-fns';
// --- 수정: date-fns의 locale import 경로를 최신 버전에 맞게 변경 ---
import { ko } from 'date-fns/locale/ko';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { GlobalStyles } from '../styles/GlobalStyles';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import Button from '../components/common/Button';

const HomeScreen = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [coins, setCoins] = useState(1234);
  const [showCoinGrantModal, setShowCoinGrantModal] = useState(false);

  const mockTasks = [
    { id: '1', text: '오전 운동 (30분)', completed: false, category: '운동' },
    { id: '2', text: '책 10페이지 읽기', completed: false, category: '독서' },
    { id: '3', text: 'FIVLO 앱 개발하기', completed: true, category: '공부' },
  ];

  useEffect(() => {
    setTasks(mockTasks.slice(0, 3));
  }, [currentDate]);

  useEffect(() => {
    if (tasks.length > 0 && tasks.every(task => task.completed)) {
      setTimeout(() => {
        setShowCoinGrantModal(true);
      }, 500);
    }
  }, [tasks]);


  const goToPreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const goToNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const toggleTaskCompletion = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const goToTaskDetail = (task) => {
    Alert.alert('할 일 상세', `${task.text} 항목 수정 화면으로 이동합니다.`);
  };

  const handleGoToTaskCalendar = () => {
    navigation.navigate('TaskCalendar');
  };

  const handleObooniPress = () => {
    navigation.navigate('ObooniCustomization', { isPremiumUser: isPremiumUser });
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => goToTaskDetail(item)}
    >
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => toggleTaskCompletion(item.id)}
      >
        {item.completed ? (
          <FontAwesome name="check-square" size={24} color={Colors.accentApricot} />
        ) : (
          <FontAwesome name="square-o" size={24} color={Colors.secondaryBrown} />
        )}
      </TouchableOpacity>
      <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.dateNavigationContainer}>
          <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.currentDateText}>
            {format(currentDate, 'yyyy년 MM월 dd일 EEEE', { locale: ko })}
          </Text>
          <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton}>
            <Text style={styles.dateNavButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {isPremiumUser && (
          <View style={styles.coinDisplayContainer}>
            <Text style={styles.coinText}>{coins}</Text>
            <FontAwesome name="dollar" size={FontSizes.medium} color={Colors.accentApricot} style={styles.coinIcon} />
          </View>
        )}

        <TouchableOpacity onPress={handleObooniPress}>
          <Image 
            source={require('../../assets/기본오분이.png')} 
            style={styles.obooniCharacter} 
          />
        </TouchableOpacity>

        <View style={styles.taskListContainer}>
          <Text style={styles.taskListTitle}>{t('home.today_tasks')}</Text>
          {tasks.length > 0 ? (
            <FlatList
              data={tasks}
              renderItem={renderTaskItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <TouchableOpacity onPress={handleGoToTaskCalendar} style={styles.noTaskContainer}>
              <Text style={styles.noTaskText}>{t('home.no_tasks')}</Text>
              <FontAwesome name="plus-circle" size={30} color={Colors.secondaryBrown} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showCoinGrantModal}
        onRequestClose={() => setShowCoinGrantModal(false)}
      >
        <View style={styles.coinModalOverlay}>
          <View style={styles.coinModalContent}>
            <Image source={require('../../assets/coin.png')} style={styles.modalCoinImage} />
            <Text style={styles.modalMessage}>
              {t('home.completion_modal_message')}
            </Text>
            <Button title={t('common.ok')} onPress={() => setShowCoinGrantModal(false)} style={styles.modalButton} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  scrollViewContentContainer: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  dateNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    paddingVertical: 15,
    marginTop: 20,
  },
  dateNavButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  dateNavButtonText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.secondaryBrown,
  },
  currentDateText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  coinDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '90%',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    elevation: 2,
  },
  coinText: {
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginRight: 5,
  },
  coinIcon: {},
  obooniCharacter: {
    width: 250,
    height: 250,
    marginVertical: 20,
    resizeMode: 'contain',
  },
  taskListContainer: {
    width: '90%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  taskListTitle: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBeige,
  },
  checkboxContainer: {
    marginRight: 15,
  },
  taskText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.secondaryBrown,
  },
  noTaskContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  noTaskText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginBottom: 10,
  },
  coinModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinModalContent: {
    backgroundColor: Colors.textLight,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    elevation: 10,
  },
  modalCoinImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  modalButton: {
    width: '70%',
  },
});

export default HomeScreen;
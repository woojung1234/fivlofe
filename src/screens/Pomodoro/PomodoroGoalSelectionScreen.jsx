// src/screens/PomodoroGoalSelectionScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native'; // ScrollView 임포트 확인!
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color'; // <-- 사용자님 파일명에 맞춰 'color'로 수정!
import { FontSizes, FontWeights } from '../../styles/Fonts'; // <-- 사용자님 파일명에 맞춰 'Fonts'로 수정!
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const PomodoroGoalSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // 임시 목표 목록 (실제로는 백엔드에서 가져오거나 전역 상태 관리)
  const [goals, setGoals] = useState([
    { id: 'g1', text: '공부하기', color: '#FFD1DC' },
    { id: 'g2', text: '운동하기', color: '#FFDD99' },
    { id: 'g3', text: '독서하기', color: '#A0FFC3' },
    { id: 'g4', text: '정리하기', color: '#ABFFFF' },
    { id: 'g5', text: '국무사 공부하기', color: '#D1B5FF' },
  ]);

  // PomodoroGoalCreationScreen에서 새로 추가된 목표를 받아옴
  useEffect(() => {
    if (route.params?.newGoal) {
      setGoals(prevGoals => {
        // 중복 추가 방지 (id로 확인)
        if (!prevGoals.some(goal => goal.id === route.params.newGoal.id)) {
          return [...prevGoals, route.params.newGoal];
        }
        return prevGoals;
      });
      // 파라미터 초기화 (다음에 돌아왔을 때 중복 추가 방지)
      navigation.setParams({ newGoal: undefined });
    }
  }, [route.params?.newGoal]);

  // 목표 선택 및 포모도로 시작
  const handleSelectGoal = (goal) => {
    Alert.alert(t('pomodoro.start_pomodoro_title'), t('pomodoro.start_pomodoro_message', { goal: goal.text }));
    // 실제로는 PomodoroTimerScreen으로 이동하며 목표 정보 전달
    navigation.navigate('PomodoroTimer', { selectedGoal: goal }); // <-- PomodoroTimerScreen으로 이동
  };

  // 목표 아이템 렌더링
  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => handleSelectGoal(item)}
    >
      <View style={[styles.goalColorIndicator, { backgroundColor: item.color }]} />
      <Text style={styles.goalText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('pomodoro.selection_header')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>{t('pomodoro.what_focus')}</Text>
        
        {goals.length > 0 ? (
          <FlatList
            data={goals}
            renderItem={renderGoalItem}
            keyExtractor={item => item.id}
            scrollEnabled={false} // 부모 ScrollView가 스크롤 담당
            contentContainerStyle={styles.goalListContent}
          />
        ) : (
          <Text style={styles.noGoalsText}>{t('pomodoro.no_goals')}</Text>
        )}

        {/* "집중 목표 작성하기"로 돌아가는 버튼 */}
        <Button 
          title={t('pomodoro.create_new_goal')} 
          onPress={() => navigation.navigate('PomodoroGoalCreation')} 
          style={styles.createGoalButton}
        />
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
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
  },
  goalListContent: {
    width: '100%',
  },
  goalItem: {
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
    width: '100%',
  },
  goalColorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
  },
  goalText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
  },
  noGoalsText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginTop: 50,
  },
  createGoalButton: {
    marginTop: 30,
    width: '100%',
  },
});

export default PomodoroGoalSelectionScreen;

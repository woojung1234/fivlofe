// src/screens/TimeAttack/TimeAttackInProgressScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import CharacterImage from '../../components/common/CharacterImage';
import { useTranslation } from 'react-i18next';

// expo-speech 설치 필요: expo install expo-speech

const AUTO_NEXT_THRESHOLD = 3000; // 자동 다음 단계 전환 대기 시간 (3초)

// 화면 너비를 기준으로 동적 크기 계산
const { width: screenWidth } = Dimensions.get('window');
const nextButtonSize = Math.min(screenWidth * 0.35, 120); // 다음 버튼 크기

const TimeAttackInProgressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const { selectedGoal, subdividedTasks } = route.params;

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // 현재 단계의 남은 시간
  const [isRunning, setIsRunning] = useState(false); // 타이머 작동 여부 - 초기값을 false로 변경
  const [nextButtonPressTime, setNextButtonPressTime] = useState(0); // 다음 버튼 눌린 시간

  const timerRef = useRef(null); // setInterval 참조
  const nextTimerRef = useRef(null); // 자동 다음 단계 전환 타이머


  const currentTask = subdividedTasks[currentTaskIndex];

  // 타이머 로직
  useEffect(() => {
    if (currentTask) {
      setTimeLeft(currentTask.time * 60); // 분을 초로 변환
      setIsRunning(true); // 새 태스크 시작 시 타이머 자동 시작
      
      // TTS: 태스크 시작 메시지 (한영 번역) - 약간의 지연 후 실행
      setTimeout(() => {
        const startMessageKo = `${currentTask.text} 시작합니다.`;
        const startMessageEn = `${currentTask.text} has started.`;
        
        if (i18n.language === 'ko') {
          speakText(startMessageKo);
        } else {
          speakText(startMessageEn);
        }
      }, 500); // 0.5초 지연
    } else {
      // 모든 태스크 완료
      navigation.replace('TimeAttackComplete', { selectedGoal });
      return;
    }
  }, [currentTaskIndex]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      clearInterval(timerRef.current);
      handleTaskComplete(); // 현재 태스크 시간 완료
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);



  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const speakText = async (text) => {
    try {
      const lang = i18n.language === 'ko' ? 'ko-KR' : 'en-US';
      await Speech.speak(text, { language: lang });
    } catch (e) {
      console.warn("Speech synthesis failed", e);
    }
  };

  const handleTaskComplete = () => {
    setIsRunning(false); // 타이머 정지
    
    // TTS: 완료 메시지 (한영 번역)
    const completedMessageKo = `${currentTask.text} 완료되었습니다.`;
    const completedMessageEn = `${currentTask.text} has been completed.`;
    
    if (i18n.language === 'ko') {
      speakText(completedMessageKo);
    } else {
      speakText(completedMessageEn);
    }

    Alert.alert(t('time_attack.completed_title'), completedMessageKo, [
      { text: t('common.ok'), onPress: () => {
        handleNextTask();
      }},
    ], { cancelable: false });
  };

  const handleNextTask = () => {
    if (currentTaskIndex < subdividedTasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      // 다음 태스크로 이동하면 timeLeft는 useEffect에 의해 다시 설정됨
    } else {
      // 모든 태스크 완료
      navigation.replace('TimeAttackComplete', { selectedGoal });
    }
  };

  const handleNextButtonPressIn = () => {
    setNextButtonPressTime(Date.now());
    nextTimerRef.current = setTimeout(() => {
      handleNextTask();
      clearTimeout(nextTimerRef.current);
    }, AUTO_NEXT_THRESHOLD);
  };

  const handleNextButtonPressOut = () => {
    clearTimeout(nextTimerRef.current);
    if (Date.now() - nextButtonPressTime < AUTO_NEXT_THRESHOLD) {
      Alert.alert(t('time_attack.next_step'), t('time_attack.confirm_complete', { task: currentTask.text }), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.ok'), onPress: handleNextTask },
      ]);
    }
  };



  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('headers.time_attack')} showBackButton={true} />
      
      {/* --- 수정: ScrollView로 전체 콘텐츠를 감싸 화면 overflow 방지 --- */}
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.goalText}>{selectedGoal}</Text>
        <Text style={styles.currentTaskText}>{currentTask ? currentTask.text : t('time_attack.ready')}</Text>

        {/* 타임어택 오분이.gif */}
        <View style={styles.obooniContainer}>
          <Image
            source={require('../../../assets/타임어택 오분이.gif')}
            style={styles.obooniGif}
            resizeMode="contain"
          />
        </View>

        {/* 시간 표시 */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPressIn={handleNextButtonPressIn}
          onPressOut={handleNextButtonPressOut}
        >
          <Text style={styles.nextButtonText}>{t('time_attack.next_step')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBeige,
  },
  // --- 수정: ScrollView를 위한 스타일 ---
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  goalText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  currentTaskText: {
    fontSize: FontSizes.extraLarge,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: 20, // 여백 축소
    textAlign: 'center',
  },
  obooniContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  obooniGif: {
    width: 200,
    height: 200,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timeText: {
    fontSize: FontSizes.extraLarge * 2,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: Colors.accentApricot,
    // --- 수정: 동적 크기 적용 ---
    width: nextButtonSize,
    height: nextButtonSize,
    borderRadius: nextButtonSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
});

export default TimeAttackInProgressScreen;
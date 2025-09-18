// src/screens/TimeAttack/TimeAttackInProgressScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
// --- 수정: ScrollView와 Dimensions 임포트 ---
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Easing, Image, ScrollView, Dimensions } from 'react-native';
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

// --- 수정: 화면 너비를 기준으로 동적 크기 계산 ---
const { width: screenWidth } = Dimensions.get('window');
const timerSize = Math.min(screenWidth * 0.8, 300); // 타이머 원의 크기를 화면 너비의 80%로 설정 (최대 300px)
const characterSize = Math.min(screenWidth * 0.4, 150); // 캐릭터 크기
const nextButtonSize = Math.min(screenWidth * 0.35, 120); // 다음 버튼 크기

const TimeAttackInProgressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const { selectedGoal, subdividedTasks } = route.params;

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // 현재 단계의 남은 시간
  const [isRunning, setIsRunning] = useState(true); // 타이머 작동 여부
  const [nextButtonPressTime, setNextButtonPressTime] = useState(0); // 다음 버튼 눌린 시간

  const timerRef = useRef(null); // setInterval 참조
  const nextTimerRef = useRef(null); // 자동 다음 단계 전환 타이머

  // 시계 바늘 및 진행도 애니메이션 값
  const minuteHandRotation = useRef(new Animated.Value(0)).current;
  const progressFill = useRef(new Animated.Value(0)).current; // 0-100% 진행도
  const obooniMovementAnim = useRef(new Animated.Value(0)).current; // 오분이 움직임 애니메이션

  const currentTask = subdividedTasks[currentTaskIndex];
  const totalTaskDuration = currentTask ? currentTask.time * 60 : 0; // 현재 Task의 총 시간 (초)

  // 타이머 로직
  useEffect(() => {
    if (currentTask) {
      setTimeLeft(currentTask.time * 60); // 분을 초로 변환
      setIsRunning(true); // 새 태스크 시작 시 타이머 자동 시작
    } else {
      // 모든 태스크 완료
      navigation.replace('TimeAttackComplete', { selectedGoal });
      return;
    }
  }, [currentTaskIndex, subdividedTasks]);

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

  // 시계 바늘 및 진행도 애니메이션 업데이트
  useEffect(() => {
    if (totalTaskDuration > 0) {
      const elapsedSeconds = totalTaskDuration - timeLeft;
      const progressPercentage = (elapsedSeconds / totalTaskDuration) * 100;
      const minuteAngle = (elapsedSeconds % 60) * 6; // 1초에 6도
      minuteHandRotation.setValue(minuteAngle);
      progressFill.setValue(progressPercentage);
    }
  }, [timeLeft, totalTaskDuration]);

  // 오분이 움직임 애니메이션
  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.timing(obooniMovementAnim, {
          toValue: 1,
          duration: 2000, // 오분이가 뛰어다니는 모션 (2초마다 반복)
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      obooniMovementAnim.stopAnimation();
      obooniMovementAnim.setValue(0); // 정지 시 초기화
    }
  }, [isRunning]);


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
    const message = t('time_attack.completed_message', { task: currentTask.text });
    speakText(message); // 음성 알림

    Alert.alert(t('time_attack.completed_title'), message, [
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

  // 오분이 캐릭터 움직임 (좌우 흔들림)
  const obooniShake = obooniMovementAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '5deg', '0deg', '-5deg', '0deg'],
  });

  // 진행도 바 색상 그라데이션
  const progressColor = progressFill.interpolate({
    inputRange: [0, 50, 100], // 0% (시작), 50% (중간), 100% (완료)
    outputRange: [Colors.accentApricot, '#FF8C00', '#FF4500'], // 노랑 -> 주황 -> 빨강
    extrapolate: 'clamp', // 범위를 벗어나지 않도록
  });

  const animatedBorderColor = progressColor;


  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('headers.time_attack')} showBackButton={true} />
      
      {/* --- 수정: ScrollView로 전체 콘텐츠를 감싸 화면 overflow 방지 --- */}
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.goalText}>{selectedGoal}</Text>
        <Text style={styles.currentTaskText}>{currentTask ? currentTask.text : t('time_attack.ready')}</Text>

        <View style={styles.timerDisplayContainer}>
          <Animated.View style={[
            styles.timerCircleOuter, 
            { 
              borderColor: animatedBorderColor,
              // --- 수정: 동적 크기 적용 ---
              width: timerSize,
              height: timerSize,
              borderRadius: timerSize / 2
            }
          ]}>
            <Image
              source={require('../../../assets/images/obooni_clock.png')}
              style={styles.obooniClock}
            />
            <Animated.Image
              source={require('../../../assets/images/clock_needle.png')}
              style={[
                styles.clockNeedle,
                { transform: [{ rotate: minuteHandRotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })
                }]}
              ]}
            />
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.remainingText}>
              {t('time_attack.remaining_time', { min: Math.floor(timeLeft / 60).toString().padStart(2, '0'), sec: (timeLeft % 60).toString().padStart(2, '0') })}
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.obooniCharacterWrapper, { transform: [{ rotateY: obooniShake }] }]}>
          <CharacterImage style={styles.obooniCharacter} />
        </Animated.View>

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
  timerDisplayContainer: {
    alignItems: 'center',
    marginBottom: 20, // 여백 축소
  },
  timerCircleOuter: {
    // --- 수정: 고정 크기 제거 (JSX에서 동적으로 할당) ---
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: Colors.textLight,
  },
  obooniClock: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    position: 'absolute',
  },
  clockNeedle: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
    position: 'absolute',
    top: '10%',
    left: '30%',
    transformOrigin: 'center center',
  },
  timerText: {
    fontSize: FontSizes.extraLarge * 2, // 폰트 크기 비율에 맞게 약간 조절
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    position: 'absolute',
  },
  remainingText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    marginTop: 10,
    position: 'absolute',
    bottom: '20%',
  },
  obooniCharacterWrapper: {
    marginBottom: 30, // 여백 축소
  },
  obooniCharacter: {
    // --- 수정: 동적 크기 적용 ---
    width: characterSize,
    height: characterSize,
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
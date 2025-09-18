// src/screens/Analysis/DDayAnalysisView.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
// format 함수가 여기 임포트되어 있는지 확인!
// ✨ isValid 함수를 추가로 임포트합니다.
import { format, differenceInDays, isSameDay, startOfMonth, eachDayOfInterval, endOfMonth, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { FontAwesome5 } from '@expo/vector-icons';

// 공통 스타일 및 컴포넌트 임포트
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Button from '../../components/common/Button';
import CharacterImage from '../../components/common/CharacterImage';

// 캘린더 한국어 설정 (TaskCalendarScreen과 동일)
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';


const DDayAnalysisView = ({ isPremiumUser }) => {
  const navigation = useNavigation();
  const [isLocked, setIsLocked] = useState(!isPremiumUser);

  const [goalPhrase, setGoalPhrase] = useState('');
  
  // mockDDayGoal을 먼저 정의합니다.
  const mockDDayGoal = {
    phrase: '토익 900점 달성!',
    date: '2025-08-31', // 실제 데이터 로딩 시 이 부분이 유효한지 확인 필요
    totalConcentrationTime: 1250,
    currentAchievementRate: 75,
    dailyConcentration: {
      '2025-08-01': { minutes: 30 },
      '2025-08-05': { minutes: 90 },
      '2025-08-10': { minutes: 150 },
      '2025-08-15': { minutes: 60 },
      '2025-07-21': { minutes: 180 }, // 오늘 날짜 2025-07-21 이 포함되도록 예시 추가
      '2025-07-20': { minutes: 100 },
      '2025-07-19': { minutes: 75 },
    }
  };

  // dDayGoal 상태를 mockDDayGoal로 초기화합니다.
  const [dDayGoal, setDDayGoal] = useState(mockDDayGoal);

  // goalDate 상태를 dDayGoal.date를 기반으로 초기화하되, 유효성 검사를 수행합니다.
  // 이 부분은 초기 렌더링 시점에만 한 번 수행됩니다.
  const initialGoalDate = isValid(new Date(dDayGoal.date)) ? new Date(dDayGoal.date) : new Date();
  const [goalDate, setGoalDate] = useState(initialGoalDate);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // dDayGoal.date가 변경될 때마다 goalDate를 업데이트합니다.
  // 이 useEffect는 dDayGoal이 외부에서 변경될 때 goalDate도 동기화하기 위함입니다.
  useEffect(() => {
    const parsedDate = new Date(dDayGoal.date);
    if (isValid(parsedDate)) {
      setGoalDate(parsedDate);
    } else {
      console.warn("D-Day 목표 날짜가 유효하지 않습니다. 오늘 날짜로 대체합니다.", dDayGoal.date);
      setGoalDate(new Date()); // 유효하지 않으면 오늘 날짜로 대체
    }
  }, [dDayGoal.date]);


  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || goalDate;
    setShowDatePicker(false);
    // 날짜 선택기에서 선택된 날짜가 유효한지 확인 후 설정
    if (isValid(currentDate)) {
        setGoalDate(currentDate);
        // D-Day 목표 날짜도 업데이트해야 할 경우 여기에 추가
        // setDDayGoal(prev => ({ ...prev, date: format(currentDate, 'yyyy-MM-dd') }));
    } else {
        console.warn("날짜 선택기에서 유효하지 않은 날짜가 선택되었습니다.");
    }
  };

  const handleSetGoalPhrase = () => {
    Alert.alert('목표 문구 설정', '목표 문구를 설정하는 모달/화면으로 이동합니다.');
  };

  const handleStartPomodoro = () => {
    Alert.alert('포모도로 연동', '이 목표로 포모도로 기능을 시작합니다.');
  };

  const getMarkedDatesForCalendar = () => {
    const marked = {};
    // dDayGoal.date가 유효한 Date 객체인지 확인하고 사용합니다.
    // 유효하지 않으면 현재 날짜를 기본값으로 사용합니다.
    const baseDateForCalendar = isValid(new Date(dDayGoal.date)) ? new Date(dDayGoal.date) : new Date();

    const start = startOfMonth(baseDateForCalendar);
    const end = endOfMonth(baseDateForCalendar);

    // start와 end가 유효한 Date 객체인지 다시 한번 확인 (방어적 코딩)
    if (!isValid(start) || !isValid(end)) {
        console.error("캘린더 시작/종료 날짜가 유효하지 않습니다. 빈 캘린더 데이터를 반환합니다.");
        return {}; // 유효하지 않으면 빈 객체 반환
    }

    const daysInMonth = eachDayOfInterval({ start, end });

    daysInMonth.forEach(day => {
      // day가 유효한 Date 객체인지 확인
      if (!isValid(day)) {
        console.warn("캘린더 날짜 반복 중 유효하지 않은 날짜 객체 발견. 건너뜁니다:", day);
        return; // 유효하지 않으면 해당 날짜는 건너뛰기
      }

      const dayString = format(day, 'yyyy-MM-dd'); // 이 부분에서 `day`는 유효한 Date 객체여야 합니다.
      const minutes = dDayGoal.dailyConcentration[dayString]?.minutes || 0;
      let obooniImageSource = null;

      if (minutes > 0) {
        if (minutes < 60) {
          obooniImageSource = require('../../../assets/images/obooni_sad.png');
        } else if (minutes >= 60 && minutes < 120) {
          obooniImageSource = require('../../../assets/images/obooni_default.png');
        } else {
          obooniImageSource = require('../../../assets/images/obooni_happy.png');
        }
      }

      if (obooniImageSource) {
        marked[dayString] = {
          customStyles: {
            container: {
              backgroundColor: minutes > 120 ? Colors.accentApricot : (minutes > 60 ? Colors.secondaryBrown : Colors.primaryBeige),
              borderRadius: 5,
            },
            text: {
              color: minutes > 0 ? Colors.textLight : Colors.textDark,
            },
          },
          // dots에 obooniImageSource를 사용하는 것은 format 오류와 무관하지만,
          // 여기에서도 유효성 검사를 통해 안정성을 높일 수 있습니다.
          dots: [{ key: `obooni-${dayString}`, color: obooniImageSource ? Colors.accentApricot : 'transparent', selectedDotColor: 'transparent' }],
        };
      }
    });
    return marked;
  };


  if (isLocked) {
    return (
      <View style={styles.lockedContainer}>
        <FontAwesome5 name="lock" size={80} color={Colors.secondaryBrown} />
        <Text style={styles.lockedText}>이 기능은 유료 버전에서만 이용 가능합니다.</Text>
        <Button
          title="유료 버전 구매하기"
          onPress={() => Alert.alert('결제 유도', '유료 버전 구매 페이지로 이동합니다.')}
          style={styles.purchaseButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Text style={styles.sectionTitle}>목표 문구 설정</Text>
        <TouchableOpacity style={styles.goalPhraseButton} onPress={handleSetGoalPhrase}>
          <Text style={styles.goalPhraseText}>
            {dDayGoal.phrase || '달성하고자 하는 목표를 입력하세요'}
          </Text>
          <FontAwesome5 name="edit" size={18} color={Colors.secondaryBrown} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>목표 기간 설정</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>
            {/* goalDate는 useEffect에 의해 항상 유효한 Date 객체임을 가정합니다. */}
            {format(goalDate, 'yyyy년 MM월 dd일', { locale: ko })} {/* ✨ locale 추가 */}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={goalDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <Button title="시작하기" onPress={handleStartPomodoro} style={styles.startButton} />

        <Text style={styles.sectionTitle}>집중 목표</Text>
        <View style={styles.goalDisplayContainer}>
          <Text style={styles.goalDisplayText}>{dDayGoal.phrase}</Text>
          {/* dDayGoal.date가 유효한지 확인하고 D-Day를 계산합니다. */}
          <Text style={styles.dDayText}>
            D-{isValid(new Date(dDayGoal.date)) ? differenceInDays(new Date(dDayGoal.date), new Date()) : '날짜 오류'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>집중 요약</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>총 집중 시간</Text>
            <Text style={styles.statValue}>{dDayGoal.totalConcentrationTime || 0}분</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>현재까지 목표 달성율</Text>
            <Text style={styles.statValue}>{dDayGoal.currentAchievementRate || 0}%</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>캘린더 달성일</Text>
        <Calendar
          markingType={'custom'}
          markedDates={getMarkedDatesForCalendar()}
          theme={{
            backgroundColor: Colors.primaryBeige,
            calendarBackground: Colors.primaryBeige,
            textSectionTitleColor: Colors.secondaryBrown,
            selectedDayBackgroundColor: Colors.accentApricot,
            selectedDayTextColor: Colors.textLight,
            todayTextColor: Colors.accentApricot,
            dayTextColor: Colors.textDark,
            textDisabledColor: '#d9e1e8',
            dotColor: Colors.accentApricot,
            selectedDotColor: Colors.textLight,
            arrowColor: Colors.secondaryBrown,
            monthTextColor: Colors.textDark,
            textMonthFontWeight: FontWeights.bold,
            textMonthFontSize: FontSizes.large,
            textDayHeaderFontWeight: FontWeights.medium,
            textDayFontSize: FontSizes.medium,
            textDayFontWeight: FontWeights.regular,
          }}
          style={styles.calendar}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 0,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 10,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryBeige,
    paddingHorizontal: 20,
  },
  lockedText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.secondaryBrown,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  purchaseButton: {
    width: '80%',
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
  goalPhraseButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalPhraseText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    flex: 1,
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
  startButton: {
    width: '100%',
    marginTop: 30,
  },
  goalDisplayContainer: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  goalDisplayText: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  dDayText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.bold,
  },
  statsContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    fontWeight: FontWeights.medium,
  },
  statValue: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    fontWeight: FontWeights.bold,
  },
  calendar: {
    width: '100%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: Colors.textLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
});

export default DDayAnalysisView;
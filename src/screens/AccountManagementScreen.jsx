// src/screens/AccountManagementScreen.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import Header from '../components/common/Header';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';

const AccountManagementScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const handleEditProfile = () => {
    Alert.alert('회원정보 수정', '회원정보를 수정하는 화면으로 이동합니다.');
    // navigation.navigate('EditProfileScreen'); // 추후 구현
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => {
            // 로그인 화면으로 돌아가고, 이전 기록을 모두 삭제
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthChoice' }],
            });
          } 
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴', style: 'destructive', onPress: () => {
            console.log('회원 탈퇴 처리');
            // 탈퇴 후 로그인 화면으로 이동
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthChoice' }],
            });
          } 
        },
      ]
    );
  };

  const options = [
    { id: '1', name: '회원정보 수정', action: handleEditProfile },
    { id: '2', name: '로그아웃', action: handleLogout },
    { id: '3', name: '회원탈퇴', action: handleDeleteAccount, textStyle: { color: 'red' } },
  ];

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title="계정 관리" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.listContainer}>
          {options.map((item) => (
            <TouchableOpacity key={item.id} style={styles.settingItem} onPress={item.action}>
              <Text style={[styles.settingItemText, item.textStyle]}>{item.name}</Text>
              <FontAwesome5 name="chevron-right" size={18} color={Colors.secondaryBrown} />
            </TouchableOpacity>
          ))}
        </View>
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
    paddingTop: 10,
  },
  listContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    overflow: 'hidden', // borderBottomWidth가 컨테이너 밖으로 나가지 않도록
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryBeige,
  },
  settingItemText: {
    fontSize: FontSizes.medium,
    color: Colors.textDark,
  },
});

export default AccountManagementScreen;
// src/screens/SettingsScreen.jsx

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList, Image } from 'react-native';
import Header from '../components/common/Header';
import { Colors } from '../styles/color';
import { FontSizes, FontWeights } from '../styles/Fonts';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

const SettingsScreen = ({ isPremiumUser: initialIsPremiumUser }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const [isPremiumUser, setIsPremiumUser] = useState(initialIsPremiumUser || false);

  // --- 수정: '계정 관리' 옵션을 메뉴 리스트에서 제거 ---
  const settingsOptions = useMemo(() => ([
    { id: '1', name: t('settings.notification_settings'), screen: 'Reminder' },
    { id: '3', name: t('settings.obooni_customization'), screen: 'ObooniCustomization' },
    { id: '4', name: t('settings.terms_of_service'), screen: 'TermsOfService' },
    { id: '5', name: t('settings.privacy_policy'), screen: 'PrivacyPolicy' },
    { id: '6', name: t('settings.version_info'), screen: 'VersionInfo' },
  ]), [i18n.language]);

  const handleOptionPress = (option) => {
    if (option.screen === 'ObooniCustomization') {
      navigation.navigate('ObooniCustomization', { isPremiumUser: isPremiumUser });
    } else if (option.screen) {
      Alert.alert(t('alerts.navigate'), t('alerts.move_to_page', { name: option.name }));
    } else {
      Alert.alert(t('alerts.navigate'), t('alerts.feature_not_implemented', { name: option.name }));
    }
  };
  
  // --- 추가: 계정 관리 화면으로 이동하는 핸들러 ---
  const handleAccountManagement = () => {
    navigation.navigate('AccountManagement');
  };

  const renderSettingItem = ({ item }) => (
    <TouchableOpacity style={styles.settingItem} onPress={() => handleOptionPress(item)}>
      <Text style={styles.settingItemText}>{item.name}</Text>
      <FontAwesome5 name="chevron-right" size={18} color={Colors.secondaryBrown} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('settings.title')} showBackButton={true} />
      
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {/* --- 추가: 회원정보 프로필 섹션 --- */}
        <TouchableOpacity style={styles.profileContainer} onPress={handleAccountManagement}>
          <Image 
            source={require('../../assets/images/obooni_default.png')} // 프로필 이미지 예시
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>오분이</Text>
            <Text style={styles.profileEmail}>obooni@fivlo.com</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={18} color={Colors.secondaryBrown} />
        </TouchableOpacity>

        {/* --- 수정: 기존 FlatList를 View로 감싸서 UI 분리 --- */}
        <View style={styles.settingsListContainer}>
          <View style={styles.settingItem}>
            <Text style={styles.settingItemText}>{t('settings.language')}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => changeLanguage('ko')}>
                <Text style={[styles.settingItemText, { color: i18n.language === 'ko' ? Colors.accentApricot : Colors.textDark }]}>
                  {t('settings.language_korean')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeLanguage('en')}>
                <Text style={[styles.settingItemText, { color: i18n.language === 'en' ? Colors.accentApricot : Colors.textDark }]}>
                  {t('settings.language_english')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={settingsOptions}
            renderItem={renderSettingItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
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
    paddingBottom: 40,
    paddingTop: 10,
  },
  // --- 추가: 프로필 섹션 스타일 ---
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.large,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
  profileEmail: {
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
    marginTop: 5,
  },
  // --- 수정: 기존 리스트 컨테이너 이름 변경 ---
  settingsListContainer: {
    backgroundColor: Colors.textLight,
    borderRadius: 15,
    overflow: 'hidden', // borderBottomWidth가 컨테이너 밖으로 나가지 않도록
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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

export default SettingsScreen;
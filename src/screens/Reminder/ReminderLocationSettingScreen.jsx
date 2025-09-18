// src/screens/ReminderLocationSettingScreen.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
// import MapView from 'react-native-maps'; // 지도 기능을 위해 필요: npm install react-native-maps

// 공통 스타일 및 컴포넌트 임포트
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Colors } from '../../styles/color';
import { FontSizes, FontWeights } from '../../styles/Fonts';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const ReminderLocationSettingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { initialLocation, onLocationSelected } = route.params;

  const [locationName, setLocationName] = useState(initialLocation || '');
  const [addressInput, setAddressInput] = useState(''); // 주소 입력 칸
  const [mapRegion, setMapRegion] = useState({ // 지도 초기 위치 (임시)
    latitude: 35.8200, // 전주시 위도
    longitude: 127.1500, // 전주시 경도
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // "저장하기" 버튼 클릭
  const handleSaveLocation = () => {
    if (!locationName.trim() && !addressInput.trim()) {
      Alert.alert(t('reminder.location_required_title'), t('reminder.location_required_message'));
      return;
    }
    const finalLocation = locationName.trim() || addressInput.trim();
    if (onLocationSelected) {
      onLocationSelected(finalLocation);
    }
    Alert.alert(t('reminder.location_saved_title'), t('reminder.location_saved_message', { name: finalLocation }));
    navigation.goBack();
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 20 }]}>
      <Header title={t('reminder.location_setting')} showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {/* 장소 이름 입력 칸 */}
        <Text style={styles.sectionTitle}>{t('reminder.location_name_label')}</Text>
        <TextInput
          style={styles.inputField}
          placeholder={t('reminder.location_name_placeholder')}
          placeholderTextColor={Colors.secondaryBrown}
          value={locationName}
          onChangeText={setLocationName}
        />

        {/* 주소 입력 칸 */}
        <Text style={styles.sectionTitle}>{t('reminder.address_label')}</Text>
        <TextInput
          style={styles.inputField}
          placeholder={t('reminder.address_placeholder')}
          placeholderTextColor={Colors.secondaryBrown}
          value={addressInput}
          onChangeText={setAddressInput}
        />

        {/* 지도 표시 (플레이스홀더) */}
        <View style={styles.mapPlaceholder}>
          {/* <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion} // 지도 스크롤 시 위치 업데이트
          >
            <MapView.Circle
              center={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }}
              radius={100} // 반경 100m
              strokeColor={'rgba(0, 0, 255, 0.5)'}
              fillColor={'rgba(0, 0, 255, 0.2)'}
            />
          </MapView> */}
          <Text style={styles.mapPlaceholderText}>{t('reminder.map_placeholder')}</Text>
          <Text style={styles.mapPlaceholderText}>{t('reminder.map_placeholder_note')}</Text>
          <Text style={styles.mapRadiusText}>{t('reminder.map_radius')}</Text>
        </View>

        {/* 저장하기 버튼 */}
        <Button title={t('reminder.save_location')} onPress={handleSaveLocation} style={styles.saveButton} />
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
    alignItems: 'center',
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
  inputField: {
    width: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    padding: 15,
    fontSize: FontSizes.medium,
    color: Colors.textDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.textLight,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.secondaryBrown,
    position: 'relative',
  },
  mapPlaceholderText: {
    fontSize: FontSizes.medium,
    color: Colors.secondaryBrown,
    textAlign: 'center',
  },
  mapRadiusText: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: FontSizes.small,
    color: Colors.secondaryBrown,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    width: '100%',
  },
});

export default ReminderLocationSettingScreen;

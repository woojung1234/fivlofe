// App.js

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { initI18n } from './src/i18n';

// Firebase SDK 임포트 제거
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// 공통 스타일 및 폰트 임포트 (로딩 화면용)
import { Colors } from './src/styles/color';
import { FontSizes } from './src/styles/Fonts';
import { View, Text } from 'react-native'; // View, Text 임포트 (로딩 화면용)

// Canvas 환경에서 제공되는 전역 변수들 제거 (Firebase 관련)
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
// const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
// const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Firebase 앱 초기화 제거
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false); // 앱 준비 완료 상태 (Firebase 제거 후 이름 변경)
  // 개발 모드에서 유료 기능을 테스트할 수 있도록 isPremiumUser를 true로 설정합니다.
  const [isPremiumUser, setIsPremiumUser] = useState(true);

  useEffect(() => {
    // i18n 초기화 후 앱 준비
    (async () => {
      await initI18n();
      setIsAppReady(true);
    })();
  }, []);

  if (!isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primaryBeige }}>
        <Text style={{ fontSize: FontSizes.large, color: Colors.textDark }}>Loading...</Text>
      </View>
    );
  }

  // AppNavigator에 isPremiumUser만 전달 (Firebase props 제거)
  return <AppNavigator isPremiumUser={isPremiumUser} />;
}

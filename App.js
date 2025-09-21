// App.js

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { initI18n } from './src/i18n';
import { View, Text } from 'react-native';
import { Colors } from './src/styles/color';
import { FontSizes } from './src/styles/Fonts';

// ✨ [추가] 전역 상태 관리를 위해 authStore를 임포트합니다.
import useAuthStore from './src/store/authStore';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  
  // ✨ [수정] useState를 제거하고, authStore에서 isPremiumUser 상태를 직접 가져옵니다.
  const { isPremiumUser } = useAuthStore();

  useEffect(() => {
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

  // 이제 AppNavigator는 전역 스토어의 isPremiumUser 상태를 전달받습니다.
  return <AppNavigator isPremiumUser={isPremiumUser} />;
}
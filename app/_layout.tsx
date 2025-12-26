import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// RTL-aware wrapper component
function RTLWrapper({ children }: { children: React.ReactNode }) {
  const { isRTL, language } = useLanguage();
  const [key, setKey] = React.useState(0);
  
  React.useEffect(() => {
    // Ensure I18nManager is always in sync with current language
    const shouldBeRTL = language === 'ar';
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
      // Force re-render by updating key
      setKey(prev => prev + 1);
    }
  }, [isRTL, language]);

  return (
    <View key={key} style={[styles.rootContainer, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      {children}
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <LanguageProvider>
      <RTLWrapper>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="wishlistscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="essentialscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="profile" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="paymentscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="fatascreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="digitalidscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="hajjguidescreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="hajjstepdetail" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="hajjpermitscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="boardingscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="proxysacrificescreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="minatentscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="hotelstayscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="daydetailscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="daylistscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="trainticketscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="prayertimescreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="qiblascreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="explore" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="userrequestform" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="usermealsscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="servicefeedback" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="callsupport" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="votingscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="userannouncementscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="assignedpilgrimscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="contactadminscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="activitylogscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="worker/workerhomescreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="worker/workerrequestscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="worker/workeressentialscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="worker/workerannouncementscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="worker/workermealsscreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="worker/workerprofilescreen" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="worker/workergroupdashboardscreen" options={{ headerShown: false, animation: 'fade' }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </RTLWrapper>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});

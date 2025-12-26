import { useLanguage } from '@/contexts/LanguageContext';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import MaskedView from "@react-native-masked-view/masked-view";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    Modal,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const backgroundImage = require("@/assets/images/index.bg.jpg");
const logoImage = require("@/assets/images/logo.png");
const HERO_GRADIENT = ["#B82073", "#1B131F"] as const;
const LANGUAGE_SELECTED_KEY = '@hajjpath_language_selected';

export default function SplashScreen() {
  const router = useRouter();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const [fontsLoaded] = useFonts({
    "OpenSans-Bold": OpenSans_700Bold,
    "OpenSans-Regular": OpenSans_400Regular,
    "OpenSans-SemiBold": OpenSans_600SemiBold,
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  const handleGetStarted = async () => {
    try {
      const languageSelected = await AsyncStorage.getItem(LANGUAGE_SELECTED_KEY);
      if (!languageSelected) {
        // First time - show language modal
        setShowLanguageModal(true);
      } else {
        // Language already selected - go to login
        router.push("/login");
      }
    } catch (error) {
      console.error('Error checking language:', error);
      router.push("/login");
    }
  };

  const handleLanguageSelect = async (lang: 'en' | 'ar') => {
    try {
      await setLanguage(lang, false); // false = don't reload app
      await AsyncStorage.setItem(LANGUAGE_SELECTED_KEY, 'true');
      setShowLanguageModal(false);
      router.push("/login");
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  return (
    <View style={[styles.root, isRTL && { direction: 'rtl' }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.85)"] as const}
          style={styles.gradientOverlay}
        />

        <View style={styles.logoContainer}>
          <Image
            source={logoImage}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomSection}>
          <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>{t('auth.welcomeMessage')}</Text>
          <Text style={[styles.subtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('auth.subtitle')}
          </Text>

          <Pressable style={styles.button} onPress={handleGetStarted}>
            <GradientText text={t('auth.getStarted')} />
          </Pressable>
        </View>
      </ImageBackground>

      {/* Language Selection Modal - First Time Only */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <BlurView intensity={20} style={styles.blurOverlay}>
          <View style={[styles.languageModalContent, isRTL && { direction: 'rtl' }]}>
            <Text style={[styles.languageModalTitle, isRTL && { textAlign: 'right' }]}>
              {t('profile.selectLanguage')}
            </Text>
            <Text style={[styles.languageModalSubtitle, isRTL && { textAlign: 'right' }]}>
              {t('auth.selectLanguageSubtitle')}
            </Text>
            {[
              { key: 'en', label: t('profile.english') },
              { key: 'ar', label: t('profile.arabic') }
            ].map((lang) => (
              <TouchableOpacity
                key={lang.key}
                style={[
                  styles.languageOption,
                  language === lang.key && styles.languageOptionActive,
                  isRTL && { flexDirection: 'row-reverse' },
                ]}
                onPress={() => handleLanguageSelect(lang.key as 'en' | 'ar')}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === lang.key && styles.languageOptionTextActive,
                    isRTL && { textAlign: 'right' },
                  ]}
                >
                  {lang.label}
                </Text>
                {language === lang.key && (
                  <Ionicons name="checkmark" size={20} color="#B82073" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

function GradientText({ text }: { text: string }) {
  return (
    <MaskedView maskElement={<Text style={[styles.buttonText, styles.gradientMaskText]}>{text}</Text>}>
      <LinearGradient colors={HERO_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={[styles.buttonText, styles.gradientHiddenText]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logoImage: {
    width: 200,
    height: 140,
  },
  bottomSection: {
    paddingHorizontal: 25,
    paddingBottom: 68,
    width: "100%",
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    color: "#fff",
    fontFamily: "OpenSans-Bold",
    width: 288.84,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: "#F2E8F2",
    fontFamily: "OpenSans-Regular",
    width: 347.16,
    marginBottom: 32,
  },
  button: {
    height: 54,
    borderRadius: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "OpenSans-SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  gradientMaskText: {
    backgroundColor: "transparent",
  },
  gradientHiddenText: {
    opacity: 0,
  },
  blurOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  languageModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  languageModalTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 22,
    color: '#1B131F',
    marginBottom: 8,
    textAlign: 'center',
  },
  languageModalSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#F6F6F6',
    marginBottom: 12,
  },
  languageOptionActive: {
    backgroundColor: '#F5E1EB',
    borderWidth: 2,
    borderColor: '#B82073',
  },
  languageOptionText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#1B131F',
  },
  languageOptionTextActive: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#B82073',
  },
});
  
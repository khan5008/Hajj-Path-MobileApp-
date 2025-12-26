import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet as RNStyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const BG = '#F6F6F6';
const BORDER = '#E5E6E8';
const TEXT = '#1a1a1a';
const SUBTLE = '#8F8F8F';
const PINK = '#B40068';
const GRADIENT_START = '#A2156D';
const GRADIENT_END = '#1C0B27';

export default function LoginScreen() {
  const router = useRouter();
  const { t, isRTL, language, setLanguage } = useLanguage();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  
  // Email suggestions
  const emailSuggestions = ['user@sbs.com', 'worker@sbs.com'];
  const filteredSuggestions = React.useMemo(() => {
    if (email.length === 0) return [];
    return emailSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(email.toLowerCase())
    );
  }, [email]);

  // Show language modal on every reload
  useEffect(() => {
    // Small delay to ensure screen is rendered
    const timer = setTimeout(() => {
      setShowLanguageModal(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const goBack = () => router.back();
  const goHome = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Worker login
    if (trimmedEmail === 'worker@sbs.com' && trimmedPassword === '12345') {
      setError(null);
      router.push('/worker/workerhomescreen' as any);
      return;
    }

    // User login
    if (trimmedEmail === 'user@sbs.com' && trimmedPassword === '12345') {
      setError(null);
      router.push('/home');
      return;
    }

    // Invalid credentials – stay on screen
    setError(t('auth.loginError'));
  };
  const goSignup = () => router.push('/signup');

  return (
    <View style={styles.backgroundImage}>
      <SafeAreaView style={styles.safe}>
          <ScrollView
            contentContainerStyle={[styles.container, isRTL && { direction: 'rtl' }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <Pressable style={styles.backBtn} onPress={goBack}>
              <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={22} color="#1B131F" />
            </Pressable>

            <View style={styles.header}>
              <Image source={require('@/assets/images/logo.png')} style={styles.logo} />         
            </View>

        {/* Card */}
        <View style={styles.card}>
          {/* EMAIL */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('auth.email')}</Text>
            <View style={styles.emailInputWrapper}>
              <View style={[styles.inputRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="mail-outline" size={20} color={SUBTLE} style={[styles.inputIcon, isRTL && { marginRight: 0, marginLeft: 8 }]} />
                <TextInput
                  style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder={t('auth.email')}
                  placeholderTextColor={SUBTLE}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    // Show suggestions if there are matches
                    const matches = emailSuggestions.filter(s => 
                      s.toLowerCase().includes(text.toLowerCase()) && text.length > 0
                    );
                    setShowEmailSuggestions(matches.length > 0);
                  }}
                  onFocus={() => {
                    const matches = emailSuggestions.filter(s => 
                      s.toLowerCase().includes(email.toLowerCase()) && email.length > 0
                    );
                    setShowEmailSuggestions(matches.length > 0);
                  }}
                  onBlur={() => {
                    // Delay to allow suggestion click
                    setTimeout(() => setShowEmailSuggestions(false), 200);
                  }}
                />
              </View>
              {showEmailSuggestions && filteredSuggestions.length > 0 && (
                <View style={[styles.emailSuggestions, isRTL && { right: 0, left: 'auto' }]}>
                  {filteredSuggestions.slice(0, 2).map((suggestion, index, arr) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.emailSuggestionItem,
                        index === arr.length - 1 && styles.emailSuggestionItemLast
                      ]}
                      onPress={() => {
                        setEmail(suggestion);
                        setShowEmailSuggestions(false);
                      }}
                    >
                      <Ionicons name="mail" size={16} color={SUBTLE} style={styles.suggestionIcon} />
                      <Text style={styles.emailSuggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* PASSWORD / OTP */}
          <View style={styles.fieldContainer}>
            <View style={[styles.passwordLabelRow, isRTL && { flexDirection: 'row-reverse', justifyContent: 'space-between' }]}>
              <Text style={styles.label}>{t('auth.password')}</Text>
              <Pressable style={styles.otpBtnInline}>
                <Text style={styles.otpTextInline}>{t('common.send')}</Text>
              </Pressable>
            </View>
            <View style={[styles.inputRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="lock-closed-outline" size={20} color={SUBTLE} style={[styles.inputIcon, isRTL && { marginRight: 0, marginLeft: 8 }]} />
              <TextInput
                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={t('auth.password')}
                placeholderTextColor={SUBTLE}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={SUBTLE} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* FORGOT PASSWORD */}
          <Pressable style={[styles.forgotBtn, isRTL && { alignSelf: 'flex-start' }]}>
            <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
          </Pressable>

          {/* SIGN IN BUTTON */}
          <Pressable style={styles.primaryBtn} onPress={goHome}>
            <LinearGradient
              colors={[GRADIENT_START, GRADIENT_END]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryText}>{t('auth.loginButton')}</Text>
            </LinearGradient>
          </Pressable>

          {/* SIGN UP */}
          <Pressable style={styles.signupBtn} onPress={goSignup}>
            <Text style={styles.signupText}>
              {t('auth.dontHaveAccount')} <Text style={styles.signupBold}>{t('auth.signup')}</Text>
            </Text>
          </Pressable>
        </View>

            {/* FOOTER NOTE */}
            <Text style={styles.footerNote}>May Allah make your journey easy and accepted.</Text>
          </ScrollView>

      {/* Language Selection Modal - Shows on every reload */}
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
                onPress={async () => {
                  try {
                    await setLanguage(lang.key as 'en' | 'ar', false); // false = don't reload
                    setShowLanguageModal(false);
                  } catch (error) {
                    console.error('Error setting language:', error);
                  }
                }}
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
      </SafeAreaView>
    </View>
  );
}

const styles = RNStyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },

  backBtn: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E6E8',
  },

  logo: {
    width: 180,
    height: 70,
    alignSelf: 'center',
    marginBottom: 8,
  },

  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-SemiBold',
    textAlign: 'center',
    color: '#B82073',
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: SUBTLE,
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    marginBottom: 8,
    color: TEXT,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  input: {
    flex: 1,
    minHeight: 24,
    fontSize: 15,
    color: TEXT,
    fontFamily: 'PlusJakartaSans-Regular',
    paddingVertical: 0,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  inputIcon: {
    marginRight: 8,
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  emailInputWrapper: {
    position: 'relative',
  },
  emailSuggestions: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
    marginTop: 4,
  },
  emailSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F6F6',
  },
  emailSuggestionItemLast: {
    borderBottomWidth: 0,
  },
  suggestionIcon: {
    marginRight: 10,
  },
  emailSuggestionText: {
    fontSize: 14,
    color: TEXT,
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
  },

  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  otpBtnInline: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },

  otpTextInline: {
    color: PINK,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 4,
  },

  forgotText: {
    fontSize: 13,
    color: PINK,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  errorText: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
    color: PINK,
    fontFamily: 'PlusJakartaSans-Regular',
  },

  primaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: GRADIENT_START,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  primaryGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
  },

  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  signupBtn: {
    alignItems: 'center',
    marginBottom: 24,
  },

  signupText: {
    fontSize: 14,
    color: SUBTLE,
    fontFamily: 'PlusJakartaSans-Regular',
  },

  signupBold: {
    color: PINK,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
  },

  footerNote: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666666',
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 18,
    marginTop: 8,
  },
  blurOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  languageModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(184, 32, 115, 0.1)',
  },
  languageModalTitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 24,
    color: '#1B131F',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  languageModalSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    color: '#666666',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 22,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E5E6E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  languageOptionActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#B82073',
    shadowColor: '#B82073',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  languageOptionText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 17,
    color: '#1B131F',
    letterSpacing: 0.2,
  },
  languageOptionTextActive: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#B82073',
    fontSize: 17,
  },
});

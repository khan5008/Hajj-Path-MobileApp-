import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { Pressable, StyleSheet as RNStyleSheet, SafeAreaView, ScrollView, Text, View } from 'react-native';

const SURFACE = '#ffffff';
const BORDER = '#e5e5ea';
const PRIMARY_START = '#a2156d';
const PRIMARY_END = '#1c0b27';
const SECONDARY = '#3d3a5a';
const TEXT_PRIMARY = '#161616';
const TEXT_SUBTLE = '#62646c';

type SocialButtonProps = {
  icon: ReactElement;
  label: string;
  onPress: () => void;
};

function SocialButton({ icon, label, onPress }: SocialButtonProps) {
  return (
    <Pressable style={styles.socialButton} onPress={onPress}>
      <View style={styles.socialIcon}>{icon}</View>
      <Text style={styles.socialLabel}>{label}</Text>
    </Pressable>
  );
}

export default function SignUpScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const goHome = useCallback(() => {
    router.push('/home');
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, isRTL && { direction: 'rtl' }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color="#161616" />
          </Pressable>

          <View style={styles.headerBlock}>
            <Text style={styles.headerTitle}>{t('auth.signup')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('auth.subtitle')}
            </Text>
          </View>

          <View style={styles.socialBlock}>
            <SocialButton
              label={t('auth.continueWithApple')}
              onPress={goHome}
              icon={<Ionicons name="logo-apple" size={22} color={TEXT_PRIMARY} />}
            />
            <SocialButton
              label={t('auth.continueWithGoogle')}
              onPress={goHome}
              icon={<Ionicons name="logo-google" size={22} color={TEXT_PRIMARY} />}
            />
          </View>

          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>{t('common.or')}</Text>
            <View style={styles.separatorLine} />
          </View>

          <Pressable style={styles.primaryButton} onPress={goHome}>
            <LinearGradient
              colors={[PRIMARY_START, PRIMARY_END]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryLabel}>{t('auth.signupButton')}</Text>
            </LinearGradient>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={goHome}>
            <Text style={styles.secondaryLabel}>{t('auth.alreadyHaveAccount')} {t('auth.login')}</Text>
          </Pressable>

          <Text style={styles.termsText}>
            {t('auth.termsText')} <Text style={styles.termsLink}>{t('auth.terms')}</Text> {t('common.and')}{' '}
            <Text style={styles.termsLink}>{t('auth.privacyPolicy')}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = RNStyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    flexGrow: 1,
  },
  inner: {
    flex: 1,
  },
  backButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: '#f4f5f8',
  },
  headerBlock: {
    gap: 12,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: TEXT_SUBTLE,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  socialBlock: {
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: SURFACE,
  },
  socialIcon: {
    width: 28,
    alignItems: 'center',
  },
  socialLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: TEXT_PRIMARY,
  },
  separatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8e8ef',
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#8a8a96',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  primaryButton: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#00000044',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 20,
  },
  primaryGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  secondaryButton: {
    borderRadius: 28,
    backgroundColor: SECONDARY,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#9091a1',
    textAlign: 'center',
    paddingBottom: 16,
    marginTop: 'auto',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  termsLink: {
    color: PRIMARY_START,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});



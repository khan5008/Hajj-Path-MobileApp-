import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { I18nManager, NativeModules, Platform } from 'react-native';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language, shouldReload?: boolean) => Promise<void>;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = '@hajjpath_language';

// Import translations
const enTranslations = require('../locales/en.json');
const arTranslations = require('../locales/ar.json');

const translations: Record<Language, any> = {
  en: enTranslations,
  ar: arTranslations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        const isRTLValue = savedLanguage === 'ar';
        // Set I18nManager before state to ensure proper initialization
        if (I18nManager.isRTL !== isRTLValue) {
          I18nManager.forceRTL(isRTLValue);
          I18nManager.allowRTL(isRTLValue);
        }
        setLanguageState(savedLanguage as Language);
        setIsRTL(isRTLValue);
      } else {
        // Default to English
        I18nManager.forceRTL(false);
        I18nManager.allowRTL(false);
        setLanguageState('en');
        setIsRTL(false);
      }
    } catch (error) {
      console.error('Error loading language:', error);
      // Default to English on error
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      setLanguageState('en');
      setIsRTL(false);
    }
  };

  const changeLanguage = async (lang: Language, shouldReload: boolean = true) => {
    try {
      const isRTLValue = lang === 'ar';
      
      // Always update I18nManager first - this is critical
      I18nManager.forceRTL(isRTLValue);
      I18nManager.allowRTL(isRTLValue);
      
      // Update state
      setLanguageState(lang);
      setIsRTL(isRTLValue);
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      
      // Only reload app if shouldReload is true (default true for first time selection)
      if (shouldReload) {
        // Reload app for RTL to take full effect
        if (Platform.OS === 'android' && NativeModules.DevSettings) {
          NativeModules.DevSettings.reload();
        } else if (Platform.OS === 'ios') {
          // On iOS, we need to reload differently
          if (NativeModules.DevSettings) {
            NativeModules.DevSettings.reload();
          }
        } else {
          // Fallback: just log in development
          if (__DEV__) {
            console.log('RTL changed to:', isRTLValue, '- App reload may be needed');
          }
        }
      }
      // If shouldReload is false, components will re-render with new isRTL value
      // and the RTLWrapper will ensure I18nManager is synced
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}






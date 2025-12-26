import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterId = 'all' | 'breakfast' | 'lunch' | 'dinner';

type Meal = {
  id: string;
  title: string;
  time: string;
  items: string[];
  tag?: string;
  fromWorker?: boolean;
  fromAdmin?: boolean;
  sentAt?: string;
};

const USER_MEALS_KEY = '@hajjpath_user_meals';

export default function UserMealsScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [meals, setMeals] = useState<Meal[]>([]);

  const FILTER_TABS: { id: FilterId; label: string }[] = [
    { id: 'all', label: t('userMeals.all') },
    { id: 'breakfast', label: t('userMeals.breakfast') },
    { id: 'lunch', label: t('userMeals.lunch') },
    { id: 'dinner', label: t('userMeals.dinner') },
  ];

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  const loadMeals = async () => {
    try {
      const storedMeals = await AsyncStorage.getItem(USER_MEALS_KEY);
      if (storedMeals) {
        const userMeals = JSON.parse(storedMeals);
        setMeals(userMeals);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  useEffect(() => {
    loadMeals();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  if (!fontsLoaded) {
    return null;
  }

  const filteredMeals = activeFilter === 'all' 
    ? meals 
    : meals.filter(m => {
        const mealType = m.title.toLowerCase();
        return mealType.includes(activeFilter);
      });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('userMeals.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterTabsRow, isRTL && { flexDirection: 'row-reverse' }]}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveFilter(tab.id)}
                  activeOpacity={0.8}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#B82073', '#1B131F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.filterTabActive, isRTL && { marginRight: 0, marginLeft: 8 }]}
                    >
                      <View style={styles.filterTabActiveInner}>
                        <Text style={[styles.filterTabActiveText, isRTL && { textAlign: 'right' }]}>{tab.label}</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.filterTabInactive, isRTL && { marginRight: 0, marginLeft: 8 }]}>
                      <Text style={[styles.filterTabInactiveText, isRTL && { textAlign: 'right' }]}>{tab.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Meal Cards */}
          <View style={styles.mealsContainer}>
            {filteredMeals.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={48} color="#9A9A9A" />
                <Text style={[styles.emptyStateText, isRTL && { textAlign: 'right' }]}>{t('userMeals.noMealPlans')}</Text>
                <Text style={[styles.emptyStateSubtext, isRTL && { textAlign: 'right' }]}>{t('userMeals.mealPlansWillAppear')}</Text>
              </View>
            ) : (
              filteredMeals.map((meal) => (
                <MealCard key={meal.id} meal={meal} t={t} isRTL={isRTL} />
              ))
            )}
          </View>
        </ScrollView>

        <BottomTabs active="profile" />
      </View>
    </SafeAreaView>
  );
}

function MealCard({ meal, t, isRTL }: { meal: Meal; t: (key: string) => string; isRTL: boolean }) {
  return (
    <View style={styles.mealCard}>
      <View style={[styles.cardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.cardHeaderLeft, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{meal.title}</Text>
          {(meal.fromWorker || meal.fromAdmin) && (
            <View style={meal.fromWorker ? styles.sourceBadgeWorker : styles.sourceBadgeAdmin}>
              <Text style={[styles.sourceBadgeText, isRTL && { textAlign: 'right' }]}>
                {meal.fromWorker ? t('userMeals.fromWorker') : t('userMeals.fromAdmin')}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.cardTime, isRTL && { textAlign: 'right' }]}>{meal.time}</Text>
      </View>
      
      <View style={styles.itemsContainer}>
        {meal.items.map((item, index) => (
          <View key={index} style={[styles.itemRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="checkmark-circle" size={16} color="#952562" style={isRTL ? { marginLeft: 8, marginRight: 0 } : { marginRight: 8 }} />
            <Text style={[styles.itemText, isRTL && { textAlign: 'right' }]}>{item}</Text>
          </View>
        ))}
      </View>

      {meal.tag && (
        <View style={[styles.tagContainer, isRTL && { alignSelf: 'flex-end' }]}>
          <Text style={[styles.tagText, isRTL && { textAlign: 'right' }]}>{meal.tag}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F6F6F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  filterTabsRow: {
    gap: 12,
    paddingVertical: 4,
    marginBottom: 20,
  },
  filterTabActive: {
    borderRadius: 20,
    padding: 1.5,
    marginRight: 8,
  },
  filterTabActiveInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterTabActiveText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
  },
  filterTabInactive: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  filterTabInactiveText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#45455F',
  },
  mealsContainer: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#7A7A7A',
    marginTop: 8,
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#952562',
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
  },
  sourceBadgeWorker: {
    backgroundColor: '#952562',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sourceBadgeAdmin: {
    backgroundColor: '#1B131F',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sourceBadgeText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  cardTime: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#1B131F',
  },
  itemsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#1B131F',
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(184, 32, 115, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#952562',
  },
});



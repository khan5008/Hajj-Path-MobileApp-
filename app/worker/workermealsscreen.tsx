import WorkerBottomTabs from '@/components/worker-bottom-tabs';
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
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
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

const STORAGE_KEY = '@hajjpath_worker_meals';
const USER_MEALS_KEY = '@hajjpath_user_meals';
const MEAL_NOTIFICATION_KEY = '@hajjpath_new_meal';

const getDefaultMeals = (t: (key: string) => string): Meal[] => [
  {
    id: '1',
    title: t('workerMeals.defaultBreakfast'),
    time: t('workerMeals.defaultBreakfastTime'),
    items: t('workerMeals.defaultBreakfastItems').split(','),
    tag: t('workerMeals.defaultBreakfastTag'),
  },
  {
    id: '2',
    title: t('workerMeals.defaultLunch'),
    time: t('workerMeals.defaultLunchTime'),
    items: t('workerMeals.defaultLunchItems').split(','),
    tag: t('workerMeals.defaultLunchTag'),
  },
  {
    id: '3',
    title: t('workerMeals.defaultDinner'),
    time: t('workerMeals.defaultDinnerTime'),
    items: t('workerMeals.defaultDinnerItems').split(','),
    tag: t('workerMeals.defaultDinnerTag'),
  },
];

export default function WorkerMealsScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    title: '',
    time: '',
    items: '',
    tag: '',
  });

  const FILTER_TABS: { id: FilterId; label: string }[] = [
    { id: 'all', label: t('workerMeals.all') },
    { id: 'breakfast', label: t('workerMeals.breakfast') },
    { id: 'lunch', label: t('workerMeals.lunch') },
    { id: 'dinner', label: t('workerMeals.dinner') },
  ];

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  useEffect(() => {
    loadMeals();
  }, [t]);

  const loadMeals = async () => {
    try {
      const storedMeals = await AsyncStorage.getItem(STORAGE_KEY);
      const defaultMeals = getDefaultMeals(t);
      if (storedMeals) {
        const workerMeals = JSON.parse(storedMeals);
        setMeals([...workerMeals, ...defaultMeals.filter(
          dm => !workerMeals.find((wm: Meal) => wm.id === dm.id)
        )]);
      } else {
        setMeals(defaultMeals);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
      setMeals(getDefaultMeals(t));
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const filteredMeals = activeFilter === 'all' 
    ? meals 
    : meals.filter(m => {
        const mealType = m.title.toLowerCase();
        return mealType.includes(activeFilter);
      });

  const handleAddMeal = () => {
    if (!newMeal.title || !newMeal.time || !newMeal.items) {
      Alert.alert(t('workerMeals.error'), t('workerMeals.fillAllFields'));
      return;
    }

    const itemsArray = newMeal.items.split(',').map(item => item.trim()).filter(item => item);
    
    const meal: Meal = {
      id: Date.now().toString(),
      title: newMeal.title,
      time: newMeal.time,
      items: itemsArray,
      tag: newMeal.tag || undefined,
      fromWorker: true,
      sentAt: new Date().toISOString(),
    };

    const updatedMeals = [...meals, meal];
    setMeals(updatedMeals);
    
    // Save to storage
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeals.filter(m => m.fromWorker)));
    
    // Reset form
    setNewMeal({ title: '', time: '', items: '', tag: '' });
    setShowAddModal(false);
    
    Alert.alert(t('common.done'), t('workerMeals.mealAddedSuccess'));
  };

  const handleSendToUsers = async (meal: Meal) => {
    try {
      // Get existing user meals
      const existingUserMeals = await AsyncStorage.getItem(USER_MEALS_KEY);
      const userMeals = existingUserMeals ? JSON.parse(existingUserMeals) : [];
      
      // Add meal to user meals
      const mealForUser = {
        ...meal,
        fromWorker: true,
        sentAt: new Date().toISOString(),
      };
      userMeals.push(mealForUser);
      
      // Save to user meals
      await AsyncStorage.setItem(USER_MEALS_KEY, JSON.stringify(userMeals));
      
      // Set notification flag
      await AsyncStorage.setItem(MEAL_NOTIFICATION_KEY, 'true');
      await AsyncStorage.setItem('@hajjpath_meal_notification_data', JSON.stringify(mealForUser));
      
      Alert.alert(t('common.done'), t('workerMeals.mealSentSuccess'));
    } catch (error) {
      Alert.alert(t('workerMeals.error'), t('workerMeals.sendFailed'));
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('workerMeals.title')}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={20} color="#952562" />
          </TouchableOpacity>
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
                <Text style={[styles.emptyStateText, isRTL && { textAlign: 'right' }]}>{t('workerMeals.noMealsFound')}</Text>
              </View>
            ) : (
              filteredMeals.map((meal) => (
                <MealCard 
                  key={meal.id} 
                  meal={meal}
                  onSendToUsers={() => handleSendToUsers(meal)}
                  t={t}
                  isRTL={isRTL}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Add Meal Modal */}
        <Modal
          visible={showAddModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={[styles.modalHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.modalTitle, isRTL && { textAlign: 'right' }]}>{t('workerMeals.addNewMeal')}</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Ionicons name="close" size={24} color="#1B131F" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('workerMeals.mealType')}</Text>
                  <View style={[styles.inputContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="restaurant-outline" size={20} color="#7A7A7A" style={isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }} />
                    <TextInput
                      style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                      placeholder={t('workerMeals.mealTypePlaceholder')}
                      placeholderTextColor="#9A9A9A"
                      value={newMeal.title}
                      onChangeText={(text) => setNewMeal({ ...newMeal, title: text })}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('workerMeals.time')}</Text>
                  <View style={[styles.inputContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="time-outline" size={20} color="#7A7A7A" style={isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }} />
                    <TextInput
                      style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                      placeholder={t('workerMeals.timePlaceholder')}
                      placeholderTextColor="#9A9A9A"
                      value={newMeal.time}
                      onChangeText={(text) => setNewMeal({ ...newMeal, time: text })}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('workerMeals.items')}</Text>
                  <View style={[styles.inputContainer, styles.textAreaContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="list-outline" size={20} color="#7A7A7A" style={[styles.textAreaIcon, isRTL && { marginLeft: 12, marginRight: 0 }]} />
                    <TextInput
                      style={[styles.input, styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
                      placeholder={t('workerMeals.itemsPlaceholder')}
                      placeholderTextColor="#9A9A9A"
                      value={newMeal.items}
                      onChangeText={(text) => setNewMeal({ ...newMeal, items: text })}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('workerMeals.tag')}</Text>
                  <View style={[styles.inputContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="pricetag-outline" size={20} color="#7A7A7A" style={isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12 }} />
                    <TextInput
                      style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                      placeholder={t('workerMeals.tagPlaceholder')}
                      placeholderTextColor="#9A9A9A"
                      value={newMeal.tag}
                      onChangeText={(text) => setNewMeal({ ...newMeal, tag: text })}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.addMealButton} onPress={handleAddMeal}>
                  <LinearGradient
                    colors={['#B82073', '#1B131F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.addMealButtonGradient}
                  >
                    <Text style={[styles.addMealButtonText, isRTL && { textAlign: 'right' }]}>{t('workerMeals.addMeal')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <WorkerBottomTabs active="meals" />
      </View>
    </SafeAreaView>
  );
}

function MealCard({ meal, onSendToUsers, t, isRTL }: { meal: Meal; onSendToUsers: () => void; t: (key: string) => string; isRTL: boolean }) {
  return (
    <View style={styles.mealCard}>
      {meal.fromWorker && (
        <View style={[styles.workerBadge, isRTL && { left: 12, right: 'auto' }]}>
          <Text style={[styles.workerBadgeText, isRTL && { textAlign: 'right' }]}>{t('workerMeals.workerAdded')}</Text>
        </View>
      )}
      {meal.fromAdmin && (
        <View style={[styles.adminBadge, isRTL && { left: 12, right: 'auto' }]}>
          <Text style={[styles.adminBadgeText, isRTL && { textAlign: 'right' }]}>{t('workerMeals.fromAdmin')}</Text>
        </View>
      )}
      
      <View style={[styles.cardHeader, (meal.fromWorker || meal.fromAdmin) && styles.cardHeaderWithBadge, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{meal.title}</Text>
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

      {meal.fromWorker && (
        <TouchableOpacity style={styles.sendButton} onPress={onSendToUsers}>
          <LinearGradient
            colors={['#B82073', '#1B131F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.sendButtonGradient, isRTL && { flexDirection: 'row-reverse' }]}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" style={isRTL ? { marginLeft: 8, marginRight: 0 } : { marginRight: 8 }} />
            <Text style={[styles.sendButtonText, isRTL && { textAlign: 'right' }]}>{t('workerMeals.sendToUsers')}</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#F6F6F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#9A9A9A',
    marginTop: 12,
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
    position: 'relative',
  },
  workerBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#952562',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  workerBadgeText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  adminBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#1B131F',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  adminBadgeText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderWithBadge: {
    marginTop: 8,
  },
  cardTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
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
    marginBottom: 12,
  },
  tagText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#952562',
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  sendButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#1B131F',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  input: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: '#1B131F',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textAreaIcon: {
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 0,
  },
  addMealButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  addMealButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMealButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});








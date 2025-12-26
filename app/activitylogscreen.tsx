import { useLanguage } from '@/contexts/LanguageContext';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getActivities = (t: any) => [
  {
    id: '1',
    action: t('activityLog.activity1.action'),
    description: t('activityLog.activity1.description'),
    timestamp: t('activityLog.activity1.timestamp'),
    type: 'request',
  },
  {
    id: '2',
    action: t('activityLog.activity2.action'),
    description: t('activityLog.activity2.description'),
    timestamp: t('activityLog.activity2.timestamp'),
    type: 'meal',
  },
  {
    id: '3',
    action: t('activityLog.activity3.action'),
    description: t('activityLog.activity3.description'),
    timestamp: t('activityLog.activity3.timestamp'),
    type: 'announcement',
  },
  {
    id: '4',
    action: t('activityLog.activity4.action'),
    description: t('activityLog.activity4.description'),
    timestamp: t('activityLog.activity4.timestamp'),
    type: 'checkin',
  },
];

export default function ActivityLogScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const activities = getActivities(t);

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'request':
        return 'document-text-outline';
      case 'meal':
        return 'restaurant-outline';
      case 'announcement':
        return 'megaphone-outline';
      case 'checkin':
        return 'checkmark-circle-outline';
      default:
        return 'ellipse-outline';
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isRTL && { marginRight: 0, marginLeft: 12 }]}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('activityLog.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {activities.map((activity, index) => (
            <View key={activity.id} style={[styles.activityCard, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.activityLeft}>
                <View style={styles.activityIconContainer}>
                  <Ionicons name={getActivityIcon(activity.type) as any} size={20} color="#952562" />
                </View>
                {index < activities.length - 1 && <View style={styles.activityLine} />}
              </View>
              <View style={[styles.activityContent, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={[styles.activityAction, isRTL && { textAlign: 'right' }]}>{activity.action}</Text>
                <Text style={[styles.activityDescription, isRTL && { textAlign: 'right' }]}>{activity.description}</Text>
                <Text style={[styles.activityTime, isRTL && { textAlign: 'right' }]}>{activity.timestamp}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
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
  activityCard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  activityLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(184, 32, 115, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E8E8E8',
    marginTop: 8,
    minHeight: 40,
  },
  activityContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityAction: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 15,
    color: '#1B131F',
    marginBottom: 6,
  },
  activityDescription: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#4C4C4C',
    marginBottom: 8,
    lineHeight: 18,
  },
  activityTime: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#7A7A7A',
  },
});






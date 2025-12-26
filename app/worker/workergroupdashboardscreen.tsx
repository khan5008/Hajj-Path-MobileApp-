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

export default function WorkerGroupDashboardScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.container}>
          {/* Header */}
          <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isRTL && { marginRight: 0, marginLeft: 12 }]}>
              <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#1B131F" />
            </TouchableOpacity>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Overview Stats */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="people-outline" size={24} color="#952562" />
              </View>
              <View style={[styles.statContent, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={[styles.statValue, isRTL && { textAlign: 'right' }]}>45</Text>
                <Text style={[styles.statLabel, isRTL && { textAlign: 'right' }]}>{t('workerHome.assigned')} {t('workerProfile.groupOverview.pilgrimCheckIn')}</Text>
              </View>
            </View>

            <View style={[styles.statCard, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
              </View>
              <View style={[styles.statContent, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={[styles.statValue, isRTL && { textAlign: 'right' }]}>37</Text>
                <Text style={[styles.statLabel, isRTL && { textAlign: 'right' }]}>{t('workerProfile.groupOverview.pilgrimCheckIn')}</Text>
              </View>
            </View>

            <View style={[styles.statCard, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.statIconContainer}>
                <Ionicons name="document-text-outline" size={24} color="#FF9800" />
              </View>
              <View style={[styles.statContent, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={[styles.statValue, isRTL && { textAlign: 'right' }]}>12</Text>
                <Text style={[styles.statLabel, isRTL && { textAlign: 'right' }]}>{t('workerProfile.groupOverview.requestResponses')}</Text>
              </View>
            </View>
          </View>

          {/* Group Details */}
          <View style={styles.detailsCard}>
            <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('workerHome.yourPilgrimGroup')}</Text>
            <View style={styles.detailsRow}>
              <Text style={[styles.detailLabel, isRTL && { textAlign: 'right' }]}>{t('workerHome.tent')}:</Text>
              <Text style={[styles.detailValue, isRTL && { textAlign: 'right' }]}>#3</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={[styles.detailLabel, isRTL && { textAlign: 'right' }]}>{t('workerHome.bus')}:</Text>
              <Text style={[styles.detailValue, isRTL && { textAlign: 'right' }]}>A - {t('workerHome.gate')} 4</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={[styles.detailLabel, isRTL && { textAlign: 'right' }]}>{t('workerHome.healthAlerts')}:</Text>
              <Text style={[styles.detailValue, isRTL && { textAlign: 'right' }]}>2</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsCard}>
            <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('workerHome.quickActions')}</Text>
            <TouchableOpacity 
              style={[styles.actionButton, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => router.push('/worker/workerrequestscreen')}
            >
              <Ionicons name="document-text-outline" size={20} color="#952562" />
              <Text style={[styles.actionButtonText, isRTL && { textAlign: 'right' }]}>{t('workerHome.requests')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => router.push('/worker/workerannouncementscreen')}
            >
              <Ionicons name="megaphone-outline" size={20} color="#952562" />
              <Text style={[styles.actionButtonText, isRTL && { textAlign: 'right' }]}>{t('workerHome.announcements')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => router.push('/assignedpilgrimscreen')}
            >
              <Ionicons name="people-outline" size={20} color="#952562" />
              <Text style={[styles.actionButtonText, isRTL && { textAlign: 'right' }]}>{t('workerProfile.account.assignedPilgrim')}</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerSpacer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  statsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(149, 37, 98, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#1B131F',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#7A7A7A',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#1B131F',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#7A7A7A',
  },
  detailValue: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#1B131F',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    marginBottom: 12,
  },
  actionButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#1B131F',
    marginLeft: 12,
  },
});


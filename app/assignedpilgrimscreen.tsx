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
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getPilgrims = (t: any) => [
  {
    id: '1',
    name: t('assignedPilgrim.pilgrim1.name'),
    tent: t('assignedPilgrim.pilgrim1.tent'),
    bus: t('assignedPilgrim.pilgrim1.bus'),
    status: t('assignedPilgrim.checkedIn'),
    image: require('@/assets/images/profilepic.png'),
  },
  {
    id: '2',
    name: t('assignedPilgrim.pilgrim2.name'),
    tent: t('assignedPilgrim.pilgrim2.tent'),
    bus: t('assignedPilgrim.pilgrim2.bus'),
    status: t('assignedPilgrim.checkedIn'),
    image: require('@/assets/images/profilepic.png'),
  },
  {
    id: '3',
    name: t('assignedPilgrim.pilgrim3.name'),
    tent: t('assignedPilgrim.pilgrim3.tent'),
    bus: t('assignedPilgrim.pilgrim3.bus'),
    status: t('assignedPilgrim.pending'),
    image: require('@/assets/images/profilepic.png'),
  },
];

export default function AssignedPilgrimScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const pilgrims = getPilgrims(t);

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isRTL && { marginRight: 0, marginLeft: 12 }]}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('assignedPilgrim.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {pilgrims.map((pilgrim) => (
            <View key={pilgrim.id} style={[styles.pilgrimCard, isRTL && { flexDirection: 'row-reverse' }]}>
              <Image source={pilgrim.image} style={[styles.pilgrimImage, isRTL && { marginRight: 0, marginLeft: 12 }]} />
              <View style={[styles.pilgrimInfo, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={[styles.pilgrimName, isRTL && { textAlign: 'right' }]}>{pilgrim.name}</Text>
                <View style={styles.pilgrimDetails}>
                  <View style={[styles.detailRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="home-outline" size={16} color="#952562" />
                    <Text style={[styles.detailText, isRTL && { marginLeft: 0, marginRight: 6, textAlign: 'right' }]}>{pilgrim.tent}</Text>
                  </View>
                  <View style={[styles.detailRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="bus-outline" size={16} color="#952562" />
                    <Text style={[styles.detailText, isRTL && { marginLeft: 0, marginRight: 6, textAlign: 'right' }]}>{pilgrim.bus}</Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  pilgrim.status === t('assignedPilgrim.checkedIn') ? styles.statusBadgeActive : styles.statusBadgePending
                ]}>
                  <Text style={[
                    styles.statusText,
                    pilgrim.status === t('assignedPilgrim.checkedIn') ? styles.statusTextActive : styles.statusTextPending
                  ]}>
                    {pilgrim.status}
                  </Text>
                </View>
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
    fontFamily: 'OpenSans-SemiBold',
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
  pilgrimCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: 16,
  },
  pilgrimImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  pilgrimInfo: {
    flex: 1,
  },
  pilgrimName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    marginBottom: 8,
  },
  pilgrimDetails: {
    gap: 6,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#7A7A7A',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgePending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
  },
  statusTextActive: {
    color: '#4CAF50',
  },
  statusTextPending: {
    color: '#FF9800',
  },
});







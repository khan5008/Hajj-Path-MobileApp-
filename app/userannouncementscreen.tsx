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
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterId = 'all' | 'admin' | 'worker';

type Announcement = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  priority: 'urgent' | 'normal';
  isRead: boolean;
  fullContent: string;
  source: 'admin' | 'worker';
  workerName?: string;
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Bus Departure Updated',
    description: 'Group A will be at 5:30 pm from gate 4. Please ensure all pilgrims are ready.',
    timestamp: '2 hours ago',
    priority: 'urgent',
    isRead: false,
    fullContent: 'Bus Departure Updated\n\nGroup A will be at 5:30 pm from gate 4. Please ensure all pilgrims are ready and have their boarding passes. The bus will depart promptly at 5:30 pm. Late arrivals will not be accommodated.',
    source: 'admin',
  },
  {
    id: '2',
    title: 'Zam Zam Distribution',
    description: 'Bottle will be given after Asar prayer at Tent B. Please coordinate with your group.',
    timestamp: '5 hours ago',
    priority: 'normal',
    isRead: true,
    fullContent: 'Zam Zam Distribution\n\nBottle will be given after Asar prayer at Tent B. Please coordinate with your group members and ensure everyone receives their allocation. Distribution will start at 4:00 PM.',
    source: 'admin',
  },
];

// Filter tabs will be created in component to use translations
const getFilterTabs = (t: any): { id: FilterId; label: string }[] => [
  { id: 'all', label: t('announcements.all') },
  { id: 'admin', label: t('announcements.admin') },
  { id: 'worker', label: t('announcements.worker') },
];

const STORAGE_KEY = '@hajjpath_user_announcements';

export default function UserAnnouncementScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  useFocusEffect(
    useCallback(() => {
      loadAnnouncements();
    }, [])
  );

  const loadAnnouncements = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const workerAnnouncements = JSON.parse(stored);
        setAnnouncements([...workerAnnouncements, ...DEFAULT_ANNOUNCEMENTS]);
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const filteredAnnouncements = activeFilter === 'all' 
    ? announcements 
    : announcements.filter(a => a.source === activeFilter);

  const handleMarkAsRead = async (id: string) => {
    const updated = announcements.map(a => 
      a.id === id ? { ...a, isRead: true } : a
    );
    setAnnouncements(updated);
    // Save to storage
    const workerOnly = updated.filter(a => a.source === 'worker');
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workerOnly));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('announcements.title')}</Text>
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
            {getFilterTabs(t).map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveFilter(tab.id)}
                  activeOpacity={0.8}
                >
                  {isActive ? (
                    <View style={styles.filterTabActive}>
                      <Text style={styles.filterTabActiveText}>{tab.label}</Text>
                    </View>
                  ) : (
                    <View style={styles.filterTabInactive}>
                      <Text style={styles.filterTabInactiveText}>{tab.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Announcement Cards */}
          <View style={styles.announcementsContainer}>
            {filteredAnnouncements.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="megaphone-outline" size={48} color="#9A9A9A" />
                <Text style={styles.emptyStateText}>{t('announcements.noAnnouncements')}</Text>
              </View>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onMarkAsRead={() => handleMarkAsRead(announcement.id)}
                  onOpenDetail={() => {
                    setSelectedAnnouncement(announcement);
                    setShowDetailModal(true);
                    handleMarkAsRead(announcement.id);
                  }}
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Detail Modal */}
        <Modal
          visible={showDetailModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDetailModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedAnnouncement && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalHeaderLeft}>
                      <View
                        style={[
                          styles.priorityBadge,
                          selectedAnnouncement.priority === 'urgent'
                            ? styles.priorityBadgeUrgent
                            : styles.priorityBadgeNormal,
                        ]}
                      >
                        <Text
                          style={[
                            styles.priorityBadgeText,
                            selectedAnnouncement.priority === 'urgent'
                              ? styles.priorityBadgeTextUrgent
                              : styles.priorityBadgeTextNormal,
                          ]}
                        >
                          {selectedAnnouncement.priority === 'urgent' ? t('announcements.urgent') : t('announcements.normal')}
                        </Text>
                      </View>
                      <Text style={styles.modalSource}>
                        {selectedAnnouncement.source === 'admin' ? t('announcements.fromAdmin') : t('announcements.fromWorker').replace('{name}', selectedAnnouncement.workerName || t('announcements.worker'))}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                      <Ionicons name="close" size={24} color="#1B131F" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalTitle}>{selectedAnnouncement.title}</Text>
                  <Text style={styles.modalTime}>
                    <Ionicons name="time-outline" size={14} color="#952562" /> {selectedAnnouncement.timestamp}
                  </Text>
                  <Text style={styles.modalContentText}>{selectedAnnouncement.fullContent}</Text>
                </>
              )}
            </View>
          </View>
        </Modal>

        <BottomTabs active="profile" />
      </View>
    </SafeAreaView>
  );
}

function AnnouncementCard({
  announcement,
  onMarkAsRead,
  onOpenDetail,
}: {
  announcement: Announcement;
  onMarkAsRead: () => void;
  onOpenDetail: () => void;
}) {
  return (
    <View style={styles.announcementCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          {!announcement.isRead && <View style={styles.unreadDot} />}
          <Text style={styles.cardTitle}>{announcement.title}</Text>
        </View>
        <View
          style={[
            styles.priorityBadge,
            announcement.priority === 'urgent'
              ? styles.priorityBadgeUrgent
              : styles.priorityBadgeNormal,
          ]}
        >
          <Text
            style={[
              styles.priorityBadgeText,
              announcement.priority === 'urgent'
                ? styles.priorityBadgeTextUrgent
                : styles.priorityBadgeTextNormal,
            ]}
          >
            {announcement.priority === 'urgent' ? t('announcements.urgent') : t('announcements.normal')}
          </Text>
        </View>
      </View>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {announcement.description}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.cardFooterLeft}>
          <Ionicons name="time-outline" size={14} color="#952562" />
          <Text style={styles.cardTime}>{announcement.timestamp}</Text>
          <Text style={styles.cardSource}>
            • {announcement.source === 'admin' ? t('announcements.admin') : announcement.workerName || t('announcements.worker')}
          </Text>
        </View>
        <View style={styles.cardFooterRight}>
          {!announcement.isRead && (
            <TouchableOpacity style={styles.markReadButton} onPress={onMarkAsRead}>
              <Text style={styles.markReadText}>{t('announcements.markAsRead')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.viewDetailButton} onPress={onOpenDetail}>
            <Text style={styles.viewDetailText}>View Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  headerSpacer: {
    width: 40,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#952562',
    marginRight: 8,
  },
  filterTabActiveText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
  },
  filterTabInactive: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
  },
  filterTabInactiveText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#45455F',
  },
  announcementsContainer: {
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
  announcementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#952562',
  },
  cardTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: '#1B131F',
    flex: 1,
  },
  cardDescription: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#4C4C4C',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  cardTime: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#7A7A7A',
  },
  cardSource: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#952562',
  },
  cardFooterRight: {
    flexDirection: 'row',
    gap: 12,
  },
  markReadButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
  },
  markReadText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#952562',
  },
  viewDetailButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#952562',
  },
  viewDetailText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeUrgent: {
    backgroundColor: '#FFE5E5',
  },
  priorityBadgeNormal: {
    backgroundColor: '#E8F5E9',
  },
  priorityBadgeText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 11,
  },
  priorityBadgeTextUrgent: {
    color: '#FF3B30',
  },
  priorityBadgeTextNormal: {
    color: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalSource: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#7A7A7A',
  },
  modalTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
    marginBottom: 8,
  },
  modalTime: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#7A7A7A',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalContentText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#4C4C4C',
    lineHeight: 22,
  },
});




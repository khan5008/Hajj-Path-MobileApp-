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
import React, { useState } from 'react';
import {
    Keyboard,
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

type FilterId = 'all' | 'admin' | 'sentby';

type Announcement = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  priority: 'urgent' | 'normal';
  isRead: boolean;
  fullContent: string;
  source?: 'admin' | 'worker';
  workerName?: string;
};

const getAnnouncements = (t: any): Announcement[] => [
  {
    id: '1',
    title: t('workerAnnouncements.announcement1.title'),
    description: t('workerAnnouncements.announcement1.description'),
    timestamp: t('workerAnnouncements.announcement1.timestamp'),
    priority: 'urgent',
    isRead: false,
    fullContent: t('workerAnnouncements.announcement1.fullContent'),
  },
  {
    id: '2',
    title: t('workerAnnouncements.announcement2.title'),
    description: t('workerAnnouncements.announcement2.description'),
    timestamp: t('workerAnnouncements.announcement2.timestamp'),
    priority: 'normal',
    isRead: true,
    fullContent: t('workerAnnouncements.announcement2.fullContent'),
  },
  {
    id: '3',
    title: t('workerAnnouncements.announcement3.title'),
    description: t('workerAnnouncements.announcement3.description'),
    timestamp: t('workerAnnouncements.announcement3.timestamp'),
    priority: 'normal',
    isRead: false,
    fullContent: t('workerAnnouncements.announcement3.fullContent'),
  },
  {
    id: '4',
    title: t('workerAnnouncements.announcement4.title'),
    description: t('workerAnnouncements.announcement4.description'),
    timestamp: t('workerAnnouncements.announcement4.timestamp'),
    priority: 'urgent',
    isRead: true,
    fullContent: t('workerAnnouncements.announcement4.fullContent'),
  },
];

const getFilterTabs = (t: any): { id: FilterId; label: string; icon?: string }[] => [
  { id: 'all', label: t('workerAnnouncements.all'), icon: 'people-outline' },
  { id: 'admin', label: t('workerAnnouncements.admin') },
  { id: 'sentby', label: t('workerAnnouncements.sentBy'), icon: 'paper-plane-outline' },
];

const STORAGE_KEY = '@hajjpath_user_announcements';
const USER_NOTIFICATION_KEY = '@hajjpath_user_announcement_notification';

export default function WorkerAnnouncementScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [announcements, setAnnouncements] = useState(() => getAnnouncements(t));
  
  // Update announcements when language changes
  React.useEffect(() => {
    setAnnouncements(getAnnouncements(t));
  }, [t]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    fullContent: '',
    priority: 'normal' as 'urgent' | 'normal',
  });

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const filteredAnnouncements = activeFilter === 'all' 
    ? announcements 
    : announcements; // Filter logic can be added later

  const unreadCount = announcements.filter(a => !a.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setAnnouncements(prev => 
      prev.map(a => a.id === id ? { ...a, isRead: true } : a)
    );
  };

  const handleOpenDetail = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
    if (!announcement.isRead) {
      handleMarkAsRead(announcement.id);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{t('workerAnnouncements.title')}</Text>
          <TouchableOpacity 
            style={styles.newAnnouncementButton}
            onPress={() => setShowCreateModal(true)}
          >
            <LinearGradient
              colors={['#B82073', '#1B131F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newAnnouncementButtonGradient}
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Push Alert Banner */}
          {unreadCount > 0 && (
              <LinearGradient
                colors={['rgba(184, 32, 115, 0.15)', 'rgba(184, 32, 115, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.alertBanner, isRTL && { flexDirection: 'row-reverse' }]}
              >
                <Ionicons name="notifications" size={20} color="#952562" />
                <Text style={[styles.alertText, isRTL && { marginLeft: 0, marginRight: 8, textAlign: 'right' }]}>
                  {unreadCount === 1 
                    ? `${t('workerAnnouncements.youHave')} ${unreadCount} ${t('workerAnnouncements.unreadAnnouncement')}`
                    : `${t('workerAnnouncements.youHave')} ${unreadCount} ${t('workerAnnouncements.unreadAnnouncements')}`
                  }
                </Text>
              </LinearGradient>
          )}

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTabsRow}
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
                    <LinearGradient
                      colors={['#B82073', '#1B131F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.filterTabActive}
                    >
                      <View style={styles.filterTabActiveInner}>
                        {tab.icon && <Ionicons name={tab.icon as any} size={16} color="#FFFFFF" />}
                        <Text style={styles.filterTabActiveText}>{tab.label}</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.filterTabInactive}>
                      {tab.icon && <Ionicons name={tab.icon as any} size={16} color="#45455F" />}
                      <Text style={styles.filterTabInactiveText}>{tab.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Announcement Cards */}
          <View style={styles.announcementsContainer}>
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard 
                key={announcement.id} 
                announcement={announcement}
                onMarkAsRead={() => handleMarkAsRead(announcement.id)}
                onOpenDetail={() => handleOpenDetail(announcement)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Detail Modal */}
        <Modal
          visible={showDetailModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDetailModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={[styles.modalHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.modalTitle, isRTL && { textAlign: 'right' }]}>{selectedAnnouncement?.title}</Text>
                <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                  <Ionicons name="close" size={24} color="#1B131F" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <View style={[styles.modalMeta, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={styles.modalBadgeContainer}>
                    <View style={[
                      styles.priorityBadge,
                      selectedAnnouncement?.priority === 'urgent' ? styles.priorityBadgeUrgent : styles.priorityBadgeNormal
                    ]}>
                      <Text style={styles.priorityBadgeText}>
                        {selectedAnnouncement?.priority === 'urgent' ? t('workerAnnouncements.urgent') : t('workerAnnouncements.normal')}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.modalTimestamp, isRTL && { textAlign: 'right' }]}>{selectedAnnouncement?.timestamp}</Text>
                </View>
                <Text style={[styles.modalFullContent, isRTL && { textAlign: 'right' }]}>{selectedAnnouncement?.fullContent}</Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Create Announcement Modal */}
        <Modal
          visible={showCreateModal}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setShowCreateModal(false);
            setNewAnnouncement({ title: '', description: '', fullContent: '', priority: 'normal' });
          }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <TouchableOpacity
              style={styles.createModalContent}
              activeOpacity={1}
              onPress={(e) => {
                e.stopPropagation();
                Keyboard.dismiss();
              }}
            >
              <View style={[styles.createModalHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.createModalTitle, isRTL && { textAlign: 'right' }]}>{t('workerAnnouncements.createAnnouncement')}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowCreateModal(false);
                    setNewAnnouncement({ title: '', description: '', fullContent: '', priority: 'normal' });
                  }}
                >
                  <Ionicons name="close" size={24} color="#1B131F" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.createModalLabel, isRTL && { textAlign: 'right' }]}>{t('workerAnnouncements.announcementTitle')}:</Text>
              <TextInput
                style={[styles.createModalInput, isRTL && { textAlign: 'right' }]}
                placeholder={t('workerAnnouncements.titlePlaceholder')}
                placeholderTextColor="#9A9A9A"
                value={newAnnouncement.title}
                onChangeText={(text) => setNewAnnouncement({ ...newAnnouncement, title: text })}
              />

              <Text style={[styles.createModalLabel, isRTL && { textAlign: 'right' }]}>{t('workerAnnouncements.announcementDescription')}:</Text>
              <TextInput
                style={[styles.createModalInput, isRTL && { textAlign: 'right' }]}
                placeholder={t('workerAnnouncements.descriptionPlaceholder')}
                placeholderTextColor="#9A9A9A"
                value={newAnnouncement.description}
                onChangeText={(text) => setNewAnnouncement({ ...newAnnouncement, description: text })}
              />

              <Text style={[styles.createModalLabel, isRTL && { textAlign: 'right' }]}>{t('workerAnnouncements.fullContent')}:</Text>
              <TextInput
                style={[styles.createModalInput, styles.createModalTextArea, isRTL && { textAlign: 'right' }]}
                placeholder={t('workerAnnouncements.fullContentPlaceholder')}
                placeholderTextColor="#9A9A9A"
                multiline
                numberOfLines={6}
                value={newAnnouncement.fullContent}
                onChangeText={(text) => setNewAnnouncement({ ...newAnnouncement, fullContent: text })}
              />

              <Text style={[styles.createModalLabel, isRTL && { textAlign: 'right' }]}>{t('workerAnnouncements.priority')}:</Text>
              <View style={[styles.priorityButtons, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    newAnnouncement.priority === 'normal' && styles.priorityButtonActive,
                  ]}
                  onPress={() => setNewAnnouncement({ ...newAnnouncement, priority: 'normal' })}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      newAnnouncement.priority === 'normal' && styles.priorityButtonTextActive,
                      isRTL && { textAlign: 'right' },
                    ]}
                  >
                    {t('workerAnnouncements.normal')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    newAnnouncement.priority === 'urgent' && styles.priorityButtonActive,
                  ]}
                  onPress={() => setNewAnnouncement({ ...newAnnouncement, priority: 'urgent' })}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      newAnnouncement.priority === 'urgent' && styles.priorityButtonTextActive,
                      isRTL && { textAlign: 'right' },
                    ]}
                  >
                    {t('workerAnnouncements.urgent')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.createModalButtons, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity
                  style={styles.createModalCancelButton}
                  onPress={() => {
                    setShowCreateModal(false);
                    setNewAnnouncement({ title: '', description: '', fullContent: '', priority: 'normal' });
                  }}
                >
                  <Text style={styles.createModalCancelText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createModalSendButton}
                  onPress={async () => {
                    if (newAnnouncement.title.trim() && newAnnouncement.description.trim()) {
                      const announcement: Announcement = {
                        id: Date.now().toString(),
                        title: newAnnouncement.title,
                        description: newAnnouncement.description,
                        fullContent: newAnnouncement.fullContent || newAnnouncement.description,
                        timestamp: 'Just now',
                        priority: newAnnouncement.priority,
                        isRead: false,
                        source: 'worker',
                        workerName: 'Your Worker',
                      };

                      // Save to storage for users
                      try {
                        const existing = await AsyncStorage.getItem(STORAGE_KEY);
                        const announcements = existing ? JSON.parse(existing) : [];
                        announcements.push(announcement);
                        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));

                        // Set notification flag for users
                        await AsyncStorage.setItem(USER_NOTIFICATION_KEY, 'true');
                        await AsyncStorage.setItem('@hajjpath_user_announcement_data', JSON.stringify(announcement));

                        setShowCreateModal(false);
                        setNewAnnouncement({ title: '', description: '', fullContent: '', priority: 'normal' });
                      } catch (error) {
                        console.error('Error saving announcement:', error);
                      }
                    }
                  }}
                >
                  <LinearGradient
                    colors={['#B82073', '#1B131F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.createModalSendButtonGradient}
                  >
                    <Text style={styles.createModalSendText}>{t('workerAnnouncements.sendToUsers')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        <WorkerBottomTabs active="announcement" />
      </View>
    </SafeAreaView>
  );
}

function AnnouncementCard({ 
  announcement, 
  onMarkAsRead, 
  onOpenDetail 
}: { 
  announcement: Announcement;
  onMarkAsRead: () => void;
  onOpenDetail: () => void;
}) {
  const { t, isRTL } = useLanguage();
  return (
    <TouchableOpacity 
      style={[
        styles.announcementCard,
        !announcement.isRead && styles.announcementCardUnread
      ]}
      onPress={onOpenDetail}
      activeOpacity={0.8}
    >
      <View style={[styles.cardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.cardHeaderLeft, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]} numberOfLines={1} ellipsizeMode="tail">{announcement.title}</Text>
          {!announcement.isRead && <View style={[styles.unreadDot, isRTL && { marginLeft: 0, marginRight: 8 }]} />}
        </View>
        <View style={styles.priorityBadgeContainer}>
          <View style={[
            styles.priorityBadge,
            announcement.priority === 'urgent' ? styles.priorityBadgeUrgent : styles.priorityBadgeNormal
          ]}>
            <Text style={styles.priorityBadgeText}>
              {announcement.priority === 'urgent' ? t('workerAnnouncements.urgent') : t('workerAnnouncements.normal')}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.cardDescription, isRTL && { textAlign: 'right' }]} numberOfLines={2}>
        {announcement.description}
      </Text>

      <View style={[styles.cardFooter, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.timestampRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="time-outline" size={14} color="#7A7A7A" />
          <Text style={[styles.timestampText, isRTL && { marginLeft: 0, marginRight: 4 }]}>{announcement.timestamp}</Text>
        </View>
        <View style={[styles.cardActions, isRTL && { flexDirection: 'row-reverse' }]}>
          {!announcement.isRead && (
            <TouchableOpacity 
              style={[styles.markReadButton, isRTL && { flexDirection: 'row-reverse', marginRight: 0, marginLeft: 8 }]}
              onPress={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#952562" />
              <Text style={[styles.markReadText, isRTL && { marginLeft: 0, marginRight: 4 }]}>{t('workerAnnouncements.markAsRead')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.viewDetailButton, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={(e) => {
              e.stopPropagation();
              onOpenDetail();
            }}
          >
            <Text style={[styles.viewDetailText, isRTL && { marginRight: 0, marginLeft: 4 }]}>{t('workerAnnouncements.viewDetail')}</Text>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color="#952562" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
    marginHorizontal: 8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#952562',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  alertText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
    flex: 1,
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
    gap: 6,
  },
  filterTabActiveText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
  },
  filterTabInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    gap: 6,
  },
  filterTabInactiveText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#45455F',
  },
  announcementsContainer: {
    gap: 16,
  },
  announcementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  announcementCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#952562',
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
  },
  cardTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#952562',
  },
  priorityBadgeContainer: {
    marginLeft: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeUrgent: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
  },
  priorityBadgeNormal: {
    backgroundColor: 'rgba(184, 32, 115, 0.15)',
  },
  priorityBadgeText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 11,
    color: '#952562',
  },
  cardDescription: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    gap: 8,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestampText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#7A7A7A',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  markReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  markReadText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#952562',
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  viewDetailText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#952562',
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
    flex: 1,
    marginRight: 16,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalBadgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modalTimestamp: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#7A7A7A',
  },
  modalFullContent: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#1B131F',
    lineHeight: 22,
  },
  newAnnouncementButton: {
    borderRadius: 20,
    overflow: 'hidden',
    width: 40,
    height: 40,
  },
  newAnnouncementButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  createModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  createModalTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
  },
  createModalLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#1B131F',
    marginBottom: 8,
    marginTop: 12,
  },
  createModalInput: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#1B131F',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 4,
  },
  createModalTextArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  priorityButtonActive: {
    backgroundColor: '#F5E1EB',
    borderColor: '#952562',
  },
  priorityButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#7A7A7A',
  },
  priorityButtonTextActive: {
    color: '#952562',
  },
  createModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  createModalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createModalCancelText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#7A7A7A',
  },
  createModalSendButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createModalSendButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createModalSendText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});



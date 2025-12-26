import WorkerBottomTabs from '@/components/worker-bottom-tabs';
import { Heebo_500Medium } from '@expo-google-fonts/heebo';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HERO_GRADIENT = ['#B82073', '#1B131F'] as const;

type QuickActionId = 'map' | 'wheelchair' | 'bus' | 'hotel' | 'medical';

type QuickAction = {
  id: QuickActionId;
  label: string;
  image: { uri: string };
  title: string;
  description: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'map',
    label: 'My Map',
    image: { uri: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&w=200&q=60' },
    title: 'Save Locations on My Map',
    description:
      'Pin your hotel, Mina camp, meeting points and favourite masjid entrances so you can quickly navigate back even in a crowd.',
  },
  {
    id: 'wheelchair',
    label: 'Wheelchair',
    image: { uri: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&w=200&q=60' },
    title: 'Wheelchair Assistance',
    description:
      'Request wheelchair support inside the Haram or during long walks between sites. Add how many pilgrims and the time you need help.',
  },
  {
    id: 'bus',
    label: 'Shuttle Bus',
    image: { uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&w=200&q=60' },
    title: 'Book Shuttle Bus',
    description:
      'Reserve seats on official shuttle buses between Makkah, Mina, Arafat and Muzdalifah with your group and selected time window.',
  },
  {
    id: 'hotel',
    label: 'Hotel Needs',
    image: { uri: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&w=200&q=60' },
    title: 'Hotel & Room Requests',
    description:
      'Share special requirements with your organiser such as early check-in, late checkout, extra bedding or room close to the lift.',
  },
  {
    id: 'medical',
    label: 'Medical Help',
    image: { uri: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&w=200&q=60' },
    title: 'Medical & Pharmacy',
    description:
      'Let your guide know if you need doctor support, prescription refills or nearby pharmacy recommendations during Hajj.',
  },
] as const;

export default function WorkerWishlistScreen() {
  const [selectedAction, setSelectedAction] = useState<QuickActionId>('wheelchair');

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Heebo-Medium': Heebo_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const quickActionContent = useMemo(() => {
    const actionData = QUICK_ACTIONS.find((a) => a.id === selectedAction) ?? QUICK_ACTIONS[0];
    return <ServiceDetailCard action={actionData} />;
  }, [selectedAction]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#7A7A7A" />
              <TextInput
                placeholder="Search Hajj Essentials"
                placeholderTextColor="#9A9A9A"
                style={styles.searchInput}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={18} color="#1B131F" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsRow}
          >
            {QUICK_ACTIONS.map((action) => {
              const isSelected = selectedAction === action.id;
              return (
                <TouchableOpacity
                  key={action.id}
                  onPress={() => setSelectedAction(action.id)}
                  activeOpacity={0.85}
                  style={styles.quickActionTap}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={['#B82073', '#1B131F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.quickActionGradient}
                    >
                      <View style={styles.quickActionInner}>
                        <View style={styles.quickActionImageWrap}>
                          <LinearGradient
                            colors={['#B82073', '#1B131F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.quickActionCircleBorder}
                          >
                            <View style={styles.quickActionImageInner}>
                              <Image source={action.image} style={styles.quickActionImage} />
                            </View>
                          </LinearGradient>
                        </View>
                        <Text style={[styles.quickActionLabel, styles.quickActionLabelActive]} numberOfLines={2}>
                          {action.label}
                        </Text>
                        <View style={styles.halfCircle} />
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.quickActionOutline}>
                      <View style={styles.quickActionInner}>
                        <View style={styles.quickActionImageWrap}>
                          <View style={styles.quickActionCircleBorderInactive}>
                            <View style={styles.quickActionImageInner}>
                              <Image source={action.image} style={styles.quickActionImage} />
                            </View>
                          </View>
                        </View>
                        <Text style={styles.quickActionLabel} numberOfLines={2}>
                          {action.label}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {quickActionContent}

          {/* Suggested items list */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>Suggested for your Hajj</Text>
            <View style={styles.suggestionsGrid}>
              <SuggestionCard
                title="Essential day bag items"
                body="Keep a small cross‑body bag ready with water, snacks, prayer mat, charger and a copy of your permit."
              />
              <SuggestionCard
                title="Stay connected with your group"
                body="Save your group leader's phone number and meeting point for every major ritual day."
              />
              <SuggestionCard
                title="Prepare for long walking days"
                body="Add blister plasters, spare socks and light snacks to your wishlist so you don't forget them."
              />
              <SuggestionCard
                title="Notes for your guide"
                body="Write short notes about elderly pilgrims, medical needs or wheelchair users in your group."
              />
            </View>
          </View>
        </ScrollView>

        <WorkerBottomTabs active="wishlist" />
      </View>
    </SafeAreaView>
  );
}

function ServiceDetailCard({ action }: { action: QuickAction }) {
  return (
    <View style={styles.detailCard}>
      <View style={styles.detailHeader}>
        <Text style={styles.detailTitle} numberOfLines={2}>
          {action.title}
        </Text>
        <View style={styles.counterWrapper}>
          <TouchableOpacity style={styles.counterButton}>
            <Text style={styles.counterSymbol}>−</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>1</Text>
          <TouchableOpacity style={styles.counterButton}>
            <Text style={styles.counterSymbol}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={16} color="#F2B705" />
        <Text style={styles.ratingText}>4.8  ( 12K reviews )</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Select Duration</Text>
        <LinearGradient
          colors={['#45455F', '#2C2431']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.datePill}
        >
          <Text style={styles.dateText}>1/8/2025 - 4/8/2025</Text>
        </LinearGradient>
      </View>

      <Text style={styles.detailBody}>
        {action.description}
      </Text>

      <Text style={styles.noteText}>
        <Text style={styles.noteLabel}>Note: </Text>
        These items will be included in the package under your profile. Your guide will confirm them within 48 hours.
      </Text>

        <LinearGradient colors={HERO_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitButton}>
        <Text style={styles.submitLabel}>Submit to Admin</Text>
      </LinearGradient>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    height: 52,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 15,
    color: '#212529',
    fontFamily: 'OpenSans-Regular',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  quickActionsRow: {
    gap: 12,
    paddingVertical: 4,
  },
  quickActionTap: {
    width: 90,
    height: 90,
  },
  quickActionGradient: {
    flex: 1,
    borderRadius: 7.62,
    padding: 1,
    overflow: 'hidden',
  },
  quickActionOutline: {
    flex: 1,
    borderRadius: 7.62,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  quickActionInner: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    position: 'relative',
  },
  quickActionImageWrap: {
    width: 46,
    height: 46,
    position: 'relative',
  },
  quickActionCircleBorder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    padding: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionImageInner: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  quickActionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  quickActionCircleBorderInactive: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 10,
    fontFamily: 'OpenSans-Bold',
    color: '#212529',
    textAlign: 'center',
  },
  quickActionLabelActive: {
    color: '#1B131F',
  },
  halfCircle: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 15,
    height: 15,
    borderTopRightRadius: 7.62,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(184, 32, 115, 0.15)',
  },
  detailCard: {
    width: 343,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    minHeight: 501,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    color: '#1B131F',
    width: 117,
  },
  counterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 88,
    height: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  counterButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  counterSymbol: {
    fontSize: 16,
    color: '#1B131F',
    fontWeight: '600',
  },
  counterValue: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    minWidth: 16,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  ratingText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#212529',
  },
  section: {
    marginTop: 22,
    gap: 10,
  },
  sectionLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
  },
  datePill: {
    width: 163,
    height: 33,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#F4F4F4',
  },
  detailBody: {
    marginTop: 20,
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    lineHeight: 19,
    color: '#212529',
    marginBottom: 16,
  },
  readMore: {
    color: '#952562',
    fontFamily: 'OpenSans-Regular',
  },
  noteText: {
    marginTop: 18,
    fontFamily: 'OpenSans-Regular',
    fontSize: 11,
    color: '#212529',
  },
  noteLabel: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 11,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 8,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  suggestionsSection: {
    marginTop: 8,
    gap: 12,
  },
  suggestionsTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    marginBottom: 4,
  },
  suggestionsGrid: {
    gap: 10,
  },
});

type SuggestionProps = {
  title: string;
  body: string;
};

function SuggestionCard({ title, body }: SuggestionProps) {
  return (
    <View style={stylesSuggestion.card}>
      <Text style={stylesSuggestion.title}>{title}</Text>
      <Text style={stylesSuggestion.body}>{body}</Text>
    </View>
  );
}

const stylesSuggestion = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#1B131F',
    marginBottom: 6,
  },
  body: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
});

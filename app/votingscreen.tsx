import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

type PollOption = {
  id: string;
  text: string;
  percentage: number;
  votes: number;
};

type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  postedBy: string;
  postedTime: string;
  totalVotes: number;
};

// Base poll data - will be translated in component
const getPolls = (t: any): Poll[] => [
  {
    id: '1',
    question: t('voting.poll1.question'),
    options: [
      { id: '1', text: t('voting.poll1.option1'), percentage: 42, votes: 126 },
      { id: '2', text: t('voting.poll1.option2'), percentage: 32, votes: 96 },
      { id: '3', text: t('voting.poll1.option3'), percentage: 52, votes: 156 },
    ],
    postedBy: t('voting.hajjPathTeam'),
    postedTime: `3 ${t('common.hours')} ${t('voting.ago')}`,
    totalVotes: 378,
  },
  {
    id: '2',
    question: t('voting.poll2.question'),
    options: [
      { id: '1', text: t('voting.poll2.option1'), percentage: 58, votes: 174 },
      { id: '2', text: t('voting.poll2.option2'), percentage: 28, votes: 84 },
      { id: '3', text: t('voting.poll2.option3'), percentage: 14, votes: 42 },
    ],
    postedBy: t('voting.hajjPathTeam'),
    postedTime: `1 ${t('common.day')} ${t('voting.ago')}`,
    totalVotes: 300,
  },
  {
    id: '3',
    question: t('voting.poll3.question'),
    options: [
      { id: '1', text: t('voting.poll3.option1'), percentage: 45, votes: 135 },
      { id: '2', text: t('voting.poll3.option2'), percentage: 35, votes: 105 },
      { id: '3', text: t('voting.poll3.option3'), percentage: 20, votes: 60 },
    ],
    postedBy: t('voting.hajjPathTeam'),
    postedTime: `2 ${t('common.days')} ${t('voting.ago')}`,
    totalVotes: 300,
  },
];

export default function VotingScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const POLLS = React.useMemo(() => getPolls(t), [t]);

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
  });

  const handleOptionSelect = (pollId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [pollId]: optionId,
    }));
    // In a real app, this would submit the vote to the backend
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('voting.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {POLLS.map((poll, pollIndex) => (
            <View key={poll.id} style={styles.pollContainer}>
              {/* Poll Creator Card */}
              <View style={styles.creatorCard}>
                <View style={styles.creatorLeft}>
                  <View style={styles.creatorAvatarContainer}>
                    <Image
                      source={require('@/assets/images/logo.png')}
                      style={styles.creatorAvatar}
                    />
                    <View style={styles.editIconContainer}>
                      <Ionicons name="pencil" size={10} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.creatorInfo}>
                    <Text style={[styles.creatorName, isRTL && { textAlign: 'right' }]}>{t('voting.postedBy')} {poll.postedBy}</Text>
                    <Text style={[styles.postedTime, isRTL && { textAlign: 'right' }]}>{poll.postedTime}</Text>
                  </View>
                </View>
                <View style={styles.creatorRight}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="people-outline" size={20} color="#7A7A7A" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="bar-chart-outline" size={20} color="#7A7A7A" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Poll Question Card */}
              <View style={styles.pollCard}>
                <Text style={[styles.pollQuestion, isRTL && { textAlign: 'right' }]}>{poll.question}</Text>

                {/* Poll Options */}
                <View style={styles.optionsContainer}>
                  {poll.options.map((option) => {
                    const isSelected = selectedOptions[poll.id] === option.id;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[styles.optionBar, isSelected && styles.optionBarSelected]}
                        onPress={() => handleOptionSelect(poll.id, option.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.optionBarContent}>
                          <View style={styles.optionBarFill}>
                            <LinearGradient
                              colors={['#B82073', '#1B131F']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={[styles.optionBarGradient, { width: `${option.percentage}%` }]}
                            />
                          </View>
                          <Text style={[styles.optionText, isRTL && { textAlign: 'right' }]}>{option.text}</Text>
                          <Text style={styles.optionPercentage}>{option.percentage}%</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* View Past Poll Button (only on first poll) */}
                {pollIndex === 0 && (
                  <View style={styles.viewPastButtonContainer}>
                    <TouchableOpacity 
                      style={styles.viewPastButton}
                      onPress={() => {
                        // Scroll to next polls or show past polls
                      }}
                    >
                      <LinearGradient
                        colors={['#B82073', '#1B131F']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.viewPastButtonGradient}
                      >
                        <Text style={styles.viewPastButtonText}>{t('voting.viewPastPoll')}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <BottomTabs active="home" />
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
  pollContainer: {
    marginBottom: 20,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  creatorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  creatorAvatarContainer: {
    position: 'relative',
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#952562',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    marginBottom: 4,
  },
  postedTime: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#7A7A7A',
  },
  creatorRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  pollQuestion: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#1B131F',
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  optionBar: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    backgroundColor: '#F6F6F6',
  },
  optionBarSelected: {
    borderColor: '#952562',
    borderWidth: 2,
  },
  optionBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    position: 'relative',
    minHeight: 50,
  },
  optionBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionBarGradient: {
    height: '100%',
  },
  optionText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#1B131F',
    flex: 1,
    zIndex: 1,
    paddingLeft: 4,
  },
  optionPercentage: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#952562',
    marginLeft: 12,
    zIndex: 1,
    minWidth: 40,
    textAlign: 'right',
  },
  viewPastButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  viewPastButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  viewPastButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  viewPastButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});




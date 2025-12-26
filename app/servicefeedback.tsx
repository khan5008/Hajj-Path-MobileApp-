import BottomTabs from '@/components/bottom-tabs';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RatingValue = 1 | 2 | 3 | 4 | 5;

const RATING_LABELS = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

const RATING_EMOJIS = {
  1: '😞',
  2: '😐',
  3: '🙂',
  4: '😊',
  5: '😍',
};

export default function ServiceFeedbackScreen() {
  const router = useRouter();
  const [rating, setRating] = useState<RatingValue | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serviceName, setServiceName] = useState('Meal Service – Mina Camp');

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSubmit = async () => {
    if (!rating) {
      Alert.alert('Required', 'Please provide a rating');
      return;
    }

    try {
      // Save feedback to storage
      const feedback = {
        id: Date.now().toString(),
        serviceName,
        rating,
        feedbackText,
        submittedAt: new Date().toISOString(),
      };

      const existingFeedback = await AsyncStorage.getItem('@hajjpath_feedback');
      const feedbacks = existingFeedback ? JSON.parse(existingFeedback) : [];
      feedbacks.push(feedback);
      await AsyncStorage.setItem('@hajjpath_feedback', JSON.stringify(feedbacks));

      setIsSubmitted(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    }
  };

  const handleReset = () => {
    setRating(null);
    setFeedbackText('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1B131F" />
            </TouchableOpacity>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#952562" />
            </View>
            <Text style={styles.successTitle}>Thanks for your valuable feedback!</Text>
            <Text style={styles.successSubtext}>
              Your feedback helps us improve the Hajj experience for all pilgrims.
            </Text>
            <TouchableOpacity style={styles.backToHomeButton} onPress={() => router.back()}>
              <LinearGradient
                colors={['#B82073', '#1B131F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.backToHomeGradient}
              >
                <Text style={styles.backToHomeText}>Back to Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <BottomTabs active="profile" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1B131F" />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>Your Feedback Matters</Text>
            <Text style={styles.subtitle}>Help us improve your Hajj experience</Text>
          </View>

          {/* Survey Card */}
          <View style={styles.surveyCard}>
            <View style={styles.serviceNameContainer}>
              <Ionicons name="restaurant-outline" size={20} color="#952562" />
              <Text style={styles.serviceName}>{serviceName}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.questionText}>How was the quality of the service?</Text>

            {/* Rating Section */}
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((value) => {
                const isSelected = rating === value;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[styles.ratingButton, isSelected && styles.ratingButtonSelected]}
                    onPress={() => setRating(value as RatingValue)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.ratingEmoji}>{RATING_EMOJIS[value as RatingValue]}</Text>
                    {isSelected && (
                      <View style={styles.ratingSelectedIndicator}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {rating && (
              <Text style={styles.ratingLabel}>{RATING_LABELS[rating]}</Text>
            )}

            <View style={styles.divider} />

            <Text style={styles.questionText}>Was the timing satisfactory?</Text>

            {/* Optional Text Feedback */}
            <View style={styles.feedbackInputContainer}>
              <Text style={styles.feedbackLabel}>Write your feedback (optional)</Text>
              <View style={styles.textInputWrapper}>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Share your thoughts, suggestions, or concerns..."
                  placeholderTextColor="#9A9A9A"
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={!rating}
          >
            <LinearGradient
              colors={rating ? ['#B82073', '#1B131F'] : ['#E8E8E8', '#E8E8E8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButtonGradient}
            >
              <Text style={[styles.submitButtonText, !rating && styles.submitButtonTextDisabled]}>
                Submit Feedback
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        <BottomTabs active="profile" />
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
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#1B131F',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: '#7A7A7A',
    textAlign: 'center',
  },
  surveyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  serviceNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  serviceName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 20,
  },
  questionText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  ratingButtonSelected: {
    backgroundColor: 'rgba(184, 32, 115, 0.1)',
    borderColor: '#952562',
  },
  ratingEmoji: {
    fontSize: 28,
  },
  ratingSelectedIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#952562',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  ratingLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
    textAlign: 'center',
    marginTop: 8,
  },
  feedbackInputContainer: {
    marginTop: 8,
  },
  feedbackLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#1B131F',
    marginBottom: 8,
  },
  textInputWrapper: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 120,
  },
  feedbackInput: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: '#1B131F',
    flex: 1,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  submitButtonTextDisabled: {
    color: '#9A9A9A',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
    color: '#1B131F',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtext: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: '#7A7A7A',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  backToHomeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  backToHomeGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToHomeText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});





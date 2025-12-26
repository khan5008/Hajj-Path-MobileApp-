import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotificationPopupProps {
  visible: boolean;
  message: string;
  onPress?: () => void;
  onDismiss?: () => void;
  type?: 'response' | 'request';
}

export default function NotificationPopup({ 
  visible, 
  message, 
  onPress, 
  onDismiss,
  type = 'response'
}: NotificationPopupProps) {
  const { isRTL } = useLanguage();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      handleDismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
        isRTL && { flexDirection: 'row-reverse' },
      ]}
    >
      <TouchableOpacity
        style={[styles.notification, isRTL && { flexDirection: 'row-reverse' }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, isRTL && { marginLeft: 12, marginRight: 0 }]}>
          <Ionicons 
            name={type === 'response' ? 'chatbubble-ellipses' : 'document-text'} 
            size={24} 
            color="#FFFFFF" 
          />
        </View>
        <View style={[styles.textContainer, isRTL && { alignItems: 'flex-end' }]}>
          <Text style={[styles.message, isRTL && { textAlign: 'right' }]} numberOfLines={2}>
            {message}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleDismiss}
          style={[styles.closeButton, isRTL && { marginRight: 8, marginLeft: 0 }]}
        >
          <Ionicons name="close" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  notification: {
    flexDirection: 'row',
    backgroundColor: '#B82073',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    lineHeight: 20,
  },
  closeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});



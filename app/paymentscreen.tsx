import BottomTabs from '@/components/bottom-tabs';
import { Heebo_500Medium } from '@expo-google-fonts/heebo';
import { Inter_600SemiBold } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
} from '@expo-google-fonts/open-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
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
import Svg, { Defs, Line, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

function WalletIcon() {
  return (
    <Svg width={39} height={34} viewBox="0 0 39 34" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1336" x1="0" y1="0" x2="33.6825" y2="38.6358" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M34.125 34C35.4179 34 36.6579 33.4881 37.5721 32.5768C38.4864 31.6656 39 30.4297 39 29.1411V15.2584C39 13.7119 38.3837 12.2289 37.2866 11.1354C36.1895 10.0419 34.7015 9.42762 33.15 9.42762H6.67305C5.95481 9.42809 5.2644 9.1508 4.74717 8.6541C4.22994 8.1574 3.92624 7.48006 3.9 6.76466C3.92588 6.00101 4.24523 5.27647 4.792 4.7409C5.33878 4.20532 6.07115 3.89967 6.83766 3.88716H33.15C33.6672 3.88716 34.1632 4.09193 34.5289 4.45642C34.8946 4.82091 35.1 5.31527 35.1 5.83073V6.48701C35.1 7.00248 35.3054 7.49683 35.6711 7.86132C36.0368 8.22582 36.5328 8.43058 37.05 8.43058C37.5672 8.43058 38.0632 8.22582 38.4289 7.86132C38.7946 7.49683 39 7.00248 39 6.48701V5.83073C39 5.06503 38.8487 4.30683 38.5547 3.59941C38.2607 2.89199 37.8298 2.24922 37.2866 1.70778C36.7433 1.16635 36.0984 0.736861 35.3887 0.443839C34.6789 0.150817 33.9182 0 33.15 0H6.67305C4.90428 0.00333577 3.2089 0.705143 1.95819 1.95174C0.707473 3.19834 0.00334679 4.88812 0 6.65108V26.2257C0 28.2876 0.821783 30.265 2.28457 31.723C3.74735 33.1809 5.73131 34 7.8 34H34.125ZM35.1 22.9822H28.3636C28.1061 22.9789 27.86 22.8755 27.6778 22.6939C27.4957 22.5124 27.3919 22.2671 27.3886 22.0104V20.8745C27.3886 20.6168 27.4914 20.3696 27.6742 20.1874C27.8571 20.0051 28.105 19.9027 28.3636 19.9027H35.1127L35.1 22.9822ZM3.9 26.2257V12.709C4.76863 13.111 5.71533 13.3179 6.67305 13.3148H33.15C33.6672 13.3148 34.1632 13.5195 34.5289 13.884C34.8946 14.2485 35.1 14.7429 35.1 15.2584V16.003H28.3636C27.0695 16.0063 25.8296 16.521 24.9157 17.4343C24.0018 18.3475 23.4886 19.5847 23.4886 20.8745V22.0483C23.5019 23.3293 24.021 24.5536 24.9335 25.456C25.8459 26.3583 27.0783 26.8661 28.3636 26.8693H35.1127V29.1411C35.1127 29.3988 35.0099 29.646 34.8271 29.8282C34.6442 30.0105 34.3962 30.1128 34.1377 30.1128H7.8C6.76566 30.1128 5.77367 29.7033 5.04228 28.9743C4.31089 28.2453 3.9 27.2566 3.9 26.2257Z"
        fill="url(#paint0_linear_5_1336)"
      />
    </Svg>
  );
}

function CurrencyIcon() {
  return (
    <Svg width={15} height={17} viewBox="0 0 15 17" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1339" x1="0" y1="0" x2="16.8677" y2="14.8833" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M15 13.8584C14.9009 14.6696 14.8575 15.0217 14.4873 15.8125L8.80273 17C8.93341 16.1454 9.1075 15.4862 9.39062 15.0908L15 13.8584ZM7.08203 8.26465L8.78125 7.8916V2.45996C9.41389 1.74138 9.80282 1.41865 10.5664 1.01074V7.49902L15 6.52539C14.9009 7.33663 14.8575 7.6887 14.4873 8.47949L10.5664 9.31738V11.1416L15 10.1924C14.9009 11.0035 14.8574 11.355 14.4873 12.1455L10.5664 12.9648V12.9824L8.78125 13.3555V9.69922L7.08203 10.0625V12.3672L7.05176 12.373C6.6611 13.0661 6.1105 13.8989 5.5791 14.5635L0 15.6387C0.0500266 14.9122 0.154866 14.5032 0.479492 13.7715L5.2959 12.7148V10.4443L0.831055 11.4004C0.881086 10.6741 0.985946 10.2649 1.31055 9.5332L5.2959 8.65723V1.4502C5.9288 0.731284 6.31811 0.40805 7.08203 0V8.26465Z"
        fill="url(#paint0_linear_5_1339)"
      />
    </Svg>
  );
}

function CheckmarkIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1363" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M11 0C4.93465 0 0 4.93465 0 11C0 17.0654 4.93465 22 11 22C17.0655 22 22 17.0654 22 11C22 4.93465 17.0655 0 11 0ZM17.0319 8.1659L10.3342 15.3188C10.134 15.5317 9.85509 15.6809 9.5628 15.6809C9.56141 15.6809 9.55985 15.6809 9.55847 15.6809C9.26774 15.6809 8.98965 15.5354 8.78884 15.3252L4.97433 11.32C4.5682 10.8948 4.58345 10.2143 5.00846 9.80821C5.43364 9.40243 6.10763 9.41416 6.51358 9.839L9.55206 13.0172L15.4802 6.70863C15.8828 6.28067 16.5561 6.25824 16.9851 6.6616C17.4134 7.06426 17.4342 7.73743 17.0319 8.1659Z"
        fill="url(#paint0_linear_5_1363)"
      />
    </Svg>
  );
}

function ClockIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1379" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 0C17.0711 0 22 4.92894 22 11C22 17.0711 17.0711 22 11 22C4.92894 22 0 17.0711 0 11C0 4.92894 4.92894 0 11 0ZM10.2667 5.86667V11C10.2667 11.1943 10.3437 11.3813 10.4812 11.5188L14.5146 15.5523C14.8006 15.8383 15.2663 15.8383 15.5523 15.5523C15.8383 15.2663 15.8383 14.8006 15.5523 14.5146L11.7336 10.6966V5.86667C11.7336 5.46149 11.4054 5.13333 11.0002 5.13333C10.595 5.13333 10.2667 5.46149 10.2667 5.86667Z"
        fill="url(#paint0_linear_5_1379)"
      />
    </Svg>
  );
}

function GradientLine() {
  return (
    <Svg width={171} height={1} viewBox="0 0 171 1" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1362" x1="0" y1="1" x2="0.0116955" y2="2.99993" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Line x1="0.5" y1="0.5" x2="170.5" y2="0.5" stroke="url(#paint0_linear_5_1362)" strokeLinecap="round" />
    </Svg>
  );
}

export default function PaymentScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Inter-SemiBold': Inter_600SemiBold,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_400Regular, // Using Regular as Medium fallback
    'Heebo-Medium': Heebo_500Medium,
    'OpenSans-Regular': OpenSans_400Regular,
  });

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
            <Ionicons name="arrow-back" size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Summary</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top Section */}
          <View style={styles.topSection}>
            {/* Wallet Icon Container */}
            <View style={styles.walletIconContainer}>
              <WalletIcon />
            </View>

            {/* Due Amount Display */}
            <View style={styles.dueAmountContainer}>
              <CurrencyIcon />
              <Text style={styles.dueAmountText}>250.50</Text>
            </View>
            <Text style={styles.dueAmountLabel}>Due Amount</Text>

            {/* Pay Now Button */}
            <TouchableOpacity style={styles.payNowButton}>
              <LinearGradient
                colors={['#B82073', '#1B131F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.payNowGradient}
              >
                <Text style={styles.payNowText}>Pay Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Booking Details Card */}
          <View style={styles.bookingCard}>
            <Text style={styles.bookingLabel}>Booking ID : <Text style={styles.bookingValue}>Hj12345</Text></Text>
            <GradientLine />
            <Text style={styles.bookingLabel}>Package : <Text style={styles.bookingValue}>Economy Hajj 2025</Text></Text>
            <Text style={styles.bookingLabel}>Total : <Text style={styles.bookingValue}>1200 SAR</Text></Text>
            <Text style={styles.bookingLabel}>Paid : <Text style={styles.bookingValue}>1100 SAR</Text></Text>
            <Text style={styles.bookingLabel}>Pending : <Text style={styles.bookingValue}>100 SAR</Text></Text>
          </View>

          {/* Payment History Card */}
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Payment History</Text>
            
            {/* Payment Entry 1 */}
            <View style={styles.paymentEntry}>
              <View style={styles.paymentLeft}>
                <CheckmarkIcon />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>Advance Payment</Text>
                  <Text style={styles.paymentDate}>Date: 10 - Jan - 2025</Text>
                </View>
              </View>
              <View style={styles.paymentBadge}>
                <CurrencyIcon />
                <Text style={styles.paymentAmount}>250.50</Text>
                <Text style={styles.paymentStatus}>Paid</Text>
              </View>
            </View>

            <View style={styles.paymentDivider} />

            {/* Payment Entry 2 */}
            <View style={styles.paymentEntry}>
              <View style={styles.paymentLeft}>
                <CheckmarkIcon />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>Second Payment</Text>
                  <Text style={styles.paymentDate}>Date: 12 - Jan - 2025</Text>
                </View>
              </View>
              <View style={styles.paymentBadge}>
                <CurrencyIcon />
                <Text style={styles.paymentAmount}>250.50</Text>
                <Text style={styles.paymentStatus}>Paid</Text>
              </View>
            </View>

            <View style={styles.paymentDivider} />

            {/* Payment Entry 3 */}
            <View style={styles.paymentEntry}>
              <View style={styles.paymentLeft}>
                <ClockIcon />
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>Final Due</Text>
                  <Text style={styles.paymentDate}>Date: 12 - Jan - 2025</Text>
                </View>
              </View>
              <View style={styles.paymentBadge}>
                <CurrencyIcon />
                <Text style={styles.paymentAmount}>100.00</Text>
                <Text style={styles.paymentStatusDue}>Due</Text>
              </View>
            </View>
          </View>
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
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 21,
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },
  topSection: {
    width: 333,
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  walletIconContainer: {
    width: 75,
    height: 75,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dueAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dueAmountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#010F0F',
  },
  dueAmountLabel: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11.26,
    color: '#212529',
    marginBottom: 16,
  },
  payNowButton: {
    width: 333,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
  },
  payNowGradient: {
    width: 333,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  bookingCard: {
    width: 333,
    minHeight: 188,
    borderRadius: 14.78,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  bookingLabel: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    fontWeight: '500',
    color: '#212529',
  },
  bookingValue: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    fontWeight: '500',
    color: '#212529',
  },
  historyCard: {
    width: 333,
    minHeight: 181,
    borderRadius: 14.78,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  historyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16.89,
    color: '#1B131F',
    width: 175,
    height: 24,
    marginBottom: 16,
  },
  paymentEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#1B131F',
    marginBottom: 4,
  },
  paymentDate: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 8,
    color: '#212529',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
  },
  paymentAmount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#010F0F',
  },
  paymentStatus: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#212529',
  },
  paymentStatusDue: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#952562',
  },
  paymentDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 4,
  },
});


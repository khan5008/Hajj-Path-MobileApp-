import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

type WorkerNavId = 'home' | 'request' | 'announcement' | 'profile';

type NavItem = {
  id: WorkerNavId;
  label: string;
  route: string;
  Icon: React.ComponentType<{ active: boolean }>;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home',        label: 'workerBottomTabs.home',         route: '/worker/workerhomescreen',       Icon: HomeIcon },
  { id: 'request',     label: 'workerBottomTabs.request',      route: '/worker/workerrequestscreen',     Icon: RequestIcon },
  { id: 'announcement',label: 'workerBottomTabs.announcement', route: '/worker/workerannouncementscreen', Icon: AnnouncementIcon },
  { id: 'profile',     label: 'workerBottomTabs.profile',      route: '/worker/workerprofilescreen',    Icon: ProfileIcon },
];

export default function WorkerBottomTabs({ active }: { active: WorkerNavId }) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const handlePress = (item: NavItem) => {
    if (item.id === active) return;
    router.push(item.route as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[styles.nav, isRTL && { flexDirection: 'row-reverse' }]}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.Icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.button}
              activeOpacity={0.9}
              onPress={() => handlePress(item)}
            >
              <View style={styles.iconContainer}>
                <Icon active={isActive} />
              </View>
              <Text style={[isActive ? styles.labelActive : styles.label, isRTL && { textAlign: 'right' }]}>
                {t(item.label)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <Svg width={21} height={20} viewBox="0 0 21 20" fill="none">
      <Path
        d="M18.05 4.81774L12.29 0.78774C10.72 -0.31226 8.31 -0.252259 6.8 0.917741L1.79 4.82774C0.79 5.60774 0 7.20774 0 8.46774V15.3677C0 17.9177 2.07 19.9977 4.62 19.9977H15.4C17.95 19.9977 20.02 17.9277 20.02 15.3777V8.59774C20.02 7.24774 19.15 5.58774 18.05 4.81774ZM10.76 15.9977C10.76 16.4077 10.42 16.7477 10.01 16.7477C9.6 16.7477 9.26 16.4077 9.26 15.9977V12.9977C9.26 12.5877 9.6 12.2477 10.01 12.2477C10.42 12.2477 10.76 12.5877 10.76 12.9977V15.9977Z"
        fill={active ? '#952562' : '#45455F'}
      />
    </Svg>
  );
}

function RequestIcon({ active }: { active: boolean }) {
  const fill = active ? '#952562' : '#45455F';
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
        fill={fill}
      />
    </Svg>
  );
}

function EssentialsIcon({ active }: { active: boolean }) {
  const fill = active ? '#952562' : '#45455F';
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.6777 19.957C12.9524 20.0209 12.9776 20.3808 12.71 20.47L11.13 20.99C7.15998 22.27 5.06997 21.2 3.77998 17.23L2.49997 13.28C1.21997 9.30998 2.27997 7.20998 6.24997 5.92998L6.77397 5.75645C7.17684 5.62304 7.5689 6.0271 7.45451 6.43577C7.3978 6.63834 7.34326 6.84975 7.28997 7.06998L6.30997 11.26C5.20997 15.97 6.81997 18.57 11.53 19.69L12.6777 19.957Z"
        fill={fill}
      />
      <Path
        d="M17.1699 3.21001L15.4999 2.82001C12.1599 2.03001 10.1699 2.68001 8.99994 5.10001C8.69994 5.71001 8.45994 6.45001 8.25994 7.30001L7.27994 11.49C6.29994 15.67 7.58994 17.73 11.7599 18.72L13.4399 19.12C14.0199 19.26 14.5599 19.35 15.0599 19.39C18.1799 19.69 19.8399 18.23 20.6799 14.62L21.6599 10.44C22.6399 6.26001 21.3599 4.19001 17.1699 3.21001ZM15.2899 13.33C15.1999 13.67 14.8999 13.89 14.5599 13.89C14.4999 13.89 14.4399 13.88 14.3699 13.87L11.4599 13.13C11.0599 13.03 10.8199 12.62 10.9199 12.22C11.0199 11.82 11.4299 11.58 11.8299 11.68L14.7399 12.42C15.1499 12.52 15.3899 12.93 15.2899 13.33ZM18.2199 9.95001C18.1299 10.29 17.8299 10.51 17.4899 10.51C17.4299 10.51 17.3699 10.5 17.2999 10.49L12.4499 9.26001C12.0499 9.16001 11.8099 8.75001 11.9099 8.35001C12.0099 7.95001 12.4199 7.71001 12.8199 7.81001L17.6699 9.04001C18.0799 9.13001 18.3199 9.54001 18.2199 9.95001Z"
        fill={fill}
      />
    </Svg>
  );
}

function AnnouncementIcon({ active }: { active: boolean }) {
  const fill = active ? '#952562' : '#45455F';
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2 1.19936C19.1999 0.99489 19.1475 0.79384 19.0479 0.615286C18.9483 0.436732 18.8047 0.286596 18.6307 0.179126C18.4568 0.0716559 18.2583 0.0104153 18.054 0.00121545C17.8497 -0.00798438 17.6465 0.0351616 17.4636 0.126559L8.1156 4.79936H3.6C2.64522 4.79936 1.72955 5.17864 1.05442 5.85378C0.379285 6.52891 0 7.44458 0 8.39936C0 9.35414 0.379285 10.2698 1.05442 10.9449C1.72955 11.6201 2.64522 11.9994 3.6 11.9994H3.936L6.0612 18.3786C6.14082 18.6176 6.29366 18.8255 6.49806 18.9729C6.70246 19.1202 6.94804 19.1994 7.2 19.1994H8.4C8.71826 19.1994 9.02348 19.0729 9.24853 18.8479C9.47357 18.6228 9.6 18.3176 9.6 17.9994V12.741L17.4636 16.6722C17.6465 16.7636 17.8497 16.8067 18.054 16.7975C18.2583 16.7883 18.4568 16.7271 18.6307 16.6196C18.8047 16.5121 18.9483 16.362 19.0479 16.1834C19.1475 16.0049 19.1999 15.8038 19.2 15.5994V1.19936Z"
        fill={fill}
      />
    </Svg>
  );
}

function MealsIcon({ active }: { active: boolean }) {
  const fill = active ? '#952562' : '#45455F';
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
        fill={fill}
      />
      <Path
        d="M7 7H17V9H7V7ZM7 11H17V13H7V11ZM7 15H12V17H7V15Z"
        fill={fill}
      />
    </Svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  const fill = active ? '#952562' : '#45455F';
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"
        fill={fill}
      />
      <Path
        d="M17.08 14.15C14.29 12.29 9.73999 12.29 6.92999 14.15C5.65999 15 4.95999 16.15 4.95999 17.38C4.95999 18.61 5.65999 19.75 6.91999 20.59C8.31999 21.53 10.16 22 12 22C13.84 22 15.68 21.53 17.08 20.59C18.34 19.74 19.04 18.6 19.04 17.36C19.03 16.13 18.34 14.99 17.08 14.15Z"
        fill={fill}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  nav: {
    width: 360,
    minHeight: 73,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontFamily: 'OpenSans-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  labelActive: {
    fontSize: 10,
    fontFamily: 'OpenSans-SemiBold',
    color: '#952562',
    marginTop: 2,
  },
});


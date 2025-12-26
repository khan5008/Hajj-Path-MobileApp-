import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_600SemiBold } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
} from '@expo-google-fonts/open-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
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
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Fatwa Data Keys - actual content comes from translations
const FATWA_DATA: { [key: string]: { questionKey: string; answerKey: string; source: string; date: string } } = {
  'fever': {
    questionKey: 'fatwa.feverQuestion',
    answerKey: 'fatwa.feverAnswer',
    source: 'Darul Uloom TT Fatwa',
    date: '29 Jan 2020',
  },
  'tawaf': {
    questionKey: 'fatwa.tawafQuestion',
    answerKey: 'fatwa.tawafAnswer',
    source: 'Darul Uloom TT Fatwa',
    date: '29 Jan 2020',
  },
  'illness': {
    questionKey: 'fatwa.illnessQuestion',
    answerKey: 'fatwa.illnessAnswer',
    source: 'Islamic Fiqh Academy',
    date: '15 Mar 2021',
  },
  'women': {
    questionKey: 'fatwa.womenQuestion',
    answerKey: 'fatwa.womenAnswer',
    source: 'Darul Ifta',
    date: '10 Feb 2022',
  },
  'proxy': {
    questionKey: 'fatwa.proxyQuestion',
    answerKey: 'fatwa.proxyAnswer',
    source: 'Al-Azhar Fatwa',
    date: '5 Dec 2021',
  },
  'ritual': {
    questionKey: 'fatwa.ritualQuestion',
    answerKey: 'fatwa.ritualAnswer',
    source: 'Mecca Scholars Council',
    date: '20 Nov 2022',
  },
};

const DEFAULT_ANSWER = {
  questionKey: 'fatwa.feverQuestion',
  answerKey: 'fatwa.feverAnswer',
  source: 'Darul Uloom TT Fatwa',
  date: '29 Jan 2020',
};

function QuestionIcon() {
  return (
    <Svg width={21} height={21} viewBox="0 0 21 21" fill="none">
      <Path
        d="M11.8125 14.4375C11.8125 14.7856 11.6742 15.1194 11.4281 15.3656C11.1819 15.6117 10.8481 15.75 10.5 15.75C10.1519 15.75 9.81806 15.6117 9.57192 15.3656C9.32578 15.1194 9.1875 14.7856 9.1875 14.4375C9.1875 14.0894 9.32578 13.7556 9.57192 13.5094C9.81806 13.2633 10.1519 13.125 10.5 13.125C10.8481 13.125 11.1819 13.2633 11.4281 13.5094C11.6742 13.7556 11.8125 14.0894 11.8125 14.4375ZM9.84375 5.25C8.97351 5.25 8.13891 5.5957 7.52356 6.21106C6.9082 6.82641 6.5625 7.66101 6.5625 8.53125H9.1875C9.1875 8.3572 9.25664 8.19028 9.37971 8.06721C9.50278 7.94414 9.6697 7.875 9.84375 7.875H10.6916C10.8046 7.87505 10.9143 7.91328 11.0029 7.98348C11.0914 8.05369 11.1537 8.15175 11.1795 8.26177C11.2053 8.37178 11.1932 8.4873 11.1452 8.58958C11.0971 8.69186 11.0159 8.77491 10.9148 8.82525L9.1875 9.68888V11.8125H11.8125V11.3111L12.0894 11.172C12.719 10.8569 13.2237 10.3385 13.5219 9.70075C13.8201 9.06304 13.8944 8.34334 13.7327 7.65817C13.5709 6.973 13.1827 6.36247 12.6308 5.92542C12.0789 5.48837 11.3956 5.25039 10.6916 5.25H9.84375Z"
        fill="#952562"
      />
      <Path
        d="M0 10.5C0 7.71523 1.10625 5.04451 3.07538 3.07538C5.04451 1.10625 7.71523 0 10.5 0C13.2848 0 15.9555 1.10625 17.9246 3.07538C19.8938 5.04451 21 7.71523 21 10.5C21 13.2848 19.8938 15.9555 17.9246 17.9246C15.9555 19.8938 13.2848 21 10.5 21C7.71523 21 5.04451 19.8938 3.07538 17.9246C1.10625 15.9555 0 13.2848 0 10.5ZM10.5 2.625C9.46584 2.625 8.44181 2.82869 7.48637 3.22445C6.53093 3.6202 5.6628 4.20027 4.93153 4.93153C4.20027 5.6628 3.6202 6.53093 3.22445 7.48637C2.82869 8.44181 2.625 9.46584 2.625 10.5C2.625 11.5342 2.82869 12.5582 3.22445 13.5136C3.6202 14.4691 4.20027 15.3372 4.93153 16.0685C5.6628 16.7997 6.53093 17.3798 7.48637 17.7756C8.44181 18.1713 9.46584 18.375 10.5 18.375C12.5886 18.375 14.5916 17.5453 16.0685 16.0685C17.5453 14.5916 18.375 12.5886 18.375 10.5C18.375 8.41142 17.5453 6.40838 16.0685 4.93153C14.5916 3.45468 12.5886 2.625 10.5 2.625Z"
        fill="#952562"
      />
    </Svg>
  );
}


function SourceIcon() {
  return (
    <Svg width={60} height={18} viewBox="0 0 60 18" fill="none">
      <Path
        d="M35.1055 14.833V15.5H26.9248V14.833H35.1055ZM37.3389 14.3672C37.2166 14.631 37.0406 14.8655 36.8203 15.0518C36.6086 15.2307 36.3642 15.3573 36.1055 15.4297V14.7305C36.226 14.6797 36.34 14.612 36.4414 14.5264C36.5412 14.442 36.6261 14.3434 36.6963 14.2354L37.3389 14.3672ZM25.2119 14C25.2759 14.1614 25.371 14.3106 25.4941 14.4375C25.6176 14.5648 25.7645 14.6639 25.9248 14.7314V15.4287C25.6056 15.3394 25.3095 15.1675 25.0693 14.9199C24.8222 14.6651 24.6496 14.3462 24.5635 14H25.2119ZM38.3672 9.37891L37.5879 13.3975L36.9834 13.2734L37.7627 9.25488L38.3672 9.37891ZM25.1162 8.16699V13H24.5V8.16699H25.1162ZM37.0752 6.57129C37.1839 6.60171 37.291 6.63938 37.3936 6.68945C37.6499 6.8146 37.8779 6.99808 38.0596 7.22656C38.241 7.45491 38.3714 7.72308 38.4414 8.01172C38.471 8.13386 38.4861 8.2588 38.4932 8.38379L37.8584 8.25391C37.8539 8.22952 37.8515 8.20475 37.8457 8.18066C37.7998 7.99117 37.7134 7.81297 37.5918 7.66016C37.4702 7.50736 37.3165 7.38266 37.1406 7.29688C37.1194 7.28652 37.0969 7.27868 37.0752 7.26953V6.57129ZM36.0752 6.5V7.16699H34.9707L34.9893 7.0498L35.0781 6.5H36.0752ZM27.4844 6.5V7.16699H26.1162V6.5H27.4844ZM29.2676 6.65527C29.1519 6.76302 29.0244 6.85659 28.8867 6.93262C28.7586 7.00335 28.6232 7.05682 28.4844 7.0957V6.39746C28.526 6.37989 28.5676 6.36081 28.6074 6.33887C28.6434 6.31901 28.677 6.29556 28.7109 6.27246L29.2676 6.65527ZM31.3516 3.5459L29.8613 5.84961L29.3408 5.49219L30.8301 3.1875L31.3516 3.5459ZM34.5732 3.34863L34.2266 5.5H33.6006L33.9648 3.24414L34.5732 3.34863ZM32.8799 2.22754C32.7046 2.27117 32.5347 2.33859 32.375 2.42676C32.2185 2.51322 32.0741 2.61841 31.9453 2.74023L31.4082 2.37109C31.6081 2.15546 31.8401 1.97312 32.0957 1.83203C32.3426 1.69581 32.6074 1.60044 32.8799 1.54785V2.22754ZM34.0527 1.625C34.1841 1.69396 34.3025 1.78921 34.3994 1.90723C34.5029 2.0333 34.5785 2.18192 34.623 2.34277L34.0527 2.24512V1.625Z"
        fill="#D9D9D9"
        stroke="#C4C4C4"
      />
      <Path d="M28.041 6.83334V15.1667" stroke="#C4C4C4" strokeWidth="2" />
      <Path
        d="M48.0488 4.41113L46.0293 10.0801L46 10.1621V12.1846H51.75C51.7849 12.1847 51.8209 12.1928 51.8545 12.2109C51.8883 12.2292 51.9198 12.2577 51.9453 12.2949C51.9708 12.3323 51.989 12.3776 51.9961 12.4268C51.9996 12.4511 52 12.4757 51.998 12.5L51.9844 12.5723L50.8125 16.2705L50.6064 16.9209H52.3896L52.54 16.7314L55.8916 12.498L56 12.3623V4.0791H48.167L48.0488 4.41113ZM56.5 12.1846H59.001V11.6846L59 4.5791V4.0791H56.5V12.1846ZM45.5 10.1045C45.4999 10.067 45.5066 10.0303 45.5186 9.99609L47.585 4.19336L47.5859 4.19434C47.6612 3.98513 47.7932 3.80886 47.9609 3.68652C48.0864 3.59502 48.2277 3.53663 48.374 3.5127L48.5215 3.5H58.5C59.0273 3.5 59.5 3.95998 59.5 4.5791V11.6846C59.4998 12.3035 59.0271 12.7627 58.5 12.7627H56.3604L56.21 12.9531L52.6855 17.4043C52.633 17.4703 52.5639 17.5 52.5 17.5H51.291C50.9817 17.5 50.6774 17.3415 50.4844 17.0605C50.3899 16.9219 50.3267 16.7593 50.3018 16.5869C50.2831 16.4573 50.2866 16.3255 50.3115 16.1982L50.3438 16.0723L51.1855 13.4141L51.3916 12.7627H46.5C45.9729 12.7627 45.5002 12.3035 45.5 11.6846V10.1045Z"
        fill="#D9D9D9"
        stroke="#C4C4C4"
      />
      <Path
        d="M14.5 5.5H7C6.17157 5.5 5.5 6.17157 5.5 7V14.5C5.5 15.3284 6.17157 16 7 16H14.5C15.3284 16 16 15.3284 16 14.5V7C16 6.17157 15.3284 5.5 14.5 5.5Z"
        stroke="#C4C4C4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 11.5C1.675 11.5 1 10.825 1 10V2.5C1 1.675 1.675 1 2.5 1H10C10.825 1 11.5 1.675 11.5 2.5"
        stroke="#C4C4C4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeaderFramePattern({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 375 422" fill="none" style={{ position: 'absolute' }}>
      <Path
        d="M497.144 386.709L502.541 378.783L503.002 378.082L512.546 381.378V409.435L497.144 386.709ZM479.305 381.378L488.06 378.362H488.85L494.708 386.99L479.305 409.505V381.378ZM313.233 386.709L318.631 378.853L319.092 378.152L328.636 381.449V409.505L313.233 386.709ZM295.395 381.378L304.15 378.362H304.94L310.798 386.92L295.395 409.505V381.378ZM129.192 386.709L134.655 378.783L135.116 378.082L144.595 381.378V409.435L129.192 386.709ZM111.42 381.378L120.174 378.362H120.964L126.822 386.99L111.42 409.155V381.378ZM-54.784 386.709L-49.3864 378.783L-48.9257 378.082L-39.3813 381.378V409.435L-54.784 386.709ZM-72.622 381.378L-63.8675 378.362H-63.0777L-57.2194 386.99L-72.622 409.576V381.378ZM514.587 380.116V369.454L523.341 366.438H524.131L539.468 388.954L514.587 380.116ZM467.523 366.859L467.984 366.157L477.528 369.454V379.695L452.581 388.323L467.523 366.859ZM330.545 379.695V369.174L339.234 366.157H340.024L355.426 388.743L330.545 379.695ZM283.481 366.438L284.008 365.737L293.487 369.033V379.695L268.605 388.323L283.481 366.438ZM146.569 379.695V369.033L155.324 366.017H156.048L171.45 388.603L146.569 379.695ZM99.5056 366.438L99.9664 365.737L109.445 369.033V379.695L84.5638 388.252L99.5056 366.438ZM-37.4724 379.695V369.103L-28.718 366.017H-27.9281L-12.5913 388.603L-37.4724 379.695ZM-84.536 366.438L-84.0753 365.737L-74.5309 369.033V379.695L-99.4779 388.323L-84.536 366.438ZM571.458 399.686V381.098L587.19 358.091L588.045 356.758L604.633 381.098V399.756L588.045 405.437L571.458 399.686ZM387.153 399.686V381.098L402.885 358.091L403.806 356.758L420.394 381.098V399.686L403.74 405.437L387.153 399.686ZM203.177 399.686V381.098L218.843 358.091L219.765 356.758L236.352 381.098V399.686L219.765 405.437L203.177 399.686ZM18.8722 399.686V381.098L34.6039 358.091L35.4597 356.758L52.0471 381.098V399.756L35.4597 405.437L18.8722 399.686ZM-165.433 399.686V381.098L-149.701 358.091L-148.779 356.758L-132.192 381.098V399.686L-147.924 405.016L-165.433 399.686ZM541.838 390.076L526.04 365.666L552.369 356.478L568.957 362.229V380.817L558.688 395.828L541.838 390.076ZM421.776 380.747V362.159L437.969 356.548H438.363L465.153 365.877L448.566 390.146L431.979 395.898L421.776 380.747ZM358.915 389.585L342.327 365.246L368.657 356.057H369.052L385.639 361.809V380.396L375.371 395.477L358.915 389.585ZM238.853 380.186V361.598L255.112 355.987L281.967 365.316L265.446 389.515L248.793 395.267L238.853 380.186ZM174.61 389.515L158.022 365.105L184.352 355.987H184.681L201.268 361.739V380.326L191 395.407L174.61 389.515ZM54.5484 380.116V361.528L70.8067 355.917H71.1358L97.9917 365.246L81.4042 389.585L64.8168 395.337L54.5484 380.116ZM-9.69505 389.375L-26.2825 365.035L0.0467682 355.847H0.3759L17.0292 361.598V380.186L6.82657 395.196L-9.69505 389.375ZM-129.493 380.046V361.458L-113.301 355.847H-112.906L-86.05 365.176L-102.703 389.515L-119.291 395.196L-129.493 380.046ZM518.997 354.935L524.394 347.009L524.855 346.307L549.736 354.935L524.855 363.562L518.997 354.935ZM442.379 354.935L466.47 346.588H467.26L473.118 355.215L467.26 363.843L442.379 354.935ZM334.955 354.935L340.353 347.079L340.879 346.377L365.497 354.865L340.55 363.422L334.955 354.935ZM258.337 354.935L282.494 346.588H283.218L289.142 355.215L283.218 363.843L258.337 354.935ZM150.914 354.935L156.377 347.009L156.838 346.307L181.719 354.935L156.838 363.562L150.914 354.935ZM74.2953 354.935L98.4525 346.588H99.2423L105.101 355.215L99.2423 363.843L74.2953 354.935ZM-33.0623 354.935L-27.6648 347.009L-27.204 346.307L-2.32286 354.935L-27.204 363.562L-33.0623 354.935ZM-109.68 354.935L-85.5892 346.588H-84.7993L-78.9411 355.145L-84.7993 363.773L-109.68 354.935ZM589.296 354.935L604.699 332.419V349.604L620.101 354.935L604.699 360.266V377.521L589.296 354.935ZM571.458 360.266L556.055 354.935L571.458 349.604V332.419L586.861 354.935L571.458 377.521V360.266ZM404.991 354.865L420.394 332.279V349.534L435.796 354.865L420.394 360.195V377.45L404.991 354.865ZM387.219 360.195L372.079 354.865L387.482 349.534V332.279L402.819 354.865L387.416 377.38L387.219 360.195ZM220.949 354.794L236.352 332.209V349.464L251.755 354.794L236.352 360.125V377.31L220.949 354.794ZM203.177 360.125L187.775 354.724L203.177 349.393V332.209L218.58 354.794L203.177 377.31V360.125ZM36.9736 354.654L52.3762 332.138V349.323L67.713 354.724L52.3104 359.985V377.24L36.9736 354.654ZM19.1355 359.985L3.73288 354.654L19.1355 349.323V332.138L34.5381 354.654L19.1355 377.24V359.985ZM-147.068 354.584L-131.665 332.068V349.253L-116.263 354.584L-131.665 359.915V377.17L-147.068 354.584ZM-164.84 359.915L-180.243 354.584L-164.84 349.253V331.998L-149.504 354.584L-164.906 377.17L-164.84 359.915Z"
        fill="white"
        fillOpacity="0.1"
      />
    </Svg>
  );
}

const CATEGORIES = [
  { id: 'women', labelKey: 'fatwa.women', image: require('@/assets/images/fatima.jpg') },
  { id: 'illness', labelKey: 'fatwa.illness', image: require('@/assets/images/medical.jpg') },
  { id: 'proxy', labelKey: 'fatwa.proxySacr', image: require('@/assets/images/goat.png') },
  { id: 'ritual', labelKey: 'fatwa.missedRitu', image: require('@/assets/images/umrah.jpg') },
] as const;

const HERO_IMAGES = [
  require('@/assets/images/tents.jpg'),
  require('@/assets/images/madinah.jpg'),
  require('@/assets/images/umrah.jpg'),
];

export default function FataScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSendButton, setShowSendButton] = useState(false);
  const [currentFatwa, setCurrentFatwa] = useState<typeof DEFAULT_ANSWER | null>(DEFAULT_ANSWER);
  
  // Helper to get translated fatwa content
  const getFatwaContent = (fatwa: typeof DEFAULT_ANSWER) => {
    return {
      question: t(fatwa.questionKey),
      answer: t(fatwa.answerKey),
      source: fatwa.source,
      date: fatwa.date,
    };
  };
  const [fadeAnim] = useState(new Animated.Value(1));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageFadeAnim] = useState(new Animated.Value(1));

  const [fontsLoaded] = useFonts({
    'Inter-SemiBold': Inter_600SemiBold,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'OpenSans-Regular': OpenSans_400Regular,
  });

  // Carousel auto-advance
  React.useEffect(() => {
    if (!fontsLoaded) return;
    
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(imageFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Change image
        setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        // Fade in
        Animated.timing(imageFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [imageFadeAnim, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setShowSendButton(text.length > 0);
  };

  const handleSend = () => {
    if (searchQuery.trim().length === 0) return;

    const queryLower = searchQuery.toLowerCase();
    let foundFatwa = DEFAULT_ANSWER;

    // Search in fatwa data
    for (const [key, fatwa] of Object.entries(FATWA_DATA)) {
      const fatwaContent = getFatwaContent(fatwa);
      if (queryLower.includes(key) || fatwaContent.question.toLowerCase().includes(queryLower) || fatwaContent.answer.toLowerCase().includes(queryLower)) {
        foundFatwa = fatwa;
        break;
      }
    }

    // Fade out then fade in
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentFatwa(foundFatwa);
      setSearchQuery('');
      setShowSendButton(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#B82073" />
      
      {/* Header with Pink to Black Gradient - Same as Home */}
      <LinearGradient
        colors={['#B82073', '#1B131F']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContainer}>
            <View pointerEvents="none" style={styles.headerFrameBase}>
              <View style={styles.headerPatternWrapper}>
                <HeaderFramePattern
                  width={SCREEN_WIDTH}
                  height={SCREEN_WIDTH * (422 / 375)}
                />
              </View>
            </View>
            <View style={styles.headerContent}>
              {/* Status Bar Area */}
              <View style={styles.statusBarArea}>
                <Text style={styles.statusTime}></Text>
              </View>
              {/* Greeting Section */}
              <View style={styles.greetingRow}>
                <View style={styles.greetingTexts}>
                  <Text style={styles.greetingLine}>As-salamu alaykum,</Text>
                  <Text style={styles.nameText}>Abrar Mohammed</Text>
                </View>
                <View style={styles.rightIcons}>
                  <TouchableOpacity style={styles.bellButton}>
                    <Ionicons name="notifications" size={16} color="#8A0D4A" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Image
                      source={require('@/assets/images/profilepic.png')}
                      style={styles.avatar}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Search Bar */}
              <View style={styles.searchBox}>
                <Ionicons name="add-circle-outline" size={18} color="#999" />
                <TextInput
                  style={styles.searchField}
                  placeholder={t('fatwa.askAnything')}
                  placeholderTextColor="#B0B0B0"
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                />
                {showSendButton ? (
                  <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>{t('common.send')}</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity style={styles.filterIconButton}>
                      <Ionicons name="mic-outline" size={18} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterIconButton}>
                      <Ionicons name="menu-outline" size={18} color="#666" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      
      <View style={styles.container}>
        <ScrollView 
          style={styles.mainScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Popular Fatwa Hero Image */}
          <TouchableOpacity 
            style={styles.heroContainer}
            onPress={() => router.push({
              pathname: '/fatwadetailscreen',
              params: { imageIndex: currentImageIndex.toString() }
            })}
            activeOpacity={0.9}
          >
            <Animated.View style={[styles.heroImageContainer, { opacity: imageFadeAnim }]}>
              <Image
                source={HERO_IMAGES[currentImageIndex]}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </Animated.View>
            <Text style={styles.popularFatwaText}>{t('fatwa.popularFatwa')}</Text>
            {/* Dots Indicator */}
            <View style={styles.dotsIndicator}>
              {HERO_IMAGES.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, index === currentImageIndex && styles.dotActive]}
                />
              ))}
            </View>
          </TouchableOpacity>

          {/* Category Cards */}
          <View style={styles.categoriesRow}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => {
                  const fatwa = FATWA_DATA[category.id] || DEFAULT_ANSWER;
                  Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                  }).start(() => {
                    setCurrentFatwa(fatwa);
                    Animated.timing(fadeAnim, {
                      toValue: 1,
                      duration: 300,
                      useNativeDriver: true,
                    }).start();
                  });
                }}
              >
                <Image source={category.image} style={styles.categoryImage} resizeMode="cover" />
                <View style={styles.categoryLabelOverlay}>
                  <Text style={styles.categoryLabel}>{t(category.labelKey)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Question and Answer Cards */}
          {currentFatwa && (
            <Animated.View style={[styles.fatwaContainer, { opacity: fadeAnim }]}>
              {/* Question Card */}
              <View style={styles.questionCard}>
                <QuestionIcon />
                <Text style={styles.questionText}>
                  {getFatwaContent(currentFatwa).question}
                </Text>
              </View>

              {/* Answer Card */}
              <View style={styles.answerCard}>
                <Text style={styles.answerText}>
                  {getFatwaContent(currentFatwa).answer}
                </Text>
              </View>

              {/* Source Row - Outside Card */}
              <View style={styles.sourceRow}>
                <Text style={styles.sourceText}>{getFatwaContent(currentFatwa).source}</Text>
              </View>
            </Animated.View>
          )}
        </ScrollView>

        <BottomTabs active="home" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  headerGradient: {
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerFrameBase: {
    position: 'absolute',
    top: 0,
    left: -(SCREEN_WIDTH * 0.25),
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * (422 / 375),
    zIndex: 0,
    opacity: 0.8,
  },
  headerPatternWrapper: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statusBarArea: {
    height: 20,
    justifyContent: 'center',
  },
  statusTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greetingTexts: {
    flex: 1,
  },
  greetingLine: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDD',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    paddingHorizontal: 14,
    height: 42,
    width: 342,
    alignSelf: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchField: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontFamily: 'OpenSans-Regular',
  },
  filterIconButton: {
    padding: 4,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#952562',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  heroContainer: {
    width: 343,
    height: 166,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImageContainer: {
    width: '100%',
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  popularFatwaText: {
    position: 'absolute',
    top: 12,
    left: 16,
    fontSize: 25,
    color: '#FFFFFF',
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular', // Using OpenSans as fallback for Lilita One
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dotsIndicator: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: 343,
    alignSelf: 'center',
    marginBottom: 20,
  },
  categoryCard: {
    width: 160,
    height: 160,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryLabelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  fatwaContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  questionCard: {
    width: 339,
    minHeight: 43,
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  questionText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    fontWeight: '600',
    color: '#1B131F',
  },
  answerCard: {
    width: 337,
    minHeight: 102,
    borderRadius: 14.78,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  answerText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#1B131F',
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    alignSelf: 'flex-end',
    marginTop: 8,
    width: 339,
  },
  sourceText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 10,
    color: '#9A9A9A',
    textAlign: 'right',
  },
});


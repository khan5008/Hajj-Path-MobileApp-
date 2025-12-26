import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet as RNStyleSheet,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Line, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

function LogoutIcon() {
  return (
    <Svg width={14} height={19} viewBox="0 0 14 19" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1292" x1="0" y1="0" x2="18.1472" y2="13.3716" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.4071 0.905362H3.06852C2.476 0.905362 1.93685 1.14668 1.54602 1.53357C1.1552 1.92125 0.911919 2.45606 0.911919 3.04379V5.97013C0.911919 6.22001 0.707878 6.42241 0.45596 6.42241C0.204042 6.42241 0 6.22001 0 5.97013V3.04379C0 2.20695 0.344516 1.44483 0.90095 0.893683C1.45658 0.342535 2.22411 0 3.06854 0H10.9315C11.7759 0 12.5434 0.341738 13.0991 0.893683C13.6547 1.44483 14 2.20617 14 3.04379V15.9562C14 16.7931 13.6555 17.5552 13.0991 18.1063C12.5434 18.6575 11.7759 19 10.9315 19H3.06854C2.22411 19 1.45658 18.6583 0.90095 18.1063C0.34532 17.5552 0 16.7938 0 15.9562V13.0299C0 12.78 0.204042 12.5776 0.45596 12.5776C0.707878 12.5776 0.911919 12.78 0.911919 13.0299V15.9562C0.911919 16.5439 1.1552 17.0788 1.54602 17.4664C1.93685 17.8541 2.476 18.0946 3.06852 18.0946H10.4071V0.903727V0.905362ZM8.50158 9.14927C8.60439 9.23257 8.67031 9.35869 8.67031 9.50036C8.67031 9.63815 8.60832 9.76115 8.51021 9.84445C7.2671 11.0737 5.85522 12.2959 4.56278 13.4892C4.37914 13.6589 4.09111 13.6488 3.92004 13.4659C3.74895 13.2837 3.75916 12.998 3.94358 12.8283L7.05685 9.95338H0.456633C0.204715 9.95338 0.000673092 9.75099 0.000673092 9.5011C0.000673092 9.25121 0.204715 9.04882 0.456633 9.04882H7.05685L3.94358 6.1739C3.75994 6.00419 3.74974 5.71849 3.92004 5.53634C4.09112 5.35418 4.37915 5.34406 4.56278 5.51298L8.50097 9.14998L8.50158 9.14927Z"
        fill="url(#paint0_linear_5_1292)"
      />
    </Svg>
  );
}

function DarkModeToggleOn() {
  return (
    <Svg width={32} height={19} viewBox="0 0 32 19" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1291" x1="0" y1="0" x2="15.7538" y2="27.5692" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M32 9.14286C32 14.1857 27.8667 18.2857 22.8571 18.2857C17.8476 18.2857 13.7143 14.1857 13.7143 9.14286C13.7143 4.1 17.8476 0 22.8571 0C27.8667 0 32 4.1 32 9.14286Z"
        fill="url(#paint0_linear_5_1291)"
      />
      <Path
        d="M15.4286 9.14286C15.4286 11.4571 13.6 13.2857 11.2857 13.2857C8.97143 13.2857 7.14286 11.4571 7.14286 9.14286C7.14286 6.82857 8.97143 5 11.2857 5C13.6 5 15.4286 6.82857 15.4286 9.14286Z"
        fill="white"
      />
    </Svg>
  );
}

function GradientLine() {
  return (
    <Svg width={181} height={1} viewBox="0 0 181 1" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1279" x1="0" y1="1" x2="0.0110494" y2="2.99994" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Line x1="0.5" y1="0.5" x2="180.5" y2="0.5" stroke="url(#paint0_linear_5_1279)" strokeLinecap="round" />
    </Svg>
  );
}

function MyPackageIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1275" x1="0" y1="0" x2="13" y2="13" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M2.41881 11.5607C3.57558 12.4914 5.0154 12.9991 6.49999 13C7.9844 13.0058 9.42513 12.4979 10.5779 11.5625C10.8386 11.3523 11.0829 11.1225 11.3086 10.875C12.1847 9.91166 12.7512 8.70742 12.935 7.41829C13.1187 6.12916 12.9111 4.81456 12.3391 3.6448C11.7671 2.47505 10.857 1.50405 9.72678 0.857623C8.59657 0.211194 7.2983 -0.0808771 6.00018 0.0192516C4.70207 0.11938 3.46393 0.607094 2.44619 1.4192C1.42844 2.23131 0.678003 3.33039 0.292093 4.57403C-0.0938171 5.81768 -0.0974103 7.14857 0.281779 8.39428C0.660968 9.63999 1.40546 10.7431 2.41881 11.5607ZM6.49999 0.856273C7.55743 0.855947 8.59362 1.15317 9.49014 1.71398C10.3867 2.27479 11.1073 3.07656 11.5698 4.02764C12.0323 4.97872 12.2178 6.04074 12.1053 7.09232C11.9928 8.1439 11.5868 9.14262 10.9336 9.97431C10.5872 8.54108 8.73392 7.44566 6.49999 7.44566C4.26464 7.44566 2.41233 8.54121 2.06627 9.97457C1.41312 9.14284 1.00712 8.14411 0.894641 7.09252C0.782167 6.04093 0.967766 4.9789 1.43023 4.02781C1.89269 3.07673 2.61335 2.27495 3.50986 1.71411C4.40637 1.15327 5.44256 0.856004 6.49999 0.856273Z"
        fill="url(#paint0_linear_5_1275)"
      />
    </Svg>
  );
}

function HotelInfoIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1280" x1="0" y1="0" x2="11.1734" y2="11.9715" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M11.6834 8.28875L8.98154 7.29612C8.43731 7.09772 7.82317 7.2134 7.42016 7.61018L7.10418 7.90811C6.96367 8.04058 6.73542 8.07354 6.55995 7.97402C5.77035 7.54362 4.3138 6.60075 3.40155 5.02906C3.29599 4.84681 3.33164 4.61546 3.5071 4.48298L3.87586 4.20187C4.40226 3.80508 4.57773 3.12652 4.2967 2.56429L3.174 0.248157C3.10408 0.0827191 2.92862 0 2.75316 0C2.24458 0.0168019 0.577717 0.198393 0.103255 2.01818C-0.0372554 2.54745 -0.0372555 3.12648 0.121075 3.72236C0.559743 5.40966 2.5248 10.9687 9.28027 11.2H9.38583C10.0699 11.2 10.7368 10.9518 11.2282 10.5053C11.7368 10.0419 12 9.42994 12 8.75132V8.70156C11.9815 8.50381 11.8588 8.35466 11.6834 8.28875Z"
        fill="url(#paint0_linear_5_1280)"
      />
    </Svg>
  );
}

function LanguageIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1286" x1="0" y1="0" x2="14" y2="14" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4081 1.56409C10.2047 0.586369 8.67081 0 7.0012 0C5.83278 0 4.73064 0.286943 3.76275 0.794542C4.01768 0.878311 4.3557 0.968948 4.63063 0.968948C5.03177 0.968948 5.8934 0.885179 6.46692 0.997705C6.7962 1.06272 7.0405 1.20274 7.14797 1.39654C7.35166 1.76226 7.51662 2.34238 7.50725 2.71058C7.501 2.96689 7.40103 3.14317 7.27169 3.21944C7.17921 3.27445 7.06987 3.30571 6.93677 3.33696C6.72246 3.3876 6.42691 3.45449 6.02702 3.82081C5.65838 4.15902 5.49154 4.39219 5.35659 4.56911C5.24662 4.71414 5.15165 4.82729 5.01356 4.92981C4.87735 5.03046 4.79988 5.16924 4.69991 5.26864C4.53621 5.43179 4.34375 5.53994 3.99698 5.46556C3.78642 5.42055 3.55337 5.36804 3.34904 5.37054C3.22595 5.37179 3.11098 5.38367 3.05349 5.48369C3.0135 5.55308 3.01537 5.63247 3.04662 5.70311C3.11035 5.84752 3.27842 5.95566 3.49899 5.9688C3.7158 5.9813 3.85514 6.05257 3.9526 6.14321C4.05008 6.23323 4.10756 6.34762 4.14442 6.46954C4.16442 6.53392 4.17754 6.60081 4.19441 6.66145C4.23315 6.63644 4.28376 6.60394 4.32187 6.57768C4.52745 6.4364 4.78299 6.3045 5.12915 6.37639C5.69274 6.49392 5.86206 6.63957 6.50752 7.12092C6.80868 7.34534 6.89616 7.52914 6.95365 7.67979C6.97489 7.73606 6.97864 7.78732 7.018 7.82983C7.06112 7.87546 7.1386 7.90297 7.28043 7.94048C7.6397 8.03425 7.95461 8.05175 8.15018 8.11301C8.33639 8.17115 8.44948 8.26992 8.50258 8.39933C8.54882 8.51248 8.55632 8.67189 8.45509 8.89757C8.23016 9.39892 7.9946 9.71149 7.96398 10.0384C7.94274 10.2647 7.80091 10.4098 7.61346 10.5267C7.54972 10.5661 7.48099 10.6023 7.42164 10.6461C7.38852 10.6705 7.35416 10.6961 7.35416 10.7455C7.35416 10.8861 7.39227 10.983 7.40789 11.0655C7.42851 11.1718 7.42664 11.2662 7.39165 11.3606C7.35103 11.4719 7.25543 11.5994 7.00676 11.7444C6.81181 11.8582 6.65811 11.9207 6.54064 11.9782C6.45941 12.0176 6.40567 12.0426 6.39005 12.1401C6.37818 12.2145 6.42129 12.3171 6.46628 12.429C6.56563 12.679 6.71121 12.9503 6.76495 13.1147C6.82743 13.306 6.77557 13.4436 6.71934 13.5061C6.65873 13.5736 6.5169 13.6692 6.33757 13.7124C6.07577 13.7761 5.74399 13.7411 5.5178 13.4154C5.32973 13.1454 5.06917 12.7196 4.95671 12.3608C4.8961 12.1677 4.87861 11.9883 4.90985 11.847C4.9161 11.8182 4.91985 11.7826 4.92109 11.7682L4.83737 11.6226C4.8005 11.5413 4.76176 11.425 4.74115 11.2312C4.7124 10.9599 4.78301 10.6617 4.803 10.3917C4.81487 10.2341 4.81675 10.0853 4.67179 9.99095C4.31064 9.75589 3.81577 9.22704 3.60834 8.77442C3.49338 8.52312 3.46776 8.28806 3.53274 8.11178C3.59647 7.93987 3.67083 7.77108 3.71518 7.67294C3.47962 7.53478 3.01164 7.2591 2.82107 7.0203C2.65674 6.81462 2.54802 6.68898 2.25247 6.68085C1.71888 6.66647 1.32336 6.60458 1.21964 6.05508C1.2009 5.95506 1.09843 5.79752 0.976591 5.61873C0.784149 5.33617 0.532347 5.01984 0.351774 4.80167C0.123086 5.49307 0 6.23073 0 6.99847C0 10.863 3.13544 14 6.99804 14C8.92742 14 10.6757 13.2167 11.9423 11.9514C11.9523 11.8726 11.9385 11.782 11.9166 11.6832C11.8642 11.4513 11.7536 11.1868 11.6411 10.9268C11.5174 10.6417 11.3899 10.3604 11.3149 10.121C11.2531 9.92405 11.2268 9.74965 11.2443 9.61398C11.2756 9.36956 11.3318 9.23265 11.3755 9.12201C11.4136 9.02636 11.4299 8.96447 11.3649 8.77567C11.2212 8.35558 10.9719 7.8661 10.672 7.68606C10.5851 7.63355 10.5133 7.66981 10.4252 7.70919C10.2415 7.79108 10.0259 7.91611 9.71973 7.98863C9.50416 8.03989 9.34547 8.01863 9.22362 7.96362C9.0899 7.90361 8.99243 7.79984 8.91933 7.66106C8.82811 7.48665 8.78312 7.23722 8.68503 7.00528C8.47322 6.50455 8.4451 6.21636 8.4601 5.88254C8.47135 5.63623 8.57382 5.53935 8.72377 5.45808C8.80875 5.41244 8.94184 5.38931 9.06118 5.20678C9.26113 4.90108 9.3761 4.86795 9.55229 4.8442C9.65601 4.83045 9.80472 4.83545 10.1009 4.72355C10.8032 4.45975 11.2856 4.6104 11.7099 4.63978C12.1216 4.66854 12.4059 4.75105 13.0164 4.92171C13.3507 5.01486 13.58 4.92984 13.67 4.8842C13.6212 4.72855 13.5662 4.57538 13.5069 4.42535C13.3076 4.4341 12.8158 4.43848 12.3778 4.2997C12.1448 4.22593 12.0367 4.17092 11.9498 4.1234C11.8486 4.06714 11.7836 4.02213 11.4818 3.95025C11.3681 3.92274 11.2581 3.95212 11.155 3.99901C11.0157 4.06215 10.8857 4.15779 10.7664 4.24719C10.5446 4.41286 10.3402 4.54913 10.1847 4.56913C10.071 4.58414 9.97848 4.56163 9.90226 4.52037C9.79229 4.46036 9.71356 4.3547 9.67669 4.22031C9.63858 4.07965 9.65045 3.90211 9.70731 3.75584C9.75105 3.64081 9.82227 3.54641 9.90538 3.48702C10.0984 3.3495 10.5396 2.9369 10.9251 2.68872C10.9495 2.67247 10.9513 2.64746 10.9513 2.62433C10.9507 2.59245 10.9463 2.55994 10.9401 2.52806C10.9182 2.41179 10.8845 2.29614 10.8776 2.20362C10.8682 2.06984 10.9026 1.9617 10.972 1.88168C11.0232 1.82354 11.095 1.77416 11.205 1.75228C11.2737 1.73853 11.3206 1.68601 11.3575 1.636C11.375 1.61225 11.3906 1.58724 11.4037 1.56224L11.4081 1.56409ZM3.18611 1.13274C2.03269 1.88541 1.11357 2.96947 0.565561 4.24911C0.706771 4.41478 1.12104 4.908 1.40782 5.32997C1.58152 5.58377 1.70524 5.82008 1.7321 5.96198C1.7421 6.01636 1.75584 6.05762 1.78333 6.08576C1.82707 6.13202 1.8933 6.14014 1.96703 6.14952C2.05888 6.1614 2.16134 6.16327 2.27069 6.16577C2.76055 6.17953 2.95737 6.35956 3.22979 6.69963C3.43161 6.95281 4.00458 7.2385 4.1158 7.30852C4.24576 7.39166 4.29762 7.50357 4.27201 7.6686C4.25389 7.78487 4.13892 7.97991 4.02332 8.29373C4.00958 8.33249 4.0202 8.37812 4.03457 8.42876C4.05894 8.51878 4.10643 8.61568 4.16641 8.71508C4.36573 9.0464 4.70252 9.39273 4.95868 9.559C5.22798 9.73468 5.31983 9.9766 5.32796 10.2554C5.3367 10.5411 5.22798 10.8768 5.25985 11.1787C5.28609 11.4213 5.35108 11.4707 5.38482 11.5319C5.43355 11.6207 5.47167 11.7195 5.41918 11.9608C5.39731 12.0608 5.44292 12.1927 5.50041 12.3352C5.61413 12.6159 5.80407 12.9185 5.94592 13.1217C6.01965 13.2286 6.1315 13.2323 6.21771 13.2111C6.22646 13.2092 6.23646 13.206 6.2452 13.2023C6.24083 13.1904 6.23646 13.1785 6.23146 13.1679C6.17147 13.0291 6.08525 12.8566 6.01464 12.6891C5.91467 12.4509 5.85593 12.2165 5.88093 12.0602C5.92466 11.7914 6.03338 11.6707 6.22457 11.5619C6.34391 11.4944 6.51512 11.4344 6.7488 11.2988C6.80253 11.2675 6.84439 11.24 6.87626 11.2125C6.88563 11.205 6.89688 11.1937 6.90313 11.1862C6.9 11.1687 6.89251 11.1287 6.88688 11.1025C6.86376 11.0068 6.83815 10.8937 6.83815 10.748C6.83815 10.4861 6.97436 10.3254 7.15806 10.2016C7.22679 10.1554 7.30239 10.1154 7.37049 10.0704C7.40423 10.0485 7.44672 10.0347 7.45047 9.99222C7.48484 9.62089 7.72914 9.25643 7.98469 8.68757C7.99531 8.66444 8.00406 8.63693 8.01031 8.61568C7.99906 8.6113 7.98719 8.60693 7.97657 8.60442C7.91283 8.58692 7.83661 8.57442 7.751 8.56066C7.57855 8.53316 7.37298 8.50315 7.15179 8.44501C6.75377 8.34124 6.63006 8.20371 6.55321 8.06431C6.53071 8.02305 6.51322 7.97991 6.49635 7.93428C6.45823 7.83113 6.42262 7.70485 6.20017 7.53982C5.64658 7.12599 5.50912 6.98783 5.02613 6.88656C4.88367 6.85718 4.77496 6.90781 4.68373 6.96408C4.58751 7.02284 4.50503 7.08911 4.42944 7.13349C4.26011 7.23226 4.1039 7.24977 3.95082 7.166C3.81835 7.09411 3.7415 6.96533 3.69714 6.80217C3.6809 6.74341 3.6684 6.6784 3.64903 6.61588C3.63841 6.58337 3.62904 6.54961 3.60217 6.52523C3.57468 6.50023 3.53094 6.49147 3.47096 6.48835C2.69118 6.44209 2.31627 5.7313 2.60683 5.22682C2.7318 5.01052 2.93487 4.89925 3.1848 4.8655C3.46035 4.82861 3.804 4.89613 4.10828 4.96114C4.25387 4.9924 4.31947 4.92739 4.38446 4.85049C4.47819 4.74047 4.57254 4.61481 4.70687 4.51479C4.80434 4.4429 4.86807 4.35975 4.94618 4.25723C5.09364 4.06344 5.27546 3.80962 5.67909 3.44079C6.11147 3.04445 6.44825 2.92756 6.70569 2.86191C6.81378 2.83441 6.90438 2.82441 6.97686 2.79252C6.98186 2.75377 6.99248 2.65374 6.98561 2.57811C6.95936 2.2868 6.83877 1.90547 6.69693 1.65165C6.67069 1.60539 6.61321 1.58163 6.54823 1.55788C6.43451 1.51599 6.29267 1.49161 6.13959 1.47661C5.61348 1.4266 4.96117 1.48974 4.63188 1.48974C4.07079 1.48974 3.28101 1.17341 3.18729 1.13465L3.18611 1.13274ZM13.8143 5.39432C13.6181 5.47371 13.3007 5.5406 12.8815 5.42432C12.3191 5.26679 12.058 5.18614 11.6787 5.16052C11.3119 5.13489 10.8945 4.98485 10.2872 5.21241C9.99355 5.32306 9.81609 5.34244 9.69174 5.35432C9.65363 5.35807 9.62426 5.35619 9.59802 5.36619C9.56303 5.37995 9.54678 5.42121 9.4993 5.49372C9.36183 5.70314 9.21813 5.79691 9.09504 5.85943C9.0588 5.87819 9.00882 5.90257 8.98195 5.9157C8.9707 6.1795 8.99819 6.40955 9.16626 6.80651C9.24437 6.9903 9.28686 7.1841 9.34684 7.34289C9.36996 7.40415 9.38808 7.46041 9.43306 7.49042C9.4718 7.51668 9.52679 7.50667 9.60426 7.48792C9.93791 7.40915 10.1504 7.25537 10.3403 7.19035C10.544 7.12034 10.7302 7.11659 10.9439 7.24474C11.3257 7.47416 11.6768 8.07617 11.8599 8.61129C11.9717 8.93762 11.9461 9.08327 11.8918 9.23769C11.8568 9.33896 11.793 9.44524 11.763 9.68404C11.753 9.76093 11.7787 9.85782 11.8137 9.96974C11.8843 10.1935 12.0048 10.4573 12.1204 10.7249C12.2292 10.975 12.3329 11.2288 12.3972 11.4594C13.3982 10.2485 14 8.69515 14 7.00214C14 6.4489 13.9363 5.91065 13.8144 5.39491L13.8143 5.39432ZM11.8037 1.91035C11.7962 1.92161 11.7875 1.93411 11.7793 1.94474C11.6906 2.06664 11.5681 2.17604 11.4144 2.23293C11.4282 2.29919 11.4476 2.39483 11.4588 2.46298C11.5013 2.71678 11.4644 2.96309 11.2095 3.12687C10.8308 3.37004 10.3997 3.77576 10.211 3.91078C10.1898 3.92579 10.1879 3.96017 10.1823 3.99143C10.1804 4.00393 10.1792 4.02018 10.1798 4.03519C10.2091 4.01893 10.241 3.99393 10.2766 3.96892C10.3772 3.89891 10.4878 3.81014 10.6059 3.72762C10.9033 3.52007 11.2476 3.36191 11.6069 3.44756C11.933 3.52508 12.0449 3.58196 12.1498 3.6401C12.2317 3.68573 12.3079 3.73387 12.5385 3.80701C12.799 3.88953 13.0821 3.91079 13.2833 3.91329C12.9121 3.15875 12.4085 2.4811 11.8037 1.90917L11.8037 1.91035Z"
        fill="url(#paint0_linear_5_1286)"
      />
    </Svg>
  );
}

function DarkModeIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1287" x1="0" y1="0" x2="14" y2="14" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.9907 8.75C13.2015 11.7687 10.4188 14 7.10745 14C3.18236 14 0 10.8658 0 7C0 3.13425 3.18236 0 7.10745 0C7.19976 0 7.29208 0.00205082 7.38439 0.00546875C7.51418 0.0109375 7.61899 0.0950197 7.65092 0.218759C7.68285 0.341122 7.6294 0.465544 7.51974 0.531851C6.03439 1.39796 5.03764 2.99218 5.03764 4.81585C5.03764 7.56528 7.29958 9.79303 10.0912 9.79303C11.4134 9.79303 12.6177 9.29263 13.5186 8.47368C13.613 8.38823 13.7497 8.37388 13.8601 8.43882C13.9711 8.50103 14.0226 8.62559 13.9907 8.75Z"
        fill="url(#paint0_linear_5_1287)"
      />
    </Svg>
  );
}

function HelpCentreIcon() {
  return (
    <Svg width={13} height={16} viewBox="0 0 13 16" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_5_1293" x1="0" y1="0" x2="15.6612" y2="12.7247" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M13 6.47034V6.91616C12.671 6.70013 12.292 6.57326 11.8992 6.54717C11.9195 5.10164 11.3601 3.70756 10.3456 2.67813C9.33104 1.6487 7.94542 1.06877 6.50048 1.06877C5.05553 1.06877 3.66995 1.64872 2.65539 2.67813C1.64083 3.70754 1.08144 5.10166 1.10174 6.54717C0.708971 6.57327 0.329972 6.70013 0.000986884 6.91616C-0.128726 -2.02449 12.5711 -2.42758 13 6.47034ZM3.41869 6.85021C2.84259 6.80599 2.29765 7.11771 2.0433 7.63749H1.28385C0.57442 7.64039 0.00193294 8.21599 0.00120945 8.9257V10.7315C0.00120945 11.4405 0.574402 12.0161 1.28385 12.0197H2.04836C2.35707 12.6127 3.02955 12.9201 3.67956 12.7649C4.3303 12.6105 4.7919 12.0328 4.79988 11.3644V8.28703C4.80785 7.51135 4.19407 6.87196 3.41869 6.85021ZM11.7173 7.63749H10.9579C10.6507 7.04232 9.97818 6.73277 9.32598 6.88573C8.67452 7.03941 8.21074 7.61719 8.20132 8.28703V11.3644C8.21001 12.0313 8.67088 12.6069 9.31945 12.7613C9.96801 12.9164 10.6383 12.6105 10.947 12.0197H11.7173C12.4267 12.0161 12.9999 11.4405 12.9999 10.7315V8.92568C12.9999 8.21597 12.4268 7.64038 11.7173 7.63749ZM11.8992 13.1152C11.9659 13.4428 11.884 13.7836 11.676 14.046C11.4681 14.3084 11.155 14.465 10.8202 14.4751H8.43752C8.26216 14.2033 7.95781 14.0431 7.63389 14.051H6.42373C5.89038 14.0576 5.46139 14.4918 5.46139 15.0254C5.46139 15.5589 5.89038 15.9931 6.42373 15.9997H7.63461H7.63389C7.95781 16.0084 8.26216 15.8474 8.43752 15.5763H10.821C11.3985 15.5763 11.9536 15.3472 12.3623 14.9384C12.771 14.5288 13.0007 13.9742 13 13.3957V12.7411C12.6703 12.9557 12.292 13.0847 11.8992 13.1152Z"
        fill="url(#paint0_linear_5_1293)"
      />
    </Svg>
  );
}

function GradientText({ text }: { text: string }) {
  return (
    <MaskedView maskElement={<Text style={styles.gradientMaskText}>{text}</Text>}>
      <LinearGradient colors={['#B82073', '#1B131F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={styles.gradientHiddenText}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHotelInfoModal, setShowHotelInfoModal] = useState(false);
  const [showRitualScheduleModal, setShowRitualScheduleModal] = useState(false);

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Medium': Inter_500Medium,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
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
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('profile.myProfile')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('@/assets/images/profilepic.png')}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.editIconContainer}>
                <Ionicons name="pencil" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={[styles.profileInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={[styles.profileName, isRTL && { textAlign: 'right' }]}>{t('profile.userName')}</Text>
              <Text style={[styles.profileEmail, isRTL && { textAlign: 'right' }]}>{t('profile.userEmail')}</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => router.push('/login')}
            >
              <LogoutIcon />
              <GradientText text={t('common.logout')} />
            </TouchableOpacity>
          </View>

          {/* Hajj Journey Progress Card */}
          <View style={[styles.card, styles.journeyCard]}>
            <Text style={styles.cardTitle}>{t('profile.hajjJourneyProgress')}</Text>
            <View style={styles.gradientLineContainer}>
              <GradientLine />
            </View>
            <View style={[styles.progressContent, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.progressLeft, isRTL && { marginRight: 0, marginLeft: 8, alignItems: 'flex-end' }]}>
                <Text style={[styles.progressText, isRTL && { textAlign: 'right' }]}>{t('profile.ritualsCompleted')}</Text>
                <TouchableOpacity style={styles.viewGroupButton}>
                  <LinearGradient
                    colors={['#B82073', '#1B131F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.viewGroupButtonGradient, isRTL && { flexDirection: 'row-reverse' }]}
                  >
                    <Text style={styles.viewGroupText}>{t('profile.viewGroupSummary')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={[styles.progressRight, isRTL && { marginLeft: 0, marginRight: 8 }]}>
                <View style={styles.circularProgressContainer}>
                  <Svg width={69} height={69} style={styles.circularProgressSvg}>
                    <Circle
                      cx={34.5}
                      cy={34.5}
                      r={30.5}
                      stroke="#E8E8E8"
                      strokeWidth={8}
                      fill="none"
                    />
                    <Circle
                      cx={34.5}
                      cy={34.5}
                      r={30.5}
                      stroke="url(#progressGradient)"
                      strokeWidth={8}
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 30.5 * 0.87} ${2 * Math.PI * 30.5}`}
                      strokeDashoffset={-2 * Math.PI * 30.5 * 0.25}
                      transform="rotate(-90 34.5 34.5)"
                    />
                    <Defs>
                      <SvgLinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#B82073" />
                        <Stop offset="1" stopColor="#1B131F" />
                      </SvgLinearGradient>
                    </Defs>
                  </Svg>
                  <View style={styles.progressPercentContainer}>
                    <Text style={styles.progressPercent}>87%</Text>
                  </View>
                </View>
                <Text style={[styles.journeyStatus, isRTL && { textAlign: 'right' }]}>{t('profile.journeyInProcess')}</Text>
              </View>
            </View>
          </View>

          {/* Account Card */}
          <View style={[styles.card, styles.accountCard]}>
            <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('profile.account')}</Text>
            <View style={styles.gradientLineContainer}>
              <GradientLine />
            </View>
            <TouchableOpacity style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => router.push('/paymentscreen')}>
              <View style={styles.iconWrapper}>
                <MyPackageIcon />
              </View>
              <Text style={[styles.listItemText, isRTL && { textAlign: 'right' }]}>{t('profile.myPackage')}</Text>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color="#9A9A9A" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => setShowHotelInfoModal(true)}
            >
              <View style={styles.iconWrapper}>
                <HotelInfoIcon />
              </View>
              <Text style={[styles.listItemText, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfo')}</Text>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color="#9A9A9A" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => setShowRitualScheduleModal(true)}
            >
              <Ionicons name="bar-chart-outline" size={20} color="#45455F" />
              <Text style={[styles.listItemText, isRTL && { textAlign: 'right' }]}>{t('profile.ritualSchedule')}</Text>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color="#9A9A9A" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => router.push('/userrequestform')}>
              <Ionicons name="help-circle-outline" size={20} color="#45455F" />
              <Text style={[styles.listItemText, isRTL && { textAlign: 'right' }]}>{t('profile.request')}</Text>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color="#9A9A9A" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]} onPress={() => router.push('/usermealsscreen')}>
              <Ionicons name="restaurant-outline" size={20} color="#45455F" />
              <Text style={[styles.listItemText, isRTL && { textAlign: 'right' }]}>{t('profile.meals')}</Text>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color="#9A9A9A" />
            </TouchableOpacity>
          </View>

          {/* Support Card */}
          <View style={[styles.card, styles.supportCard]}>
            <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('profile.support')}</Text>
            <View style={styles.gradientLineContainer}>
              <GradientLine />
            </View>
            <TouchableOpacity 
              style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => setShowLanguageModal(true)}
            >
              <View style={styles.iconWrapper}>
                <LanguageIcon />
              </View>
              <Text style={[styles.listItemText, isRTL && { textAlign: 'right' }]}>{t('profile.language')}</Text>
              <View style={[styles.languageDropdown, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.languageText, isRTL && { textAlign: 'right' }]}>{language === 'ar' ? t('profile.arabic') : t('profile.english')}</Text>
                <Ionicons name="chevron-down" size={16} color="#9A9A9A" />
              </View>
            </TouchableOpacity>
            <View style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.iconWrapper}>
                <DarkModeIcon />
              </View>
              <Text style={[styles.listItemText, isRTL && { textAlign: 'right' }]}>{t('profile.darkMode')}</Text>
              <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
                {darkMode ? <DarkModeToggleOn /> : (
                  <View style={styles.toggleOff}>
                    <View style={styles.toggleCircle} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Help Centre Card */}
          <View style={styles.helpCard}>
            <View style={styles.helpIconWrapper}>
              <HelpCentreIcon />
            </View>
            <Text style={styles.helpText}>{t('profile.helpCentre')}</Text>
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => router.push('/callsupport')}
            >
              <Text style={styles.chatButtonText}>{t('profile.callSupport')}</Text>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color="#952562" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowLanguageModal(false)}
          >
            <View style={[styles.modalContent, isRTL && { direction: 'rtl' }]} onStartShouldSetResponder={() => true}>
              <Text style={[styles.modalTitle, isRTL && { textAlign: 'right' }]}>{t('profile.selectLanguage')}</Text>
              {[
                { key: 'en', label: t('profile.english') },
                { key: 'ar', label: t('profile.arabic') }
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.key}
                  style={[
                    styles.languageOption,
                    language === lang.key && styles.languageOptionActive,
                    isRTL && { flexDirection: 'row-reverse' },
                  ]}
                  onPress={async () => {
                    try {
                      await setLanguage(lang.key as 'en' | 'ar', false); // false = don't reload app
                      setShowLanguageModal(false);
                      // Language updated in place, no navigation
                    } catch (error) {
                      console.error('Error changing language:', error);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      language === lang.key && styles.languageOptionTextActive,
                      isRTL && { textAlign: 'right' },
                    ]}
                  >
                    {lang.label}
                  </Text>
                  {language === lang.key && (
                    <Ionicons name="checkmark" size={20} color="#952562" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Hotel Info Modal */}
        <Modal
          visible={showHotelInfoModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowHotelInfoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={RNStyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={() => setShowHotelInfoModal(false)}
            />
            <View style={[styles.hotelModalContent, isRTL && { direction: 'rtl' }]} onStartShouldSetResponder={() => true}>
              <View style={[styles.modalHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.hotelModalTitle, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfo')}</Text>
                <TouchableOpacity 
                  onPress={() => setShowHotelInfoModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#1B131F" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Hotel Image/Icon Header */}
                <View style={styles.hotelImageHeader}>
                  <View style={styles.hotelIconContainer}>
                    <Ionicons name="business" size={40} color="#B82073" />
                  </View>
                </View>

                <View style={styles.hotelInfoSection}>
                  <View style={styles.hotelInfoRow}>
                    <View style={[styles.hotelInfoRowWithIcon, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="business-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.hotelInfoLabel, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoName')}</Text>
                        <Text style={[styles.hotelInfoValue, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoNameValue')}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.hotelInfoRow}>
                    <View style={[styles.hotelInfoRowWithIcon, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="location-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.hotelInfoLabel, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoLocation')}</Text>
                        <Text style={[styles.hotelInfoValue, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoLocationValue')}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[styles.hotelInfoRowSplit, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={[styles.hotelInfoSplitItem, isRTL && { paddingRight: 0, paddingLeft: 12 }]}>
                      <View style={[styles.hotelInfoRowWithIcon, isRTL && { flexDirection: 'row-reverse' }]}>
                        <Ionicons name="log-in-outline" size={16} color="#77798A" style={isRTL ? { marginLeft: 6 } : { marginRight: 6 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.hotelInfoLabel, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoCheckIn')}</Text>
                          <Text style={[styles.hotelInfoValue, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoCheckInValue')}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.hotelInfoSplitItem}>
                      <View style={[styles.hotelInfoRowWithIcon, isRTL && { flexDirection: 'row-reverse' }]}>
                        <Ionicons name="log-out-outline" size={16} color="#77798A" style={isRTL ? { marginLeft: 6 } : { marginRight: 6 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.hotelInfoLabel, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoCheckOut')}</Text>
                          <Text style={[styles.hotelInfoValue, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoCheckOutValue')}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.hotelInfoRow}>
                    <View style={[styles.hotelInfoRowWithIcon, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="key-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.hotelInfoLabel, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoRoom')}</Text>
                        <Text style={[styles.hotelInfoValue, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoRoomValue')}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[styles.hotelInfoRow, styles.hotelInfoRowLast]}>
                    <View style={[styles.hotelInfoRowWithIcon, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="layers-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.hotelInfoLabel, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoFloor')}</Text>
                        <Text style={[styles.hotelInfoValue, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoFloorValue')}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.hotelFacilitiesSection}>
                  <Text style={[styles.hotelSectionTitle, isRTL && { textAlign: 'right' }]}>{t('profile.hotelInfoFacilities')}</Text>
                  <View style={styles.hotelFacilitiesGrid}>
                    {[
                      t('profile.hotelFacility1'),
                      t('profile.hotelFacility2'),
                      t('profile.hotelFacility3'),
                      t('profile.hotelFacility4'),
                      t('profile.hotelFacility5'),
                      t('profile.hotelFacility6'),
                    ].map((facility, index) => (
                      <View key={index} style={[styles.hotelFacilityItem, isRTL && { flexDirection: 'row-reverse' }]}>
                        <Ionicons name="checkmark-circle" size={18} color="#B82073" />
                        <Text style={[styles.hotelFacilityText, isRTL && { textAlign: 'right' }]}>{facility}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Contact Information Section */}
                <View style={styles.hotelContactSection}>
                  <Text style={[styles.hotelSectionTitle, isRTL && { textAlign: 'right' }]}>{t('profile.hotelContactInfo')}</Text>
                  <View style={styles.hotelInfoRow}>
                    <View style={[styles.hotelInfoRowWithIcon, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="call-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.hotelInfoLabel, isRTL && { textAlign: 'right' }]}>{t('profile.hotelPhone')}</Text>
                        <Text style={[styles.hotelInfoValue, isRTL && { textAlign: 'right' }]}>{t('profile.hotelPhoneValue')}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.hotelInfoRow, styles.hotelInfoRowLast]}>
                    <View style={[styles.hotelInfoRowWithIcon, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="mail-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.hotelInfoLabel, isRTL && { textAlign: 'right' }]}>{t('profile.hotelEmail')}</Text>
                        <Text style={[styles.hotelInfoValue, isRTL && { textAlign: 'right' }]}>{t('profile.hotelEmailValue')}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Directions Section */}
                <View style={styles.hotelDirectionsSection}>
                  <View style={[styles.hotelInfoRowWithIcon, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="map-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.hotelSectionTitle, isRTL && { textAlign: 'right' }]}>{t('profile.hotelDirections')}</Text>
                      <Text style={[styles.hotelDirectionsText, isRTL && { textAlign: 'right' }]}>{t('profile.hotelDirectionsValue')}</Text>
                    </View>
                  </View>
                </View>

                {/* Important Notes Section */}
                <View style={styles.hotelNotesSection}>
                  <Text style={[styles.hotelSectionTitle, isRTL && { textAlign: 'right' }]}>{t('profile.hotelImportantNotes')}</Text>
                  {[
                    t('profile.hotelNote1'),
                    t('profile.hotelNote2'),
                    t('profile.hotelNote3'),
                    t('profile.hotelNote4'),
                  ].map((note, index) => (
                    <View key={index} style={[styles.hotelNoteItem, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="information-circle" size={16} color="#B82073" style={isRTL ? { marginLeft: 10 } : { marginRight: 10 }} />
                      <Text style={[styles.hotelNoteText, isRTL && { textAlign: 'right' }]}>{note}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Ritual Schedule Modal */}
        <Modal
          visible={showRitualScheduleModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRitualScheduleModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={RNStyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={() => setShowRitualScheduleModal(false)}
            />
            <View style={[styles.ritualModalContent, isRTL && { direction: 'rtl' }]} onStartShouldSetResponder={() => true}>
              <View style={[styles.modalHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.ritualModalTitle, isRTL && { textAlign: 'right' }]}>{t('profile.ritualSchedule')}</Text>
                <TouchableOpacity 
                  onPress={() => setShowRitualScheduleModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#1B131F" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Ritual Schedule Header */}
                <View style={styles.ritualHeaderSection}>
                  <View style={styles.ritualIconContainer}>
                    <Ionicons name="calendar" size={32} color="#B82073" />
                  </View>
                  <Text style={[styles.ritualScheduleTitle, isRTL && { textAlign: 'right' }]}>{t('profile.ritualScheduleTitle')}</Text>
                  <Text style={[styles.ritualScheduleSubtitle, isRTL && { textAlign: 'right' }]}>{t('profile.ritualScheduleSubtitle')}</Text>
                </View>

                <View style={styles.ritualScheduleSection}>
                  {[
                    { day: t('profile.ritualDay1'), date: t('profile.ritualDate1'), location: t('profile.ritualLocation1'), activities: t('profile.ritualActivities1'), icon: 'flag-outline' },
                    { day: t('profile.ritualDay2'), date: t('profile.ritualDate2'), location: t('profile.ritualLocation2'), activities: t('profile.ritualActivities2'), icon: 'mountain-outline' },
                    { day: t('profile.ritualDay3'), date: t('profile.ritualDate3'), location: t('profile.ritualLocation3'), activities: t('profile.ritualActivities3'), icon: 'moon-outline' },
                    { day: t('profile.ritualDay4'), date: t('profile.ritualDate4'), location: t('profile.ritualLocation4'), activities: t('profile.ritualActivities4'), icon: 'home-outline' },
                    { day: t('profile.ritualDay5'), date: t('profile.ritualDate5'), location: t('profile.ritualLocation5'), activities: t('profile.ritualActivities5'), icon: 'time-outline' },
                    { day: t('profile.ritualDay6'), date: t('profile.ritualDate6'), location: t('profile.ritualLocation6'), activities: t('profile.ritualActivities6'), icon: 'checkmark-done-outline' },
                  ].map((ritual, index) => (
                    <View key={index} style={styles.ritualDayCard}>
                      <View style={[styles.ritualDayCardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                        <View style={styles.ritualDayNumber}>
                          <Ionicons name={ritual.icon as any} size={20} color="#B82073" />
                        </View>
                        <View style={[styles.ritualDayInfo, isRTL && { alignItems: 'flex-end', flex: 1 }]}>
                          <Text style={[styles.ritualDayTitle, isRTL && { textAlign: 'right' }]}>{ritual.day}</Text>
                          <Text style={[styles.ritualDayDate, isRTL && { textAlign: 'right' }]}>{ritual.date}</Text>
                        </View>
                        <View style={[styles.ritualLocationBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                          <Ionicons name="location" size={14} color="#FFFFFF" />
                          <Text style={styles.ritualLocationText}>{ritual.location}</Text>
                        </View>
                      </View>
                      <View style={styles.ritualActivitiesContainer}>
                        <Ionicons name="list-outline" size={16} color="#77798A" style={[isRTL ? { marginLeft: 8 } : { marginRight: 8 }, styles.ritualActivityIcon]} />
                        <Text style={[styles.ritualActivities, isRTL && { textAlign: 'right' }]}>{ritual.activities}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <BottomTabs active="profile" />
      </View>
    </SafeAreaView>
  );
}

const styles = RNStyleSheet.create({
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    width: 333,
    height: 68,
    borderRadius: 14.08,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E8E8E8',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#952562',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1B131F',
    marginBottom: 4,
    width: 107,
    height: 21,
  },
  profileEmail: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 10,
    color: '#212529',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14.78,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
    marginBottom: 4,
  },
  gradientLineContainer: {
    marginBottom: 4,
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  progressLeft: {
    flex: 1,
    marginRight: 8,
  },
  progressText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#212529',
    marginBottom: 6,
  },
  viewGroupButton: {
    borderRadius: 1000,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  viewGroupButtonGradient: {
    width: 151,
    height: 25,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  viewGroupText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  progressRight: {
    alignItems: 'center',
    marginLeft: 8,
    justifyContent: 'flex-start',
  },
  circularProgressContainer: {
    width: 69,
    height: 69,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circularProgressSvg: {
    position: 'absolute',
  },
  progressPercentContainer: {
    width: 69,
    height: 69,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
  },
  journeyStatus: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
    minHeight: 40,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#212529',
  },
  languageDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#45455F',
  },
  toggleOff: {
    width: 32,
    height: 19,
    borderRadius: 9.5,
    backgroundColor: '#E8E8E8',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  toggleCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FFFFFF',
  },
  journeyCard: {
    width: 333,
    minHeight: 113,
  },
  accountCard: {
    width: 333,
    minHeight: 143,
  },
  supportCard: {
    width: 333,
    minHeight: 119,
  },
  helpCard: {
    backgroundColor: '#FFFFFF',
    width: 333,
    height: 44,
    borderRadius: 14.78,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  helpIconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    flex: 1,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
  },
  gradientMaskText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#000',
  },
  gradientHiddenText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    opacity: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    marginBottom: 12,
  },
  languageOptionActive: {
    backgroundColor: '#F5E1EB',
    borderWidth: 2,
    borderColor: '#952562',
  },
  languageOptionText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#1B131F',
  },
  languageOptionTextActive: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#952562',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotelModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  hotelModalTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
    color: '#1B131F',
    flex: 1,
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 8,
  },
  hotelInfoSection: {
    marginBottom: 24,
  },
  hotelInfoRow: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  hotelInfoRowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  hotelInfoLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#77798A',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  hotelInfoValue: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    color: '#1B131F',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  hotelInfoRowSplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  hotelInfoSplitItem: {
    flex: 1,
    paddingRight: 12,
  },
  hotelFacilitiesSection: {
    marginTop: 8,
  },
  hotelSectionTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
    marginBottom: 16,
  },
  hotelFacilitiesGrid: {
    gap: 14,
  },
  hotelFacilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  hotelFacilityText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#212529',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  ritualModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  ritualModalTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
    color: '#1B131F',
    flex: 1,
  },
  ritualScheduleSection: {
    gap: 16,
  },
  ritualDayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ritualDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ritualDayCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  ritualDayInfo: {
    flex: 1,
  },
  ritualDayTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 17,
    color: '#1B131F',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  ritualDayDate: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#77798A',
    letterSpacing: 0.1,
  },
  ritualLocationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B82073',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  ritualLocationText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  ritualActivities: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#212529',
    lineHeight: 22,
    letterSpacing: 0.1,
    flex: 1,
  },
  hotelImageHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  hotelIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F0F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFE5F2',
  },
  hotelInfoRowWithIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hotelContactSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  hotelDirectionsSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  hotelDirectionsText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#212529',
    lineHeight: 22,
    letterSpacing: 0.1,
    marginTop: 8,
  },
  hotelNotesSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  hotelNoteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hotelNoteText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#212529',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  ritualHeaderSection: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 8,
  },
  ritualIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8F0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFE5F2',
  },
  ritualScheduleTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
    marginBottom: 8,
    textAlign: 'center',
  },
  ritualScheduleSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#77798A',
    textAlign: 'center',
    lineHeight: 20,
  },
  ritualDayNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F0F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFE5F2',
  },
  ritualActivitiesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  ritualActivityIcon: {
    marginTop: 2,
  },
});



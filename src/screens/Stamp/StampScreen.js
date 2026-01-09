import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import theme from '../../style';
import colors from '../../style/colors';
import typography from '../../style/typography';

import StampSubImage from '../../../assets/images/stamp/stamp_sub.png';
import StampBoard from '../../components/Stamp/StampBoard';

import ShareFriendIcon from '../../../assets/icons/invite/share_friend.svg';
import InviteIcon from '../../../assets/icons/invite/invite.svg';
import BulletText from '../../components/common/BulletText';
import RewardItem from '../../components/Stamp/RewardItem';
import ImageDetailModal from '../../components/common/ImageDetailModal';
import ReviewActionModal from '../../components/review/ReviewActionModal';
import {
  HISTORY_DATA,
  NOTICE_DATA,
  REWARD_DATA,
} from '../../constants/StampData';

const StampScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('stamp');

  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewModalStartStep, setReviewModalStartStep] = useState(1);

  const handleRewardClick = (item) => {
    setSelectedReward(item);
    setModalVisible(true);
  };

  const handleReviewButtonPress = () => {
    setReviewModalStartStep(2);
    setIsReviewModalVisible(true);
  };

  const renderTopTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'stamp' && styles.activeTabItem]}
        onPress={() => setActiveTab('stamp')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'stamp' && styles.activeTabText,
          ]}
        >
          스탬프
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'reward' && styles.activeTabItem]}
        onPress={() => setActiveTab('reward')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'reward' && styles.activeTabText,
          ]}
        >
          리워드
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStampBoard = () => (
    <View style={styles.boardContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>나의 스탬프 현황</Text>
        <Image source={StampSubImage} style={styles.headerImage} />
        <Text style={styles.headerSubTitle}>
          스탬프 10개를 채우면, 스타벅스 기프티콘을 드려요!
        </Text>
      </View>

      <StampBoard onPressReview={handleReviewButtonPress} />
    </View>
  );

  const renderInviteEvent = () => (
    <View style={styles.inviteContainer}>
      <View style={styles.inviteHeader}>
        <InviteIcon width={24} height={24} />
        <Text style={styles.sectionTitle}>친구 초대 이벤트</Text>
        <Text style={styles.inviteDesc}>
          내가 보낸 링크로 친구가 가입하면{'\n'}스탬프 1개를 적립해드려요!
        </Text>
      </View>
      <TouchableOpacity style={styles.inviteButton}>
        <Text style={styles.inviteButtonText}>친구 초대하기 </Text>
        <ShareFriendIcon width={18} height={18} />
      </TouchableOpacity>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsHistoryOpen(!isHistoryOpen)}
      >
        <Text style={styles.accordionTitle}>적립 내역</Text>
        <Ionicons
          name={isHistoryOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.gray[700]}
        />
      </TouchableOpacity>

      {isHistoryOpen && (
        <View style={styles.historyContainer}>
          {HISTORY_DATA.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View>
                <Text style={styles.historyLabel}>{item.label}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <Text style={styles.historyAmount}>{item.amount}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderNotice = () => (
    <View
      style={[
        styles.accordionContainer,
        { borderBottomWidth: 0, backgroundColor: colors.gray[100] },
      ]}
    >
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsNoticeOpen(!isNoticeOpen)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name="alert-circle-outline"
            size={13}
            color={colors.gray[700]}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.accordionTitleSmall}>유의 사항 및 운영 안내</Text>
        </View>
        <Ionicons
          name={isNoticeOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.gray[700]}
        />
      </TouchableOpacity>

      {isNoticeOpen && (
        <View style={styles.noticeContent}>
          {NOTICE_DATA.map((section, index) => (
            <View key={section.id}>
              <Text
                style={[styles.noticeTitle, index > 0 && { marginTop: 12 }]}
              >
                {section.title}
              </Text>

              {section.contents.map((text, textIndex) => (
                <BulletText key={textIndex}>{text}</BulletText>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderTopTabs()}

      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {activeTab === 'stamp' ? (
          <>
            {renderStampBoard()}
            {renderInviteEvent()}
            <View style={styles.divider} />
            {renderHistory()}
            <View style={styles.dividerThin} />
            {renderNotice()}
          </>
        ) : (
          // 리워드 탭
          <View style={styles.rewardListContainer}>
            {REWARD_DATA.length > 0 ? (
              REWARD_DATA.map((item) => (
                <RewardItem
                  key={item.id}
                  item={item}
                  onPress={() => handleRewardClick(item)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={{ color: colors.gray[400] }}>
                  보유 중인 리워드가 없습니다.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <ImageDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        imageSource={selectedReward?.image}
      />

      <ReviewActionModal
        isVisible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        onConfirmScan={() => {
          setIsReviewModalVisible(false);
          navigation.navigate('SelectStoreScreen');
        }}
        storeName="스타벅스"
        initialStep={reviewModalStartStep}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: theme.colors.text,
  },
  tabText: {
    ...typography.heading6,
    color: colors.gray[300],
  },
  activeTabText: {
    ...typography.heading6,
    color: theme.colors.text,
  },

  boardContainer: {
    backgroundColor: theme.colors.primary1,
    alignItems: 'center',
    paddingVertical: 30,
  },
  headerContent: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'flex-start',
    position: 'relative',
  },
  headerTitle: {
    ...typography.heading3,
    color: theme.colors.background,
    marginBottom: 6,
  },
  headerSubTitle: {
    ...typography.body3Regular,
    color: theme.colors.background,
  },
  headerImage: {
    position: 'absolute',
    right: 30,
    top: 0,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  // === Invite Event ===
  inviteContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: theme.colors.background,
  },
  inviteHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.heading6,
    color: theme.colors.text,
    marginBottom: 6,
  },
  inviteDesc: {
    ...typography.body3Regular,
    color: theme.colors.text,
    textAlign: 'center',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: colors.blue[600],
    borderRadius: 30,
  },
  inviteButtonText: {
    color: colors.blue[600],
    ...typography.heading6,
    marginRight: 12,
  },

  // === Accordion Common ===
  divider: {
    height: 8,
    backgroundColor: colors.gray[100],
  },
  dividerThin: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginHorizontal: 20,
  },
  accordionContainer: {
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  accordionTitle: {
    ...typography.body3Bold,
    color: theme.colors.text,
  },
  accordionTitleSmall: {
    ...typography.body4Bold,
    color: theme.colors.textDim,
  },

  // History Items
  historyContainer: {
    paddingTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyLabel: {
    ...typography.body3Regular,
    color: theme.colors.text,
    marginBottom: 4,
  },
  historyDate: {
    ...typography.caption1Regular,
    color: colors.gray[300],
  },
  historyAmount: {
    ...typography.body3Bold,
    color: theme.colors.primary1,
  },

  // Notice Items
  noticeContent: {
    backgroundColor: colors.gray[100],
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  noticeTitle: {
    ...typography.body4Bold,
    color: colors.gray[600],
    marginBottom: 4,
  },
  noticeText: {
    ...typography.body4Regular,
    color: colors.gray[600],
    marginBottom: 2,
    paddingLeft: 4,
  },

  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  rewardListContainer: {
    backgroundColor: 'white',
    minHeight: 500,
  },
});

export default StampScreen;

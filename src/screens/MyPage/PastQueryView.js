import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { getMyInquiries, getCouncilInquiries } from '../../api/inquiry';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { useState, useCallback, useEffect } from 'react';
import ArrowDownIcon from '../../../assets/ArrowDown.svg';
import ArrowUpIcon from '../../../assets/ArrowUp.svg';
import PendingInqueryIcon from '../../../assets/PendingInqueryIcon.svg';
import AnsweredInqueryIcon from '../../../assets/AnsweredInqueryIcon.svg';
import EmptyResult from '../../components/common/EmptyResult';
import LoadingFooter from '../../components/common/LoadingFooter';

const PAGE_SIZE = 20;

const formatDate = (isoString) => {
  if (!isoString) {
    return '';
  }
  return isoString.slice(0, 10).replace(/-/g, '.');
};

const PastQueryView = ({ refreshKey, isCouncil }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchInquiries = useCallback(
    async (pageNum = 0, isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const fetchFn = isCouncil ? getCouncilInquiries : getMyInquiries;
      const result = await fetchFn(pageNum, PAGE_SIZE);

      if (result) {
        const newItems = result.content || [];
        if (isRefresh || pageNum === 0) {
          setInquiries(newItems);
        } else {
          setInquiries((prev) => [...prev, ...newItems]);
        }
        setPage(pageNum);
        setHasMore(pageNum + 1 < result.totalPages);
      }

      setLoading(false);
      setRefreshing(false);
    },
    [isCouncil]
  );

  useEffect(() => {
    fetchInquiries(0, true);
  }, [fetchInquiries, refreshKey]);

  const handleRefresh = useCallback(() => {
    fetchInquiries(0, true);
  }, [fetchInquiries]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchInquiries(page + 1);
    }
  }, [loading, hasMore, page, fetchInquiries]);

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <FlatList
      data={inquiries}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      ListEmptyComponent={
        !loading ? <EmptyResult message="등록된 문의가 없습니다." /> : null
      }
      ListFooterComponent={<LoadingFooter loading={loading} />}
      renderItem={({ item }) => {
        const isExpanded = expandedItems[item.id] || false;
        const isAnswered = item.status !== 'WAITING';
        return (
          <View style={styles.itemContainer}>
            <View style={styles.itemHeaderWrapper}>
              <View style={styles.itemHeaderContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {isExpanded && (
                  <Text style={styles.inqueryContent}>{item.content}</Text>
                )}
                <View style={styles.itemDateWrapper}>
                  {isAnswered ? (
                    <AnsweredInqueryIcon
                      width={45}
                      height={17}
                      color={isCouncil ? colors.orange[500] : colors.blue[500]}
                    />
                  ) : (
                    <PendingInqueryIcon width={45} height={17} />
                  )}
                  <Text style={styles.itemDate}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => toggleItem(item.id)}>
                {isExpanded ? (
                  <ArrowUpIcon width={24} height={24} />
                ) : (
                  <ArrowDownIcon width={24} height={24} />
                )}
              </Pressable>
            </View>
            {isExpanded && isAnswered && (
              <View
                style={[
                  styles.inqueryAnswerWrapper,
                  {
                    backgroundColor: isCouncil
                      ? colors.orange['000']
                      : colors.blue['000'],
                  },
                ]}
              >
                <Text style={styles.inqueryAnswerContent}>{item.answer}</Text>
                <Text style={styles.answeredDate}>
                  {formatDate(item.answeredAt)}
                </Text>
              </View>
            )}
          </View>
        );
      }}
      keyExtractor={(item) => String(item.id)}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  itemHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemHeaderContent: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    ...typography.body3Bold,
    color: colors.gray[850],
    marginBottom: 8,
  },
  itemDateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDate: {
    ...typography.caption1Regular,
    color: colors.gray[600],
    marginLeft: 11,
  },
  inqueryContent: {
    ...typography.body4Regular,
    color: colors.gray[850],
    marginBottom: 8,
  },
  inqueryAnswerWrapper: {
    marginTop: 14,
    padding: 10,
    gap: 10,
    backgroundColor: colors.blue['000'],
  },
  inqueryAnswerContent: {
    ...typography.body4Regular,
    color: colors.gray[800],
  },
  answeredDate: {
    ...typography.caption1Regular,
    color: colors.gray[600],
    alignSelf: 'flex-end',
  },
});

export default PastQueryView;

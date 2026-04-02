import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { PAST_QUERY_DATA } from '../../constants/DummyData';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { useState } from 'react';
import ArrowDownIcon from '../../../assets/ArrowDown.svg';
import ArrowUpIcon from '../../../assets/ArrowUp.svg';
import PendingInqueryIcon from '../../../assets/PendingInqueryIcon.svg';
import AnsweredInqueryIcon from '../../../assets/AnsweredInqueryIcon.svg';
import useAuthStore from '../../store/authStore';

const PastQueryView = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const isCouncil = useAuthStore((state) => state.user.role === 'COUNCIL');

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <FlatList
      data={PAST_QUERY_DATA}
      renderItem={({ item }) => {
        const isExpanded = expandedItems[item.id] || false;
        return (
          <View style={styles.itemContainer}>
            <View style={styles.itemHeaderWrapper}>
              <View style={styles.itemHeaderContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {isExpanded && (
                  <Text style={styles.inqueryContent}>{item.content}</Text>
                )}
                <View style={styles.itemDateWrapper}>
                  {item.answerStatus ? (
                    <AnsweredInqueryIcon
                      width={45}
                      height={17}
                      color={isCouncil ? colors.orange[500] : colors.blue[500]}
                    />
                  ) : (
                    <PendingInqueryIcon width={45} height={17} />
                  )}
                  <Text style={styles.itemDate}>{item.date}</Text>
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
            {isExpanded && item.answerStatus && (
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
                <Text style={styles.answeredDate}>{item.answeredDate}</Text>
              </View>
            )}
          </View>
        );
      }}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
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
  itemContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  contentLabel: {
    ...typography.body4Bold,
    color: colors.gray[850],
    marginBottom: 8,
  },
  contentText: {
    ...typography.body3Regular,
    color: colors.gray[700],
    marginBottom: 16,
    lineHeight: 20,
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

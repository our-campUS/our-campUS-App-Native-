import { View, Text, StyleSheet } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { Pressable } from 'react-native';
import { useState } from 'react';
import { FlatList } from 'react-native';
import AffiliationColumnListItem from './AffiliationColumnListItem';
import {
  AFFILIATION_COLUMN_LIST_DATA_AFFILIATION,
  AFFILIATION_COLUMN_LIST_DATA_EVENT,
} from '../../constants/DummyData';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.common.white,
    padding: 20,
  },
  activityTypeSelector: {
    flexDirection: 'row',
    gap: 9,
  },
  activityTypeSelectorButton: {
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.gray[250],
    width: 47,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTypeSelectorButtonText: {
    ...typography.body4Regular,
    color: colors.gray[700],
  },
  activityTypeSelectorButtonPressed: {
    borderColor: colors.blue[400],
  },
  activityTypeSelectorOrangeButtonPressed: {
    borderColor: colors.orange[400],
  },
  activityTypeSelectorOrangeButtonTextPressed: {
    color: colors.orange[600],
  },
  activityTypeSelectorButtonTextPressed: {
    color: colors.blue[600],
  },
  activityList: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.common.white,
    marginTop: 20,
  },
});

const AffiliationColumnList = ({ navigation, isOrange = false }) => {
  const [selectedActivityType, setSelectedActivityType] = useState('제휴');
  return (
    <View style={styles.container}>
      <View style={styles.activityTypeSelector}>
        <Pressable
          style={[
            styles.activityTypeSelectorButton,
            selectedActivityType === '제휴'
              ? isOrange
                ? styles.activityTypeSelectorOrangeButtonPressed
                : styles.activityTypeSelectorButtonPressed
              : styles.activityTypeSelectorButton,
          ]}
          onPress={() => setSelectedActivityType('제휴')}
        >
          <Text
            style={
              selectedActivityType === '제휴'
                ? isOrange
                  ? styles.activityTypeSelectorOrangeButtonTextPressed
                  : styles.activityTypeSelectorButtonTextPressed
                : styles.activityTypeSelectorButtonText
            }
          >
            제휴
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.activityTypeSelectorButton,
            selectedActivityType === '행사'
              ? isOrange
                ? styles.activityTypeSelectorOrangeButtonPressed
                : styles.activityTypeSelectorButtonPressed
              : styles.activityTypeSelectorButton,
          ]}
          onPress={() => setSelectedActivityType('행사')}
        >
          <Text
            style={
              selectedActivityType === '행사'
                ? isOrange
                  ? styles.activityTypeSelectorOrangeButtonTextPressed
                  : styles.activityTypeSelectorButtonTextPressed
                : styles.activityTypeSelectorButtonText
            }
          >
            행사
          </Text>
        </Pressable>
      </View>
      <View style={styles.activityList}>
        <FlatList
          key={selectedActivityType}
          data={
            selectedActivityType === '제휴'
              ? AFFILIATION_COLUMN_LIST_DATA_AFFILIATION
              : AFFILIATION_COLUMN_LIST_DATA_EVENT
          }
          renderItem={({ item }) => (
            <AffiliationColumnListItem item={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => `${selectedActivityType}-${index}`}
        />
      </View>
    </View>
  );
};

export default AffiliationColumnList;

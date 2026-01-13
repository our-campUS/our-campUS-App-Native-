import { View, Text, StyleSheet, Pressable } from 'react-native';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import typography from '../../style/typography';
import AffiliationColumnListItem from '../../components/Affiliation/AffiliationColumnListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { FlatList } from 'react-native';
import {
  AFFILIATION_COLUMN_LIST_DATA_AFFILIATION,
  AFFILIATION_COLUMN_LIST_DATA_EVENT,
} from '../../constants/DummyData';
const InterestedAffiliateScreen = ({ navigation }) => {
  const [selectedActivityType, setSelectedActivityType] = useState('제휴');
  const [isOrange, setIsOrange] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="관심 게시글"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      {/* <AffiliationColumnList navigation={navigation} /> */}
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
      <View style={{ width: '100%', height: 18 }}></View>
      {selectedActivityType === '제휴' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          data={AFFILIATION_COLUMN_LIST_DATA_AFFILIATION}
          renderItem={({ item }) => (
            <AffiliationColumnListItem item={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {selectedActivityType === '행사' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          data={AFFILIATION_COLUMN_LIST_DATA_EVENT}
          renderItem={({ item }) => (
            <AffiliationColumnListItem item={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    flex: 1,
    backgroundColor: colors.common.white,
  },
  activityTypeSelector: {
    paddingHorizontal: 20,
    marginTop: 38.5,
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
    ...typography.body4Regular,
    color: colors.orange[600],
  },
  activityTypeSelectorButtonTextPressed: {
    ...typography.body4Regular,
    color: colors.blue[600],
  },
});

export default InterestedAffiliateScreen;

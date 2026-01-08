import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../components/LabelTitle';
import typography from '../../style/typography';
import colors from '../../style/colors';
import InquerySelectTab from '../../components/MyPage/InquerySelectTab';
import { useState } from 'react';
import PastQueryView from './PastQueryView';
import CreateNewQueryView from './CreateNewQueryView';

const InqueryMainScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('pastInquery');
  const handleCreateQuery = () => {
    setActiveTab('pastInquery');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="1:1 문의계시판"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={{ width: '100%', height: 20 }} />
      <InquerySelectTab activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'pastInquery' ? (
        <PastQueryView />
      ) : (
        <CreateNewQueryView handleCreateQuery={handleCreateQuery} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default InqueryMainScreen;

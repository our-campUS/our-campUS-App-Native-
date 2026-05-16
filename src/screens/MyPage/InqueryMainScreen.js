import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import CustomToast from '../../components/CustomToast';
import InquerySelectTab from '../../components/MyPage/InquerySelectTab';
import { useState } from 'react';
import PastQueryView from './PastQueryView';
import CreateNewQueryView from './CreateNewQueryView';
import useAuthStore from '../../store/authStore';

const InqueryMainScreen = ({ navigation }) => {
  const isCouncil = useAuthStore((state) => state.user.role === 'COUNCIL');
  const [activeTab, setActiveTab] = useState('pastInquery');
  const [refreshKey, setRefreshKey] = useState(0);
  const handleCreateQuery = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab('pastInquery');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="1:1 문의게시판"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      {/* <View style={{ width: '100%', height: 20 }} /> */}
      <InquerySelectTab activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'pastInquery' ? (
        <PastQueryView refreshKey={refreshKey} isCouncil={isCouncil} />
      ) : (
        <CreateNewQueryView
          handleCreateQuery={handleCreateQuery}
          isCouncil={isCouncil}
        />
      )}
      <CustomToast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
});

export default InqueryMainScreen;

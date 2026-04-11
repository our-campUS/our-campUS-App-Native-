import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';

const InquerySelectTab = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          activeTab === 'pastInquery' && styles.activeButton,
        ]}
        onPress={() => setActiveTab('pastInquery')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'pastInquery' && styles.activeButtonText,
          ]}
        >
          {'문의 내역'}
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.button,
          activeTab === 'newInquery' && styles.activeButton,
        ]}
        onPress={() => setActiveTab('newInquery')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'newInquery' && styles.activeButtonText,
          ]}
        >
          {'문의하기'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.common.white,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[250],
  },
  activeButton: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.gray[850],
  },
  buttonText: {
    ...typography.heading6,
    color: colors.gray[300],
    textAlign: 'center',
  },
  activeButtonText: {
    color: colors.gray[850],
  },
});

export default InquerySelectTab;

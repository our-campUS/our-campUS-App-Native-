import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 36,
    backgroundColor: colors.common.white,
    flexDirection: 'row',
  },
  button: {
    // maxWidth: 125,
    flex: 1,
    height: 36,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  activeButton: {
    borderBottomColor: colors.blue[600],
  },
  activeOrangeButton: {
    borderBottomColor: colors.orange[600],
  },
  buttonText: {
    ...typography.heading5,
    color: colors.gray[850],
    textAlign: 'center',
  },
  activeButtonText: {
    color: colors.blue[600],
  },
  activeOrangeButtonText: {
    color: colors.orange[600],
  },
});

const HostByTab = ({
  navigation,
  isOrange = false,
  onSelectTab = null,
  selectedTab = 'school',
}) => {
  const [activeTab, setActiveTab] = useState(selectedTab);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          activeTab === 'school' &&
            (isOrange ? styles.activeOrangeButton : styles.activeButton),
        ]}
        onPress={() => {
          setActiveTab('school');
          onSelectTab('school');
        }}
      >
        <Text
          numberOfLines={1}
          maxWidth={125}
          ellipsizeMode="tail"
          style={[
            styles.buttonText,
            activeTab === 'school' &&
              (isOrange
                ? styles.activeOrangeButtonText
                : styles.activeButtonText),
          ]}
        >
          {'총학생회' || '학교'}
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.button,
          activeTab === 'college' &&
            (isOrange ? styles.activeOrangeButton : styles.activeButton),
        ]}
        onPress={() => {
          setActiveTab('college');
          onSelectTab('college');
        }}
      >
        <Text
          numberOfLines={1}
          maxWidth={125}
          ellipsizeMode="tail"
          style={[
            styles.buttonText,
            activeTab === 'college' &&
              (isOrange
                ? styles.activeOrangeButtonText
                : styles.activeButtonText),
          ]}
        >
          {user?.collegeName || '단과대'}
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.button,
          activeTab === 'major' &&
            (isOrange ? styles.activeOrangeButton : styles.activeButton),
        ]}
        onPress={() => {
          setActiveTab('major');
          onSelectTab('major');
        }}
      >
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          maxWidth={125}
          style={[
            styles.buttonText,
            activeTab === 'major' &&
              (isOrange
                ? styles.activeOrangeButtonText
                : styles.activeButtonText),
          ]}
        >
          {user?.majorName || '학과'}
        </Text>
      </Pressable>
    </View>
  );
};

export default HostByTab;

import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { useState, useEffect } from 'react';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 36,
    backgroundColor: colors.common.white,
    flexDirection: 'row',
  },
  button: {
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
  university,
  college,
  department,
  isOrange = false,
}) => {
  const [activeTab, setActiveTab] = useState('university');

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          activeTab === 'university' &&
            (isOrange ? styles.activeOrangeButton : styles.activeButton),
        ]}
        onPress={() => setActiveTab('university')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'university' &&
              (isOrange
                ? styles.activeOrangeButtonText
                : styles.activeButtonText),
          ]}
        >
          {university}
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.button,
          activeTab === 'college' &&
            (isOrange ? styles.activeOrangeButton : styles.activeButton),
        ]}
        onPress={() => setActiveTab('college')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'college' &&
              (isOrange
                ? styles.activeOrangeButtonText
                : styles.activeButtonText),
          ]}
        >
          {college}
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.button,
          activeTab === 'department' &&
            (isOrange ? styles.activeOrangeButton : styles.activeButton),
        ]}
        onPress={() => setActiveTab('department')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'department' &&
              (isOrange
                ? styles.activeOrangeButtonText
                : styles.activeButtonText),
          ]}
        >
          {department}
        </Text>
      </Pressable>
    </View>
  );
};

export default HostByTab;

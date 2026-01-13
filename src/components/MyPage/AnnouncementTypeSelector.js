import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { useState, useEffect } from 'react';

const AnnouncementTypeSelector = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, activeTab === 'general' && styles.activeButton]}
        onPress={() => setActiveTab('general')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'general' && styles.activeButtonText,
          ]}
        >
          {'일반 공지'}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.button, activeTab === 'event1' && styles.activeButton]}
        onPress={() => setActiveTab('event1')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'event1' && styles.activeButtonText,
          ]}
        >
          {'이벤트 안내'}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.button, activeTab === 'event2' && styles.activeButton]}
        onPress={() => setActiveTab('event2')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'event2' && styles.activeButtonText,
          ]}
        >
          {'이벤트 안내'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // height: 36,
    backgroundColor: colors.common.white,
    // backgroundColor: 'green',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    // height: 36,
    paddingVertical: 12,
    backgroundColor: colors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[250],
  },
  activeButton: {
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

export default AnnouncementTypeSelector;

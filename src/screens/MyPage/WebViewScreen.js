import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import LabelTitle from '@components/LabelTitle';
import colors from '@style/colors';

const WebViewScreen = ({ navigation, route }) => {
  const { uri, title } = route.params || {};

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title={title || ''}
        navigation={navigation}
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      {uri ? <WebView source={{ uri }} style={styles.webview} /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.common.white },
  webview: { flex: 1 },
});

export default WebViewScreen;

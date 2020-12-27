import * as React from 'react';
import { Button,  View, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(0, 0, 50)',
  },
};

class HomeScreen extends React.Component {
  // Back button WebView interaction from here: https://stackoverflow.com/a/57441046/1417989
  constructor(props) {
    super(props);
    this.state = {canGoBack: false}
    this.startingUrl =
      'https://demo.photonix.org/';
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    if (this.state.canGoBack) {
      this.webView.goBack();
      return true;
    } else {
      return false;
    }
  };

  render() {
    return (
      <WebView
        source={{ uri: this.startingUrl }}
        sharedCookiesEnabled={true}
        applicationNameForUserAgent={'PhotonixMobileApp/0.0.1'}
        ref={webView => (this.webView = webView)}
        injectedJavaScript={`
        (function() {
          function wrap(fn) {
            return function wrapper() {
              var res = fn.apply(this, arguments);
              window.ReactNativeWebView.postMessage('navigationStateChange');
              return res;
            }
          }

          history.pushState = wrap(history.pushState);
          history.replaceState = wrap(history.replaceState);
          window.addEventListener('popstate', function() {
            window.ReactNativeWebView.postMessage('navigationStateChange');
          });
        })();

        true;
      `}
        onMessage={({ nativeEvent: state }) => {
          if (state.data === 'navigationStateChange') {
            // Navigation state updated, can check state.canGoBack, etc.
            this.setState({
              canGoBack: state.canGoBack
            });
          }
        }}
      />
    );
  }
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button style={{ width: 100 }} onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

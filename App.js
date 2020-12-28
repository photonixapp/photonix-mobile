import * as React from 'react';
import { Button, View, BackHandler, ActivityIndicator, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { WebView } from 'react-native-webview';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(0, 0, 50)',
    background: '#1b1b1b',
  },
};

class HomeScreen extends React.Component {
  // Back button WebView interaction from here: https://stackoverflow.com/a/57441046/1417989
  constructor(props) {
    super(props);
    this.state = {server: null, canGoBack: false, spinnerVisible: true}
    this.startingUrl =
      'http://192.168.2.125:8888/';
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.retrieveServer()
      .then((server)=> {
        if(server) this.setState({server: server})
      })
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

  async retrieveServer() {
    try {
      const server = await AsyncStorage.getItem('server');
      if (server !== null) {
        console.log("Server: ", server);
        return server;
      }
    } catch (error) {
      console.log("Error while storing the server");
    }
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      ); }

    return (
      <>
        {this.state.spinnerVisible ? (
          <View style={{height: '100%', backgroundColor: '#1d1d1d', justifyContent: 'center'}}>
            <ActivityIndicator color="#dddddd" size="large" />
          </View>
        ) : null}

        {this.state.server &&
          <WebView
            source={{ uri: this.state.server }}
            sharedCookiesEnabled={true}
            applicationNameForUserAgent={'PhotonixMobileApp/0.0.1'}
            startInLoadingState={true}
            onLoadStart={() => this.setState({ spinnerVisible: true })}
            onLoadEnd={() => this.setState({ spinnerVisible: false })}
            ref={webView => (this.webView = webView)}
            scalesPageToFit={false}
            bounces={false}
            scrollEnabled={false}
            domStorageEnabled={true}
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
        }
      </>
    );
  }

  async _cacheResourcesAsync() {
    // Doesn't look like this does much but ensures JS is loaded so there is no white flash
    return true
  }
}

function ConnectScreen({ navigation }) {
  const [value, onChangeText] = React.useState('https://demo.photonix.org/');
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ width: 250, height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: '#ffffff', padding: 10 }}
        onChangeText={text => onChangeText(text)}
        value={value}
        autoCorrect={false}
      />
      {/* <Button style={{ width: 250 }} onPress={() => navigation.goBack()} title="Go back home" /> */}
      <Button style={{ width: 250 }} onPress={() => {
        console.log(value)
        AsyncStorage.setItem('server', value)
          .then(value => {
            console.log('saved')
            // return (value);
          })
      }} title="Save" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Connect to server" component={ConnectScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

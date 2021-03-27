import * as React from 'react'
import { View, BackHandler, ActivityIndicator, Pressable } from 'react-native'
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-community/async-storage'
import AppLoading from 'expo-app-loading'

class HomeScreen extends React.Component {
  // Back button WebView interaction from here: https://stackoverflow.com/a/57441046/1417989
  constructor(props) {
    super(props)
    this.state = { server: null, canGoBack: false, spinnerVisible: true }
    this.handleBackButton = this.handleBackButton.bind(this)
  }

  componentDidMount() {
    this.retrieveServer().then((server) => {
      if (server) this.setState({ server: server })
    })

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
    this.retrieveServer().then((server) => {
      if (server) {
        this.setState({ server: server })
      } else {
        this.props.navigation.navigate('Connect to server')
      }
    })

    this.props.navigation.addListener('focus', () => {
      console.log('Refresh')
      this.retrieveServer().then((server) => {
        if (server) this.setState({ server: server })
      })
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  handleBackButton = () => {
    if (this.state.canGoBack) {
      this.webView.goBack()
      return true
    } else {
      return false
    }
  }

  async retrieveServer() {
    try {
      const server = await AsyncStorage.getItem('server')
      if (server !== null) {
        console.log('Server: ', server)
        return server
      }
    } catch (error) {
      return null
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
      )
    }

    return (
      <>
        {this.state.spinnerVisible ? (
          <View
            style={{
              height: '100%',
              backgroundColor: '#1d1d1d',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator color="#dddddd" size="large" />
          </View>
        ) : null}

        {this.state.server && (
          <WebView
            source={{ uri: this.state.server }}
            sharedCookiesEnabled={true}
            applicationNameForUserAgent={'PhotonixMobileApp/0.0.1'}
            startInLoadingState={true}
            onLoadStart={() => this.setState({ spinnerVisible: true })}
            onLoadEnd={() => this.setState({ spinnerVisible: false })}
            ref={(webView) => (this.webView = webView)}
            scalesPageToFit={false}
            bounces={false}
            scrollEnabled={false}
            domStorageEnabled={true}
            injectedJavaScript={`
              // Links OS/hardware back button to WebView browser's history
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
                  canGoBack: state.canGoBack,
                })
              }
            }}
          />
        )}

        <Pressable
          onPress={() => this.props.navigation.openDrawer()}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 170,
            height: 80,
          }}
        />
      </>
    )
  }

  async _cacheResourcesAsync() {
    // Doesn't look like this does much but ensures JS is loaded so there is no white flash
    return true
  }
}

export default HomeScreen

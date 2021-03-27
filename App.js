import * as React from 'react'
import {
  Button,
  View,
  BackHandler,
  ActivityIndicator,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { WebView } from 'react-native-webview'
import { createDrawerNavigator } from '@react-navigation/drawer'
import {
  NavigationContainer,
  DefaultTheme,
  useFocusEffect,
} from '@react-navigation/native'
import AppLoading from 'expo-app-loading'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(0, 0, 50)',
    background: '#1b1b1b',
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 40,
    paddingBottom: 40,
    width: '100%',
  },
  baseText: {
    fontFamily: 'sans-serif',
    color: '#ffffff',
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleText: {
    fontFamily: 'sans-serif',
    color: '#ffffff',
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
    fontSize: 25,
  },
})

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
              // height: '100%',
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

function ConnectScreen({ navigation }) {
  const [value, onChangeText] = React.useState('https://demo.photonix.org/')

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('server').then((value) => {
        onChangeText(value)
      })
      return () => {}
    }, [navigation])
  )

  // AsyncStorage.clear()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* <View style={styles.scrollInner}> */}
        <Text style={styles.titleText}>Welcome to Photonix</Text>
        <Text style={styles.baseText}>
          You need to already be running the server software at an accessible
          URL to continue. For more information on running the server please see
          our documentation.
        </Text>
        <Text
          style={{
            ...styles.baseText,
            color: 'rgb(0, 168, 161)',
            // textAlign: 'center',
            textDecorationLine: 'underline',
          }}
          onPress={() => Linking.openURL('https://photonix.org/docs/')}
        >
          Photonix Documentation
        </Text>
        <Text style={{ ...styles.baseText, marginBottom: 50 }}>
          Please enter your server address and ensure you include the correct
          protocol (http:// or https://) and port number (if it's other than
          80). If you have been using localhost to access Photonix in your
          browser then you will need to find the machine's external IP address.
        </Text>
        <TextInput
          style={{
            borderWidth: 0,
            backgroundColor: '#ffffff',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
          onChangeText={(text) => onChangeText(text)}
          value={value}
          autoCorrect={false}
        />
        {/* <Button style={{ width: 250 }} onPress={() => navigation.goBack()} title="Go back home" /> */}
        <Button
          containerViewStyle={{
            width: '100%',
            marginLeft: 0,
          }}
          onPress={() => {
            console.log(value)
            AsyncStorage.setItem('server', value).then((value) => {
              console.log('saved')
              navigation.navigate('Photos')
              // return (value);
            })
          }}
          title="Connect"
          color="rgb(0, 168, 161)"
        />
        {/* <Button
        style={{ width: 250 }}
        onPress={() => {
          AsyncStorage.setItem('server', 'http://192.168.1.64:8888/').then(
            (value) => {
              console.log('saved')
              navigation.navigate('Photos')
              // return (value);
            }
          )
        }}
        title="Connect to LAN"
      />
      <Button
        style={{ width: 250 }}
        onPress={() => {
          AsyncStorage.setItem('server', 'https://demo.photonix.org/').then(
            (value) => {
              console.log('saved')
              navigation.navigate('Photos', { reload: true })
              // return (value);
            }
          )
        }}
        title="Connect to demo"
      /> */}
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  )
}

const Drawer = createDrawerNavigator()

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Drawer.Navigator initialRouteName="Photos">
        <Drawer.Screen name="Photos" component={HomeScreen} />
        <Drawer.Screen name="Connect to server" component={ConnectScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

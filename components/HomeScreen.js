import React, { useState, useEffect, useRef } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-community/async-storage'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AppLoading from 'expo-app-loading'

import useFocus from '../hooks/useFocus'
import useBackHandler from '../hooks/useBackHandler'
import ErrorPage from './ErrorPage'

export default HomeScreen = ({ navigation }) => {
  const [isReady, setIsReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [server, setServer] = React.useState('https://demo.photonix.org/')
  const webViewRef = useRef()
  const insets = useSafeAreaInsets()
  const focusChange = useFocus(navigation)

  // Call re-fetch server URL whenever this screen is focussed (re-shown)
  const retrieveServer = () => {
    const oldServer = server
    AsyncStorage.getItem('server').then((server) => {
      if (server !== oldServer) {
        setLoading(true)
        setError(null)
      }
      setServer(server)
    })
  }
  useEffect(() => {
    retrieveServer()
  }, [focusChange])

  // Re-purpose the back button to control WebView
  // TODO: Release control if there is no more history to go back to in WebView
  const handleBackButton = () => {
    webViewRef.current.goBack()
    return true
  }
  useBackHandler(handleBackButton)

  // Doesn't look like this does much but ensures JS is loaded so there is no white flash
  const _cacheResourcesAsync = async () => {
    return true
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={_cacheResourcesAsync}
        onFinish={() => setIsReady(true)}
        onError={() => {}}
      />
    )
  } else if (error) {
    return (
      <ErrorPage
        error={error}
        onReload={() => {
          setLoading(true)
          setError(null)
          setServer(null)
          setTimeout(retrieveServer, 1000)
        }}
        onChangeServer={() => {
          setLoading(true)
          setError(null)
          setServer(null)
          navigation.navigate('Connect to server')
        }}
      />
    )
  }

  return (
    <>
      {loading ? (
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

      {server && (
        <WebView
          source={{ uri: server }}
          sharedCookiesEnabled={true}
          applicationNameForUserAgent={'PhotonixMobileApp/0.0.1'}
          startInLoadingState={true}
          onLoadStart={() => {
            setLoading(true)
            setError(null)
          }}
          onLoadEnd={() => {
            setLoading(false)
          }}
          ref={webViewRef}
          scalesPageToFit={false}
          scrollEnabled={false}
          bounces={false}
          domStorageEnabled={true}
          injectedJavaScript={
            `
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
                window.photonix.openAppMenu = function() { window.ReactNativeWebView.postMessage('openAppMenu') }
                window.photonix.store.dispatch({
                  type: 'SET_SAFE_AREA_TOP',
                  payload: ` +
            insets.top +
            `,
                })
              })();
              true;
            `
          }
          onMessage={({ nativeEvent: state }) => {
            // Allows click event within the web page to open the native app draw menu
            if (state.data === 'openAppMenu') {
              navigation.openDrawer()
            }
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent
            setError(nativeEvent.description)
          }}
        />
      )}
    </>
  )
}

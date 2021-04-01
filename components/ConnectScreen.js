import * as React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  Button,
  TextInput,
  Text,
  Linking,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { useFonts } from 'expo-font'

import styles from '../styles'

export default ConnectScreen = ({ navigation }) => {
  const [value, onChangeText] = React.useState('https://demo.photonix.org/')
  const [fontsLoaded] = useFonts({
    Nunito: require('../assets/fonts/Nunito.ttf'),
  })

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('server').then((value) => {
        value && onChangeText(value)
      })
      return () => {}
    }, [navigation])
  )

  // AsyncStorage.clear()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {fontsLoaded && (
          <>
            <Text style={styles.titleText}>Welcome to Photonix</Text>
            <Text style={styles.baseText}>
              You need to already be running the server software at an
              accessible URL to continue. For more information on running the
              server please see our documentation.
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
              Please enter your server address and ensure you include the
              correct protocol (http:// or https://) and port number (if it’s
              other than 80). If you have been using localhost to access
              Photonix in your browser then you will need to find the machine’s
              external IP address.
            </Text>
            <TextInput
              style={{
                borderWidth: 0,
                backgroundColor: '#ffffff',
                paddingHorizontal: 20,
                paddingVertical: 10,
                fontFamily: 'Nunito',
              }}
              onChangeText={(text) => onChangeText(text)}
              value={value}
              autoCorrect={false}
            />
            {/* <Button style={{ width: 250 }} onPress={() => navigation.goBack()} title="Go back home" /> */}
            <Button
              style={{
                fontFamily: 'Nunito',
              }}
              onPress={() => {
                AsyncStorage.setItem('server', value).then(() => {
                  navigation.navigate('Photos')
                })
              }}
              title="Connect"
              color="rgb(0, 168, 161)"
            />
            <Button
              onPress={() => {
                AsyncStorage.setItem(
                  'server',
                  'http://192.168.1.64:8888/'
                ).then((value) => {
                  navigation.navigate('Photos')
                  // return (value);
                })
              }}
              title="Connect to LAN"
            />
            <Button
              onPress={() => {
                AsyncStorage.setItem(
                  'server',
                  'https://demo.photonix.org/'
                ).then((value) => {
                  navigation.navigate('Photos', { reload: true })
                  // return (value);
                })
              }}
              title="Connect to demo"
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

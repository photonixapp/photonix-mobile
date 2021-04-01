import React from 'react'
import { View, Text, Button, SafeAreaView, ScrollView } from 'react-native'
import { useFonts } from 'expo-font'

export default ErrorPage = ({ error, onReload, onChangeServer }) => {
  const [fontsLoaded] = useFonts({
    Nunito: require('../assets/fonts/Nunito.ttf'),
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View
          style={{
            height: '100%',
            backgroundColor: '#1d1d1d',
            justifyContent: 'center',
          }}
        >
          {fontsLoaded && (
            <>
              <Text style={styles.titleText}>Error</Text>
              <Text style={styles.baseText}>
                Could not connect to your Photonix server.
              </Text>
              <Text style={{ ...styles.baseText, marginBottom: 30 }}>
                {error}
              </Text>
              <Button
                style={{ marginBotton: 100 }}
                onPress={onReload}
                title="Reload"
                color="rgb(0, 168, 161)"
              />
              <Button
                onPress={onChangeServer}
                title="Change server address"
                color="rgb(0, 168, 161)"
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

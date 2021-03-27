import * as React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import HomeScreen from './components/HomeScreen.js'
import ConnectScreen from './components/ConnectScreen.js'

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(0, 0, 50)',
    background: '#1b1b1b',
  },
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

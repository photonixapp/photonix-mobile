import { StyleSheet, StatusBar } from 'react-native'

export default styles = StyleSheet.create({
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
    fontFamily: 'Nunito',
    color: '#ffffff',
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleText: {
    fontFamily: 'Nunito',
    color: '#ffffff',
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
    fontSize: 25,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
})

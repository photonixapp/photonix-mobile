import React, { useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  View,
  Text,
  Switch,
  Button,
} from 'react-native'
import { useFonts } from 'expo-font'
import DropDownPicker from 'react-native-dropdown-picker'
import * as MediaLibrary from 'expo-media-library'
import axios from 'axios'
// import * as DocumentPicker from 'expo-document-picker';
import styles from '../styles'

export default UploadScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Nunito: require('../assets/fonts/Nunito.ttf'),
  })
  const [allAlbumsList, setAllAlbumsList] = useState(null)
  const [loaded, setLoaded] = useState(true)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)

  const getAllAlbums = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status === 'granted') {
      await MediaLibrary.getAlbumsAsync()
        .then((albums) => {
          let albumsList = albums.map((album) => ({ label: album['title'], value: album['id'] }))
          setAllAlbumsList(albumsList)
        })
        .catch((err) => console.warn(err))
    }
  }

  const getPhotos = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status === 'granted') {
      const getAllPhotos = await MediaLibrary.getAssetsAsync({
        album: value,
        sortBy: ['creationTime'],
        mediaType: ['photo'],
      });
      console.log(getAllPhotos)
      // const formData = new FormData();
      // getAllPhotos.assets.map((assetObj, index) => {
      //   // const localUri = await MediaLibrary.saveToLibraryAsync(assetObj.uri)
      //   // console.log(localUri)
      //   formData.append(index, assetObj.uri);
      // })
      // axios.post(`http://localhost:8888/upload/?library_id=91274699-9dfd-49ac-90ce-38a71c69a427`, formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      //   onUploadProgress: data => {
      //     console.log("progress")
      //   },
      // }).then(res => {
      //   console.log(res.data)
      // }).catch(err => {
      //   console.log(err);
      // })
    }
  }

  // const pickImage = async () => {
  //   let result = await DocumentPicker.getDocumentAsync({
  //     type: 'image/',
  //   });
  //   alert(result.uri);    
  // }

  useFocusEffect(
    React.useCallback(() => {
      getAllAlbums()
      return () => { }
    }, [loaded])
  )

  return (
    <View style={{
      height: '100%',
      backgroundColor: '#1d1d1d',
      justifyContent: 'center',
    }}>
      <View style={styles.checkboxContainer}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.checkbox}
        />
        <Text style={styles.checkBoxlabel}>Enabled</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.checkbox}
        />
        <Text style={styles.checkBoxlabel}>Upload via wifi only</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={styles.checkbox}
        />
        <Text style={styles.checkBoxlabel}>Notification while uploading</Text>
      </View>
      {value && <Button title="Load Images" onPress={getPhotos} /> }
      {/* <Button
            title="Select Image"
            onPress={pickImage}
          />     */}
      {fontsLoaded && (
        <>
          {allAlbumsList && <DropDownPicker
            open={open}
            setOpen={setOpen}
            items={allAlbumsList}
            setItems={setAllAlbumsList}
            value={value}
            setValue={setValue}
            containerStyle={{ height: 40 }}
          />}
        </>
      )}
    </View>
  )
}

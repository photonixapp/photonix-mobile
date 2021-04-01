import React, { useEffect } from 'react'
import { BackHandler } from 'react-native'

const useBackHandler = (callback) => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return callback()
    })

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', callback)
    }
  }, [])

  return null
}

export default useBackHandler

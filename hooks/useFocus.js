import React, { useState, useEffect } from 'react'

const useFocus = (navigation) => {
  const [change, setChange] = useState(0)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setChange(Math.random())
    })

    return unsubscribe
  }, [])

  return change
}

export default useFocus

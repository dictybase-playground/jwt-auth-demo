import React, { useState, useEffect, useRef } from "react"

// based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/

const useInterval = (
  callback,
  delay,
  runOnLoad = false,
  effectDependencies = [],
) => {
  const savedCallback = useRef()

  useEffect(() => {
    if (runOnLoad) {
      callback()
    }
  }, [])

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay)
      return () => clearInterval(id)
    }
  }, [delay, ...effectDependencies])
}

export default useInterval

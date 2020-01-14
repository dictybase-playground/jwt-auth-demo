import { useEffect, useRef } from "react"

// based on https://overreacted.io/making-setinterval-declarative-with-react-hooks/

const useInterval = (callback, delay, item) => {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      // need to fetch on mount
      // if item (i.e. token) is in state, then set interval to call latest callback
      if (item !== "") {
        const interval = setInterval(() => savedCallback.current(), delay)
        return () => clearInterval(interval)
      } else {
        callback()
      }
    }
  }, [delay, callback, item])
}

export default useInterval

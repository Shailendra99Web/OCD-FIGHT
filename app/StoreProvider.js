'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '@/redux/store'
// import { initializeCount } from '@/redux/features/counter/counterSlice'

export default function StoreProvider({ children }) {
  const storeRef = useRef(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    // storeRef.current.dispatch(initializeCount(count))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
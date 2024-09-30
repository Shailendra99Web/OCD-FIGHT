import { configureStore } from '@reduxjs/toolkit'
import allIntervalsReducer from './features/allIntervals/allIntervalsSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      allIntervals: allIntervalsReducer,
    }
  })
}
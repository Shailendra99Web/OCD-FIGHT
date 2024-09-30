'use client'
import { createSlice } from '@reduxjs/toolkit'

// const [allIntervals, setAllIntervals] = useState([])

// Example of all Intervals.
// [ 
// { start: "00:00", end: "07:00" },
// { start: "07:00", end: "09:00" },
// { start: "09:00", end: "12:00" },
// { start: "12:00", end: "15:00" },
// { start: "15:00", end: "18:00" },
// { start: "18:00", end: "21:00" },
// { start: "21:00", end: "00:00" }
// ]

export const allIntervalsSlice = createSlice({
  name: 'allIntervals',
  initialState: {
    allIntervals: [
      { start: "00:00", end: "07:00" },
      { start: "07:00", end: "09:00" },
      { start: "09:00", end: "12:00" },
      { start: "12:00", end: "15:00" },
      { start: "15:00", end: "18:00" },
      { start: "18:00", end: "21:00" },
      { start: "21:00", end: "00:00" }
    ]
  },
  reducers: {
    replace: (state, action) => {
      console.log('...from allIntervalsSlice replace')
      console.log(action.payload)
      state.allIntervals = action.payload.holdIntervals
      console.log(state.allIntervals)
      if (action.payload.saveToLS) {
        localStorage.setItem('allIntervals', JSON.stringify(state.allIntervals));
      }
    },
    replaceFirstInt: (state, action) => {
      console.log('...from allIntervalsSlice replaceFirstInt')
      console.log(action.payload)
      state.allIntervals[0] = { start: action.payload.start, end: action.payload.end }
      if (action.payload.saveToLS) {
        localStorage.setItem('allIntervals', JSON.stringify(state.allIntervals));
      }
    },
    add: (state, action) => {
      console.log("...from allIntervalsSlice add")
      console.log(action.payload)
      state.allIntervals.push({ start: action.payload.start, end: action.payload.end })
      if (action.payload.saveToLS) {
        localStorage.setItem('allIntervals', JSON.stringify(state.allIntervals));
      }
    },
    remove: (state, action) => {
      console.log("...from allIntervalsSlice remove")
      console.log(action.payload)
      let newAllIntervalsArr = state.allIntervals.filter((arr) => arr.start != action.payload.start && arr.end != action.payload.end)
      console.log(newAllIntervalsArr)
      state.allIntervals = newAllIntervalsArr;
      if (action.payload.saveToLS) {
        localStorage.setItem('allIntervals', JSON.stringify(newAllIntervalsArr));
      }
    }
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // }
  }
})

// Action creators are generated for each case reducer function
export const { replace, replaceFirstInt, remove, add } = allIntervalsSlice.actions

export default allIntervalsSlice.reducer
"use client"
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector, useAppStore } from "@/redux/hooks"
import { add, remove, replace, replaceFirstInt } from '@/redux/features/allIntervals/allIntervalsSlice'
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

const SetIntervals = () => {
  const allIntervals = useAppSelector((state) => state.allIntervals.allIntervals)
  const dispatch = useAppDispatch()

  // To hold input Interval.
  const [interval, setInterval] = useState({ start: "00:00", end: "00:00" })

  // First interval of Intervals
  const [firstInterval, setFirstInterval] = useState({ start: "00:00", end: "00:00", disableFirstIntInput: true })

  // To hold all intervals before saving to allIntervals(Redux Store)
  const [holdIntervals, setHoldIntervals] = useState([])

  useEffect(() => {
    if (allIntervals.length > 0) {
      setFirstInterval({ ...firstInterval, end: allIntervals[0].end })
      setHoldIntervals(allIntervals)
    }

  }, [allIntervals])

  // To check if the given interval time already exists or not.
  const notAlready = (e, obj1) => {
    console.log(holdIntervals)
    console.log('e' + e)
    return holdIntervals.every((obj2, index) => {
      console.log('££ -----')
      console.log(obj1)
      console.log(obj2)
      console.log('-----')

      // To skip first interval from allIntervals
      if (e == 'firstIntInput' && index == 0) {
        console.log('sending true')
        return true
      }

      let compareVal1Start = obj1.start
      let compareVal1End = obj1.end
      let compareVal2Start = obj2.start
      let compareVal2End = obj2.end
      if (compareVal1End == '00:00') {
        compareVal1End = '24:00'
      }
      if (compareVal2End == '00:00') {
        compareVal2End = '24:00'
      }
      console.log(compareVal1Start)
      console.log(compareVal1End)
      console.log(compareVal2Start)
      console.log(compareVal2End)
      if (compareVal1Start == compareVal2Start || compareVal1End == compareVal2End) {
        console.log('mismatch found')
        console.log(compareVal1Start + " " + compareVal1End)
        console.log(compareVal2Start + " " + compareVal2End)
        console.log('----- ££')
        return false
      } else if (compareVal1Start > compareVal2Start && compareVal1Start < compareVal2End) {
        console.log('mismatch found')
        console.log(compareVal1Start + " " + compareVal1End)
        console.log(compareVal2Start + " " + compareVal2End)
        console.log('----- ££')
        return false
      } else if (compareVal1End > compareVal2Start && compareVal1End < compareVal2End) {
        console.log('mismatch found')
        console.log(compareVal1Start + " " + compareVal1End)
        console.log(compareVal2Start + " " + compareVal2End)
        console.log('----- ££')
        return false
      } else {
        console.log('No mismatch found')
        console.log('----- ££')
        return true
      }
    })
  }

  // onChange - To change 'interval' state
  const handleIntervalChange = (e) => {
    if (e.target.id === "start") {
      setInterval({ ...interval, start: e.target.value })
    } else {
      setInterval({ ...interval, end: e.target.value })
    }
  }

  // onChange - To change 'first interval' state
  const handleFirstIntervalChange = (e) => {
    setFirstInterval({ ...firstInterval, end: e.target.value, disableFirstIntInput: false })
    console.log(firstInterval)
  }

  // onClick - To add Intervals after checking if it's not already exists before saving it to holdIntervals state.
  const handleSetInterval = (e) => {
    e.preventDefault();
    // console.log('handleSumbmitInterval...');
    if (e.target.id == 'firstIntInput' && notAlready(e.target.id, { start: firstInterval.start, end: firstInterval.end })) {
      //Condition 1 - To add first Interval.
      // console.log('handleSetInterval c1 firstInterval execute')
      setHoldIntervals(holdIntervals.map((int, index) => {
        if (index == 0) {
          return { start: firstInterval.start, end: firstInterval.end }
        }
        return int
      }))

      //To disable First Interval Input button. 
      setFirstInterval({ ...firstInterval, disableFirstIntInput: true })
      // console.log('Interval Saved')
    }
    else if (e.target.id == 'IntInput' && notAlready(e.target.id, interval)) {
      //Condition 2 - To add Interval in excluding first Interval.
      // console.log('handleSetInterval c2')
      setHoldIntervals([
        ...holdIntervals, { start: interval.start, end: interval.end }
      ])

      // console.log('Interval Saved')
    } else {
      //Condition 3 - If the Interval already exist.
      // console.log('handleSetInterval c3')
      alert('This interval time already exists')
      setFirstInterval({ ...firstInterval, end: holdIntervals[0].end, disableFirstIntInput: true })
    }
    setInterval({ start: "00:00", end: "00:00" });// To reset input box back to 00:00
  }

  const [showModal, setShowModal] = useState('hidden')// To show 'i' symbole model or not

  const toggleModal = () => {
    if (showModal == 'hidden') {
      setShowModal('')
    } else {
      setShowModal('hidden')
    }
  }

  // To remove interval from holdInterval state.
  const removeInterval = (index) => {
    // console.log(index)
    setHoldIntervals(holdIntervals => {
      return holdIntervals.filter((_, i) => {
        // console.log(i !== index)
        return i !== index
      }
      )
    })
  }

  const [updateIntervalsex, setUpdateIntervalsex] = useState({
    //{ Int [[], []] }
    IntOne: [[{ start: 'start' }, { till: '14-12-2028' }], ['Intervals']],//2028
    IntTwo: [[{ start: '14-12-2028' }, { till: '14-12-2029' }], ['Intervals']],//2029
    IntThree: [[{ start: '14-12-2029' }, { till: '14-12-2030' }], ['Intervals']],//2030
    IntFour: [[{ start: '14-12-2030' }, { till: '14-12-2031' }], ['Intervals']]//2031
  })

  const saveAndSoftReset = () => {
    if (confirm('Soft-Reset will erase OCD Counter & All Histories, Are you sure ?')) {

      // To save last date, when previous count was saved.
      const currentDate = new Date().getDate()// To get current Date
      const currentMonth = (new Date().getMonth() + 1)// To get current Month
      const currentYear = new Date().getFullYear()

      const lastSavedDate = (currentDate + '-' + currentMonth + '-' + currentYear)

      console.log(lastSavedDate)
      localStorage.setItem('lastSavedDate', lastSavedDate)
      const savedIntToIDB = localStorage.getItem('savedIntToIDB')
      console.log(savedIntToIDB)
      localStorage.removeItem('savedIntToIDB')

      dispatch(replace({ holdIntervals, saveToLS: true }))
      localStorage.removeItem('previousCount');
      localStorage.removeItem('allPreviousCount');
      // localStorage.removeItem('lastSavedDate');
      console.log('Removed the allPreviousCount & lastSavedDate from localStorage');
      alert('Soft Reset Successful!')
      toast.success('Intervals Saved Successful!');
      // window.location.href = '/'; // Navigate and reload

    }
  }

  const resetToDefault = () => {
    setFirstInterval({ ...firstInterval, end: "07:00" })
    setHoldIntervals([
      { start: "00:00", end: "07:00" },
      { start: "07:00", end: "09:00" },
      { start: "09:00", end: "12:00" },
      { start: "12:00", end: "15:00" },
      { start: "15:00", end: "18:00" },
      { start: "18:00", end: "21:00" },
      { start: "21:00", end: "00:00" }
    ])
  }

  return (
    <>
      <div className='my-4 relative flex flex-col items-center space-y-4 min-h-[80vh]'>

        <h1 className='text-xl'>Set Intervals</h1>
        <p className='text-center pb-4 px-4 text-yellow-500 font-bold'>Note: Whenever you edit the Intervals, Soft Reset will be needed to start with new Intervals.</p>

        <form id='IntInput' className='flex items-center justify-center' onSubmit={handleSetInterval}>
          <input id='start' type='time' value={interval.start} onChange={handleIntervalChange} className='text-gray-800 w-min rounded p-2' required />
          <span className='px-2'>-</span>
          <input id='end' type='time' value={interval.end} onChange={handleIntervalChange} className='text-gray-800 w-min rounded p-2' required />
          <button type='submit' className="mx-3 px-4 py-2 rounded-md hover:bg-green-400 bg-green-500 text-slate-100">Set</button>
        </form>

        <div className="flex flex-col justify-center items-center space-y-4 border-t-2 border-b-2 border-blue-200 px-7 py-4">

          <form id='firstIntInput' className='flex items-center' onSubmit={handleSetInterval}>
            <div key={uuidv4()} className="mx-2 flex gap-3 justify-center items-center">
              <p>{'00:00'} - {<input id='end' type='time' value={firstInterval.end} onChange={handleFirstIntervalChange} className='text-gray-800 w-min p-1 rounded' required />}</p>
              <button type='submit' disabled={firstInterval.disableFirstIntInput} className="py-1 px-2 bg-green-500 text-slate-100 disabled:bg-green-400 rounded">Set</button>
            </div>
            {/* <!-- Modal toggle --> */}
            <button className="" onClick={() => { toggleModal() }}>
              <svg className="flex-shrink-0 inline w-5 h-5 dark:bg-gray-800 text-yellow-300 hover:text-yellow-100 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
            </button>

            {/* Modal */}
            <div className={`${showModal} overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full max-h-full inset-0 bg-gray-300 bg-opacity-50 m-0-important`}>
              <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-full max-w-2xl max-h-full">
                {/* <!-- Modal content --> */}
                <div className=" relative bg-white rounded-lg shadow dark:bg-gray-700">
                  {/* <!-- Modal header --> */}
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Setting First Interval
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => { toggleModal() }}>
                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* <!-- Modal body --> */}
                  <div className="p-4 md:p-5 space-y-4">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                      The first Interval or the starting point of Intervals (00:00) is not editable as time Interval function need the starting point (00:00) to work through with others.
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                      Please set your all Intervals and also set this Interval (00:00-____) as an extra, if it isn&apos;t included in your Intervals.
                    </p>
                  </div>
                  {/* <!-- Modal footer --> */}
                  <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button data-modal-hide="static-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => { toggleModal() }}>Got it</button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {holdIntervals && holdIntervals?.map((i, index) => {
            // Only return the JSX if the index is not 0
            if (index !== 0) {
              return (
                <div key={uuidv4()} className="my-1 mx-2 flex gap-3 justify-center items-center">
                  <p>{i.start} - {i.end}</p>
                  {/* <button className="py-1 px-2 hover:bg-red-400 bg-red-500 rounded" onClick={() => {
                    dispatch(remove({ start: i.start, end: i.end, saveToLS: true }));
                  }}>Remove</button> */}
                  <button className="py-1 px-2 hover:bg-red-400 bg-red-500 rounded" onClick={() => {
                    removeInterval(index);
                  }}>Remove</button>
                </div>
              );
            } else {
              // Return nothing if index is 0
              return null;
            }
          })}
        </div>

        <button type="button" onClick={resetToDefault} className="absolute top-0 right-0 focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 my-[0!important] me-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900">Reset</button>


        <button type="button" onClick={saveAndSoftReset} className="focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-900">Save & Soft-Reset</button>
      </div>

    </>
  )
}

export default SetIntervals

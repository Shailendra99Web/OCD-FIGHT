'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/redux/hooks'

const MainCouter = () => {

  // To hold ocd count in form.
  const [ocdCount, setOcdCount] = useState({ compulsions: 0, ruminations1: 0, ruminations2: 0 })

  // To hold previous count.
  const [previousCount, setPreviousCount] = useState({ preCompulsions: 0, preRuminations1: 0, preRuminations2: 0, saveToLS: false })

  // To hold all previous count.
  const [allPreviousCount, setAllPreviousCount] = useState([])

  // To save all precious counts or not in LocalStorage
  const [allPreCountSaveToLS, setAllPreCountSaveToLS] = useState(false)

  // To hold last save date of local storage data.
  const [lastSavedDate, setLastSavedDate] = useState(null) 

  // To make save button clickable/ non-clickable.
  const [saveBtn, setSaveBtn] = useState(true)

  // To hold Interval
  const [currentInterval, setCurrentInterval] = useState({ start: 'NA', end: 'NA' })

  // Refered to ocd conter element
  const CounterDivRef = useRef(null);

  useEffect(() => {
    // Scroll the div into view after the component has mounted
    if (CounterDivRef.current) {
      CounterDivRef.current.scrollIntoView({
        behavior: 'smooth', // For a smooth scrolling effect
        block: 'start',     // Aligns the div to the top of the view
      });
    }
  }, [])
  

  // useEffect 1 - To set 'ocdCount' , 'previousCount' & 'allPreviousCount' from localStorage OR To reset the application.
  useEffect(() => {
    // console.log('useEffect 1...');
    let localStoLastSavedDate = localStorage.getItem('lastSavedDate')
    if (localStoLastSavedDate) {
      let lastDate = localStoLastSavedDate.split('-')
      let currentDate = new Date().getDate()// To get current Date
      let currentMonth = new Date().getMonth()// To get current Month

      if (lastDate[0] == currentDate && lastDate[1] == currentMonth) {
        let localStoragePreCount = JSON.parse(localStorage.getItem('previousCount'));
        if (localStoragePreCount) {
          setOcdCount({ compulsions: localStoragePreCount.preCompulsions, ruminations1: localStoragePreCount.preRuminations1, ruminations2: localStoragePreCount.preRuminations2 })
          setPreviousCount({ preCompulsions: localStoragePreCount.preCompulsions, preRuminations1: localStoragePreCount.preRuminations1, preRuminations2: localStoragePreCount.preRuminations2, saveToLS: false });
        }
        let localStorageAllPreCount = JSON.parse(localStorage.getItem('allPreviousCount'))
        if (localStorageAllPreCount) {
          setAllPreviousCount(localStorageAllPreCount)
        }
        console.log('Continue adding todays history')
      } else {
        localStorage.removeItem('previousCount')
        localStorage.removeItem('allPreviousCount')
        localStorage.removeItem('lastSavedDate')
        console.log('Removed the allPreviousCount & lastSavedDate from localStorage')
      }
    }

    // To store allPreviousCount values according to intervals.
    let localStorageAllPreCount = JSON.parse(localStorage.getItem('allPreviousCount'))
    if (!localStorageAllPreCount) {
      setAllPreviousCount(allIntervals.map((obj) => {
        return { ...obj, totalCom: 0, totalRem1:0, totalRem2: 0 }
      }))
    }
  }, [])

  // To update 'previousCount', 'saveBtn'.
  const save = () => {
    // console.log("saving (save btn clicked) ...");
    if (ocdCount.compulsions != previousCount.preCompulsions || ocdCount.ruminations1 != previousCount.preRuminations1 || ocdCount.ruminations2 != previousCount.preRuminations2) {
      console.log("both case")
      setPreviousCount({ preCompulsions: ocdCount.compulsions, preRuminations1: ocdCount.ruminations1, preRuminations2: ocdCount.ruminations2, saveToLS: true })
    }
    // else {
    //   console.log("There is nothing to update")
    // }
    setSaveBtn(true)
  };

  // useEffect 2 - To store 'previousCount' in localStorage & update 'allPreviousCount' state on every 'previousCount' state update.
  useEffect(() => {
    if (previousCount.saveToLS == true) {
      // To store 'previousCount' in localStorage.
      // console.log("useEffect 2 / previousCount ...")
      // console.log(previousCount)
      localStorage.setItem("previousCount", JSON.stringify({ preCompulsions: previousCount.preCompulsions, preRuminations1: previousCount.preRuminations1, preRuminations2: previousCount.preRuminations2 }))

      // To update 'allPreviousCount'.
      // console.log(allPreviousCount);
      // console.log('upadating allPreCountsaveToLS...');

      // To save last date, when previous count was saved.
      let currentDate = new Date().getDate()// To get current Date
      let currentMonth = new Date().getMonth()// To get current Month

      setLastSavedDate(currentDate + '-' + currentMonth)

      setPreviousCount({ ...previousCount, saveToLS: false })
      setAllPreCountSaveToLS(true)

      // To check in which Interval we need to save in 'allPreviousCount'.
      let currentTimeHour = new Date().getHours().toString().padStart(2, '0');// To get current hour
      let currentTimeMin = new Date().getMinutes().toString().padStart(2, '0');// To get current minutes
      const time = (currentTimeHour+':'+currentTimeMin)

      const NewAllPreviousCount = () => {
        for (let i = 0; i < allIntervals.length; i++) {
          console.log(time)
          console.log(i)
          console.log(allIntervals[i])
          let start = allIntervals[i].start
          let end = allIntervals[i].end
          let endSplit = end.split(':')
          endSplit[0]=='00'?end = `24:${endSplit[1]}`:end
          console.log(start+' '+ end)
          if (time >= start && time < end) {
            return allPreviousCount.map((item, index) => {
              if (index === i) {
                // Modify the object
                return { ...item, totalCom: previousCount.preCompulsions, totalRem1: previousCount.preRuminations1, totalRem2: previousCount.preRuminations2 };
              }
              return item;
            });
          }
        }
        return allPreviousCount;
      }
      setAllPreviousCount(NewAllPreviousCount())
    }

  }, [previousCount])

  // useEffect 3 - To store 'allPreviousCount' in localStorage on every 'allPreviousCount' state update.
  useEffect(() => {
    // console.log('useEffect 3 / saving allPreviousCount to LS useEffect...')
    if (allPreCountSaveToLS == true) {
      localStorage.setItem("allPreviousCount", JSON.stringify(allPreviousCount))
      setAllPreCountSaveToLS(false)
    }
  }, [allPreviousCount])

  // To save last date in localStorage.
  useEffect(()=>{
      if(lastSavedDate!=null){
      localStorage.setItem('lastSavedDate', lastSavedDate)
      }
  },[lastSavedDate])

  // To handle input and update 'ocdCount' & 'saveBtn'.
  const handleInput = (e) => {
    setOcdCount({ ...ocdCount, [e.target.name]: +e.target.value })
    setSaveBtn(false)
  };

  // To only handle compulsions input and update 'ocdCount.compulsions' & 'saveBtn'.
  const handleCompulsionsClick = (n) => {
    setOcdCount({ ...ocdCount, compulsions: ocdCount.compulsions + n })
    setSaveBtn(false)
  };

  // To only handle ruminations input and update 'ocdCount.ruminations1'/'ocdCount.ruminations2' & 'saveBtn'.
  const handleRuminationsClick = (n) => {
    if (ocdCount.ruminations2 + n > 59) {
      let remainder = ocdCount.ruminations2 % n;
      setOcdCount({ ...ocdCount, ruminations1: ocdCount.ruminations1 + 1, ruminations2: remainder })
    } else {
      setOcdCount({ ...ocdCount, ruminations2: ocdCount.ruminations2 + n })
    }
    setSaveBtn(false)
  };

  let currentTime = new Date().getHours()// To get current time

  const allIntervals = useAppSelector((state) => state.allIntervals.allIntervals)// To get all intervals from redux store.

  // useEffect - 4 To set 'currentInterval' from allIntervals, according to current time.
  useEffect(() => {
    // console.log('useEffect 4 / To set current Interval...')
    // console.log('current Hour =' + currentTime)//16
    // console.log(allIntervals)
    if (allIntervals.length) {
      allIntervals.forEach(element => {
        let timeStartArray = element.start.split(':') //[15, 18] //[18, 21]  //"00" //"00"
        let timeEndArray = element.end.split(':') //[18, 21] //[21, 00]  //"07" //"00"

        if (currentTime >= timeStartArray[0] && timeEndArray[0] === "00") {
          // console.log("time checking case 1...")
          // console.log(element)
          setCurrentInterval(element)
        }
        if (currentTime >= timeStartArray[0] && currentTime < timeEndArray[0]) {
          // console.log("time checking case 2...")
          // console.log(element)
          setCurrentInterval(element)
        }
      });
    }
  }, [allIntervals])


  return (
    <div className='my-8 px-1' ref={CounterDivRef}>
      <div className='bg-slate-100 dark:bg-gray-700 dark:text-slate-200 text-gray-900 lg:w-3/4 xl:w-3/5 2xl:w-6/12 m-auto px-2 py-4 md:p-7 text-center border-4 border-blue-300 rounded-lg '>
        <div>
          <p className='font-bold text-lg'>{currentInterval.start + " to " + currentInterval.end}</p>
          <Link href="/setIntervals" className='inline-block my-2 mx-2 py-2 px-3 bg-green-600 text-slate-100 hover:bg-green-500 border-2 border-green-500 rounded'>Change Intervals</Link>
        </div>

        <div className='my-3 flex flex-col justify-center items-center space-y-4'>
          <div className='pb-4 w-full grid sm:grid-cols-3 gap-3 border-4 border-blue-500 rounded'>
            <h2 className='py-2 bg-blue-500 text-white text-lg'>Compulsions</h2>
            <div className='flex justify-center items-center space-x-8 md:space-x-4 border-y-2 border-red-500'>
              <p className='w-12 text-nowrap text-red-500'>{previousCount.preCompulsions}</p>
              <Link href='/history' className='py-2 px-4 inline-block bg-red-500 hover:bg-red-400 text-slate-50'>History</Link>
            </div>
            <div className='justify-self-center sm:order-1 sm:col-span-3'>
              <input name="compulsions" id="compulsions" className="p-2 m-1 w-16 dark:text-gray-700 border-2 border-blue-500 rounded" type="number" onChange={handleInput} value={ocdCount.compulsions} placeholder='Compution Count' />
            </div>
            <div className=''>
              <button className='my-1 mx-1 py-3 px-4 hover:bg-blue-500 border-2 border-blue-500 rounded-full hover:text-slate-50' onClick={() => { handleCompulsionsClick(1) }}>01</button>
              <button className='my-1 mx-1 py-3 px-4 hover:bg-blue-500 border-2 border-blue-500 rounded-full hover:text-slate-50' onClick={() => { handleCompulsionsClick(5) }}>05</button>
              <button className='my-1 mx-1 py-3 px-4 hover:bg-blue-500 border-2 border-blue-500 rounded-full hover:text-slate-50' onClick={() => { handleCompulsionsClick(10) }}>10</button>
            </div>
          </div>
          <div className='pb-4 w-full grid sm:grid-cols-3 gap-3 border-4 border-blue-500 rounded'>
            <h2 className='py-2 bg-blue-500 text-white text-lg'>Ruminations</h2>
            <div className='flex justify-center items-center space-x-8 md:space-x-4 border-y-2 border-red-500'>
              <p className='w-12 text-nowrap text-red-500'>{previousCount.preRuminations1 + ' : ' + previousCount.preRuminations2}</p>
              <Link href='/history' className='py-2 px-4 inline-block bg-red-500 hover:bg-red-400 text-slate-50'>History</Link>
            </div>
            <div className='justify-self-center sm:order-1 sm:col-span-3'>
              <input name="ruminations1" id="ruminations1" className="p-2 m-1 w-14 dark:text-gray-700 border-2 border-blue-500 rounded" type="number" onChange={handleInput} value={ocdCount.ruminations1} placeholder='Rum1 Count' />
              <span> : </span>
              <input name="ruminations2" id="ruminations2" className="p-2 m-1 w-14 dark:text-gray-700 border-2 border-blue-500 rounded" type="number" onChange={handleInput} value={ocdCount.ruminations2} placeholder='Rum2 Count' />
            </div>
            <div className=''>
              <button className='my-1 mx-1 py-3 px-4 hover:bg-blue-500 border-2 border-blue-500 rounded-full hover:text-slate-50' onClick={() => { handleRuminationsClick(1) }}>01</button>
              <button className='my-1 mx-1 py-3 px-4 hover:bg-blue-500 border-2 border-blue-500 rounded-full hover:text-slate-50' onClick={() => { handleRuminationsClick(5) }}>05</button>
              <button className='my-1 mx-1 py-3 px-4 hover:bg-blue-500 border-2 border-blue-500 rounded-full hover:text-slate-50' onClick={() => { handleRuminationsClick(10) }}>10</button>
            </div>
          </div>
          <div className=''>
            <button id="saveBtn" className="py-2 px-4 bg-green-600 text-slate-100 hover:bg-green-500 border-2 border-green-500 disabled:border-green-400 disabled:bg-green-400 rounded-lg" disabled={saveBtn} onClick={save}>Save</button>
          </div>
        </div>
      </div>
      <p className='text-center pt-8'>KEEP ON MOVING SLOWLY AND STEADILY</p>
    </div>
  )
}

export default MainCouter

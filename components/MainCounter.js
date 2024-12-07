'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { replaceLastSavedDateAllHis, replaceLoaderValue } from '@/redux/features/allIntervals/allIntervalsSlice'

const MainCounter = () => {

  // To hold ocd count in form.
  const [ocdCount, setOcdCount] = useState({ compulsions: 0, ruminations1: 0, ruminations2: 0 })

  // For input placeholder.
  const [countPlaceholder, setCountPlaceholder] = useState({ compulsions: 0, ruminations1: 0, ruminations2: 0 })

  // To hold all total count.
  const [totalCount, setTotalCount] = useState({ totalCom: 0, totalRum1: 0, totalRum2: 0 })

  // To hold all previous count.
  const [allPreviousCount, setAllPreviousCount] = useState([])

  // Whether to save all precious counts or not in LocalStorage
  const [allPreCountSaveToLS, setAllPreCountSaveToLS] = useState(false)

  // To hold last save date of local storage data.
  const [lastSavedDate, setLastSavedDate] = useState('0-0-0')

  // To make save button clickable/ non-clickable.
  const [saveBtn, setSaveBtn] = useState(true)

  // To hold Interval
  const [currentInterval, setCurrentInterval] = useState({ start: 'NA', end: 'NA' })

  // To get allIntervals from redux store.
  const allIntervals = useAppSelector((state) => state.allIntervals.allIntervals)

  // Refered to ocd conter element
  const CounterDivRef = useRef(null);

  // To dipatch Store reducers
  const dispatch = useAppDispatch()

  // For navigation
  const router = useRouter()

  // useEffect 0 - To scroll to Counter on render
  useEffect(() => {
    // Scroll the div into view after the component has mounted
    if (CounterDivRef.current) {
      CounterDivRef.current.scrollIntoView({
        behavior: 'smooth', // For a smooth scrolling effect
        block: 'start',     // Aligns the div to the top of the view
      });
    }
  }, [])

  // To save previous Counts and Intervals to IndexedDB
  const saveToIndexedDB = (db, storedData, savedToIDB, lastDate, lastMonth, lastYear) => {
    if (!savedToIDB) {
      const localStorageAllPreCount = JSON.parse(localStorage.getItem('allPreviousCount'))
      const localStorageTotalCount = JSON.parse(localStorage.getItem('totalCount'))

      // To check Intervals for this month already saved or not in IDB.
      const savedIntToIDB = JSON.parse(localStorage.getItem('savedIntToIDB'))

      const objStore = 'Y' + lastYear

      // Open a readwrite transaction for 'Y<number>', ex: Y2024.
      const transaction = db.transaction([objStore], 'readwrite');
      const objectStore = transaction.objectStore(objStore);

      const preDate = 'D' + lastDate // ex, D24
      const preMonth = 'Month' + lastMonth // ex, Month3 (Key name in ObjectStore)
      const preMonthInterval = 'Month' + lastMonth + 'Int' // ex, Month3Int (Interval's key name in ObjectStore)

      // Data structure which will be saved in IDB.
      const putCountRequest = objectStore.put({ month: preMonth, value: JSON.stringify([...storedData, { [preDate]: [localStorageTotalCount, ...localStorageAllPreCount] }]) });

      // Save intervals to IDB only if they are not already saved
      if (!savedIntToIDB) {
        const putIntervalsRequest = objectStore.put({ month: preMonthInterval, value: JSON.stringify(allIntervals) });

        // Handle success case
        putIntervalsRequest.onsuccess = function () {
          console.log('Intervals Data successfully updated or created in IDB for:', preDate);
        };

        // Handle error case
        putIntervalsRequest.onerror = function (event) {
          console.error('Error updating or creating Intervals data in IDB :', event.target.error);
        };

        // To indicate that data has been saved in IDB for the next day's save operation.
        localStorage.setItem('savedIntToIDB', JSON.stringify(true))
      }

      // Handle success case
      putCountRequest.onsuccess = function () {
        console.log('Counts has been successfully updated or created in IDB for', preDate)

        // To update last saved date.
        const lSDAllHistory = lastDate + '-' + lastMonth + '-' + lastYear
        dispatch(replaceLastSavedDateAllHis({ lSDAllHistory, saveToLS: true }))

        // To remove all previous saved Counts.
        localStorage.removeItem('allPreviousCount');

        // Resets counts to zero for all intervals to start tracking new counts for today
        setAllPreviousCount(allIntervals.map((obj) => {
          return { ...obj, totalCom: 0, totalRum1: 0, totalRum2: 0 }
        }))
      };

      // Handle error case
      putCountRequest.onerror = function (event) {
        console.error('Error while updating or creating Count data in IDB :', event.target.error);
      };

      // Transaction oncomplete for a final confirmation.
      transaction.oncomplete = function () {
        console.log('Transaction completed successfully.');
        localStorage.setItem('savedToIDB', JSON.stringify(true))
      };

      // Handle transaction-level errors (not just put...Request errors)
      transaction.onerror = function (event) {
        console.error('Transaction failed:', event.target.error);
      };
    } else {
      console.log('Either the data has already been saved, or there is no need to save it right now.')
    }
  }

  // useEffect 1 - To set 'ocdCount' , 'previousCount' & 'allPreviousCount' from localStorage OR To reset the application.

  useEffect(() => {
    // Retriving lastSavedDate from localStorage.
    const localStoLastSavedDate = JSON.parse(localStorage.getItem('lastSavedDate'))// 0-0-0 //22-11-2024

    // Retrieving savedToIDB to check if the previous data has been saved or not.
    const LocalStoSavedToIDB = JSON.parse(localStorage.getItem('savedToIDB'))

    // Set savedToIDB to true if it doesn't exist (to prevent errors).
    LocalStoSavedToIDB == null ? localStorage.setItem('savedToIDB', JSON.stringify(true)) : console.log('found savedToIDB')

    // Continue saving if lastSavedDate is the same; otherwise, save the previous data in IDB and start fresh.
    if (localStoLastSavedDate) {

      // Split Date, Month, Year of lastSavedDate.
      let lastDate = localStoLastSavedDate.split('-')

      let currentDate = new Date().getDate()// To get current Date
      let currentMonth = (new Date().getMonth() + 1)// To get current Month
      let currentYear = new Date().getFullYear()// To get current Year

      // Continue using the previously saved data for today.
      if (lastDate[0] == currentDate && lastDate[1] == currentMonth && lastDate[2] == currentYear) {

        let localStorageAllPreCount = JSON.parse(localStorage.getItem('allPreviousCount'))
        if (localStorageAllPreCount) {
          setAllPreviousCount(localStorageAllPreCount)
        }
        // console.log('Continue adding with todays history')
      } else {

        console.log('Retriving previous saved data from IndexedDb...')

        // Retrieving savedToIDB to check if the previous data has been saved or not.
        const savedToIDB = JSON.parse(localStorage.getItem('savedToIDB'))

        // Retrieving IDB Version.
        const dbVer = JSON.parse(localStorage.getItem('dbVer'))

        // Increment the IDB Version.
        const newDBVer = dbVer ? dbVer + 1 : 0

        // Ensure IDB operations execute only on the client side.
        if (typeof window !== 'undefined') {

          // Request to open the IndexedDB database
          const request = indexedDB.open('OCDAppDB', newDBVer);

          // To save Incremented IDB version.
          localStorage.setItem('dbVer', JSON.stringify(newDBVer))

          const objStore = 'Y' + lastDate[2]

          // Event triggered when the database version is upgraded or first created.
          request.onupgradeneeded = function (event) {
            const db = event.target.result;

            // Create the 'countStore' object store if it doesn't already exist.
            if (!db.objectStoreNames.contains(objStore)) {
              const objectStore = db.createObjectStore(objStore, { keyPath: 'month' });
              console.log('Created object store:', objectStore.name);
            }
          };

          // Event triggered when the database is successfully opened.
          request.onsuccess = function (event) {
            const db = event.target.result;

            // Check if the object store already exists in the database.
            if (db.objectStoreNames.contains(objStore)) {
              const transaction = db.transaction([objStore], 'readonly');
              const objectStore = transaction.objectStore(objStore);
              const getRequest = objectStore.get('Month' + lastDate[1]); // Attempt to retrieve data for the specified month.

              // Handle successful retrieval from the object store.
              getRequest.onsuccess = function () {
                if (getRequest.result) {
                  const storedData = JSON.parse(getRequest.result.value); // Parse the retrieved data
                  saveToIndexedDB(db, storedData, savedToIDB, lastDate[0], lastDate[1], lastDate[2]); // Save updated data
                } else {
                  saveToIndexedDB(db, [], savedToIDB, lastDate[0], lastDate[1], lastDate[2]); // Save empty data if none exists
                }
              };
            } else {
              console.log(`${objStore} does not exists in IndexedDB data`)
            }
          }

          // Event triggered when there is an error opening the IndexedDB database.
          request.onerror = function (event) {
            console.error('Failed to open IndexedDB:', event.target.error);
          };
        }
      }
    }

    // Store allPreviousCount values based on intervals (either at the start of fresh data or after saving data).
    let localStorageAllPreCount = JSON.parse(localStorage.getItem('allPreviousCount'))
    if (!localStorageAllPreCount) {
      setAllPreviousCount(allIntervals.map((obj) => {
        return { ...obj, totalCom: 0, totalRum1: 0, totalRum2: 0 }
      }))
    }
  }, [])

  // useEffect 2 - To set 'currentInterval' from allIntervals, according to current time.
  useEffect(() => {
    let currentTime = new Date().getHours(); // Get the current hour of the day (0-23)

    if (allIntervals.length) {
      allIntervals.forEach(element => {

        let timeStartArray = element.start.split(':') // 00:00 => [00, 00]
        let timeEndArray = element.end.split(':')     // 07:00 => [07, 00]

        // If the interval ends at midnight (00:00), e.g., 12:00 - 00:00
        if (currentTime >= timeStartArray[0] && timeEndArray[0] === "00") {
          setCurrentInterval(element);
        }

        // If the interval ends at any hour other than midnight (e.g., 12:00 - 18:00)
        if (currentTime >= timeStartArray[0] && currentTime < timeEndArray[0]) {
          setCurrentInterval(element)
        }
      });
    }
  }, [allIntervals])

  // useEffect 3 - To retrive last saved counts according to Current Interval.
  useEffect(() => {
    if (allPreCountSaveToLS == false) {

      // Ensuring allPreviousCount & currentInterval are not empty.
      if (allPreviousCount != [] && currentInterval != { start: 'NA', end: 'NA' }) {

        allPreviousCount.map((count) => {
          if (count.start == currentInterval.start && count.end == currentInterval.end) {
            setOcdCount({ compulsions: count.totalCom, ruminations1: count.totalRum1, ruminations2: count.totalRum2 })
            setCountPlaceholder({ compulsions: count.totalCom, ruminations1: count.totalRum1, ruminations2: count.totalRum2 })
          }
        })
      }
    }
  }, [allPreviousCount, currentInterval])

  // useEffect 4 - To remove 'intervalsforIDB' from LocalStorage when month or year changes.
  useEffect(() => {
    let localStoLastSavedDate = JSON.parse(localStorage.getItem('lastSavedDate'))
    const currentMonth = (new Date().getMonth() + 1) // current Month
    const currentYear = new Date().getFullYear() // current Year

    // Check if the current month and year match the last saved date in localStorage.
    // If not, remove 'intervalsforIDB' from localStorage.
    if ((localStoLastSavedDate?.split('-')[1] != currentMonth) || (localStoLastSavedDate?.split('-')[2] != currentYear)) {
      localStorage.removeItem('intervalsforIDB');
    }
  }, [])

  // To update 'previousCount', 'saveBtn' on click saved button.
  // To update 'allPreviousCount' and lastSavedDate.
  const save = () => {
    dispatch(replaceLoaderValue(30))

    const intervalsforIDBLocalSto = JSON.parse(localStorage.getItem('intervalsforIDB'))

    // Ensure that the intervals are set for the current month.
    if (intervalsforIDBLocalSto) {
      dispatch(replaceLoaderValue(50))

      const currentDate = new Date().getDate()// current Date
      const currentMonth = (new Date().getMonth() + 1)// current Month
      const currentYear = new Date().getFullYear()// current Year

      // Updating lastSavedDate.
      setLastSavedDate(currentDate + '-' + currentMonth + '-' + currentYear)
      localStorage.setItem('lastSavedDate', JSON.stringify(currentDate + '-' + currentMonth + '-' + currentYear))

      // Determine the correct interval for saving data in 'allPreviousCount' based on the current time.
      let currentTimeHour = new Date().getHours().toString().padStart(2, '0');// current hour
      let currentTimeMin = new Date().getMinutes().toString().padStart(2, '0');// current minutes
      const time = (currentTimeHour + ':' + currentTimeMin) //current time


      // Needs to be updated with --use currentInterval-- method.
      // Returns the updated value of 'allPreviousCount'.
      const NewAllPreviousCount = () => {
        for (let i = 0; i < allIntervals.length; i++) {
          let start = allIntervals[i].start
          let end = allIntervals[i].end
          let endSplit = end.split(':') // eg., 00:07 => [00, 07]
          endSplit[0] == '00' ? end = `24:${endSplit[1]}` : end // If the ending hour of Interval is 00, then convert it to 24. [00=>24].
          if (time >= start && time < end) {
            // This will return the updated Array of allPreviousCount.
            return allPreviousCount.map((item, index) => {
              if (index === i) {
                // Modify the object
                return { ...item, totalCom: ocdCount.compulsions, totalRum1: ocdCount.ruminations1, totalRum2: ocdCount.ruminations2 };
              }
              return item;
            });
          }
        }
        return allPreviousCount;
      }

      setAllPreviousCount(NewAllPreviousCount());
      setAllPreCountSaveToLS(true); // To save updated allPreviousCount value into localStorage.
      setCountPlaceholder({ compulsions: ocdCount.compulsions, ruminations1: ocdCount.ruminations1, ruminations2: ocdCount.ruminations2 });

      setSaveBtn(true)
      toast.success('Saved!');
    } else {
      toast.warn('Please set the intervals for this month first!')
      dispatch(replaceLoaderValue(40))
      router.push('/setIntervals')
    }
  };

  // useEffect 5 - to save 'allPreviousCount' and 'savedToIDB'=false in localStorage.
  useEffect(() => {
    // Ensure this executes only after updating 'allPreviousCount'.
    if (allPreCountSaveToLS == true) {
      localStorage.setItem('allPreviousCount', JSON.stringify(allPreviousCount))
      localStorage.setItem('savedToIDB', JSON.stringify(false))
    }
    setAllPreCountSaveToLS(false)
    dispatch(replaceLoaderValue(100))
  }, [allPreCountSaveToLS])

  // Calculate the total count based on allPreviousCount for today.
  useEffect(() => {
    if (allPreviousCount.length) {

      // Total Count's States
      let totalCompulsions = 0
      let totalRuminations1 = 0
      let totalRuminations2 = 0

      // Use for...of loop for asynchronous operations.
      for (const count of allPreviousCount) {
        // Increment values based on allPreviousCount.
        totalCompulsions += +count.totalCom; 
        totalRuminations1 += +count.totalRum1;
        totalRuminations2 += +count.totalRum2;
      }

      // Continue executing until the total count minute value decreases to 59.
      while (totalRuminations2 > 59) {
        const remaining = totalRuminations2 - 60
        totalRuminations1 += 1; // Increases hour.
        totalRuminations2 = remaining; // remaining minutes.
      }

      const newTotalCount = { totalCom: totalCompulsions, totalRum1: totalRuminations1, totalRum2: totalRuminations2 }

      setTotalCount(newTotalCount)

      // Saving 'totalCount' to localStorage for future using with history.
      localStorage.setItem('totalCount', JSON.stringify(newTotalCount))
    }

  }, [allPreviousCount])

  // onChange - of Compulsion Input.
  const handleCompulsionChange = (e) => {
    if (e.target.value >= 0) {
      const value = e.target.value != '' ? Math.round(e.target.value) : e.target.value
      setOcdCount({ ...ocdCount, [e.target.name]: value })
      setSaveBtn(false)
    } else {
      toast.error('Please enter the correct value!')
    }
  };

  // onChange - of Rumination hour Input.
  const handleRumination1Change = (e) => {
    if (e.target.value >= 0 && e.target.value <= 24) {
      const trimmedValue = e.target.value != '' ? parseInt(e.target.value, 10) : e.target.value
      setOcdCount({ ...ocdCount, [e.target.name]: trimmedValue })
      setSaveBtn(false)
    } else {
      toast.error('Please enter a value between 0 and 24!')
    }
  };

  // onChange - of Rumination mins Input.
  const handleRumination2Change = (e) => {
    if (e.target.value >= 0 && e.target.value <= 59) {
      const trimmedValue = e.target.value != '' ? parseInt(e.target.value, 10) : e.target.value
      setOcdCount({ ...ocdCount, [e.target.name]: trimmedValue })
      setSaveBtn(false)
    } else {
      toast.error('Please enter a value between 0 and 59!')
    }
  };

  // To increase ocdCount compulsions by 1/2/5.
  const handleCompulsionsClick = (n) => {
    setOcdCount({ ...ocdCount, compulsions: ocdCount.compulsions + n })
    setSaveBtn(false)
  };

  // To increase ocdCount ruminations by 1/2/5.
  const handleRuminationsClick = (n) => {
    if (ocdCount.ruminations2 + n > 59) {
      let remainder = ocdCount.ruminations2 % n;
      setOcdCount({ ...ocdCount, ruminations1: ocdCount.ruminations1 + 1, ruminations2: remainder })
    } else {
      setOcdCount({ ...ocdCount, ruminations2: ocdCount.ruminations2 + n })
    }
    setSaveBtn(false)
  };

  return (
    <div className='my-8 px-1' ref={CounterDivRef}>
      <div className='bg-slate-100 dark:bg-gray-700 dark:text-slate-200 text-gray-900 lg:w-3/4 xl:w-3/5 2xl:w-6/12 m-auto px-2 py-4 md:p-7 text-center border-4 border-blue-300 rounded-lg '>
        <div>
          <p className='font-bold text-lg'>{currentInterval.start + " to " + currentInterval.end}</p>
          <Link href="/setIntervals" className='inline-block my-2 mx-2 py-2 px-3 bg-green-600 text-slate-100 hover:bg-green-500 border-2 border-green-500 rounded' onClick={() => { dispatch(replaceLoaderValue(40)) }}>Change Intervals</Link>
        </div>

        <div className='my-3 flex flex-col justify-center items-center space-y-4'>
          <div className='pb-4 w-full grid sm:grid-cols-3 gap-3 border-4 border-blue-500 rounded'>
            <h2 className='py-2 bg-blue-500 text-white text-lg'>Compulsions</h2>
            <div className='flex justify-center items-center space-x-8 md:space-x-4 border-y-2 border-red-500'>
              <p className='w-12 text-nowrap text-red-500'>{totalCount.totalCom}</p>
              <Link href={`/history`} className='py-2 px-4 inline-block bg-red-500 hover:bg-red-400 text-slate-50' onClick={() => { dispatch(replaceLoaderValue(40)) }}>History</Link>
            </div>
            <div className='justify-self-center sm:order-1 sm:col-span-3'>
              <input name="compulsions" id="compulsions" className="p-2 m-1 w-16 dark:text-gray-700 border-2 border-blue-500 rounded" type="number" onChange={handleCompulsionChange} value={ocdCount.compulsions} placeholder={countPlaceholder.compulsions} min='00' />
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
              <p className='w-12 text-nowrap text-red-500'>{totalCount.totalRum1 + ' : ' + totalCount.totalRum2}</p>
              <Link href={`/history`} className='py-2 px-4 inline-block bg-red-500 hover:bg-red-400 text-slate-50' onClick={() => { dispatch(replaceLoaderValue(40)) }}>History</Link>
            </div>
            <div className='justify-self-center sm:order-1 sm:col-span-3'>
              <input name="ruminations1" id="ruminations1" className="p-2 m-1 w-14 dark:text-gray-700 border-2 border-blue-500 rounded" type="number" onChange={handleRumination1Change} value={ocdCount.ruminations1} placeholder={countPlaceholder.ruminations1} min="00" max="24" />
              <span> : </span>
              <input name="ruminations2" id="ruminations2" className="p-2 m-1 w-14 dark:text-gray-700 border-2 border-blue-500 rounded" type="number" onChange={handleRumination2Change} value={ocdCount.ruminations2} placeholder={countPlaceholder.ruminations2} min="00" max="59" />
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

export default MainCounter

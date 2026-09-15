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

  // To hold previous count.
  // const [previousCount, setPreviousCount] = useState({ preCompulsions: 0, preRuminations1: 0, preRuminations2: 0, saveToLS: false })

  // To hold all total count.
  const [totalCount, setTotalCount] = useState({ totalCom: 0, totalRum1: 0, totalRum2: 0 })

  // To hold all previous count.
  const [allPreviousCount, setAllPreviousCount] = useState([])

  // { start: "00:00", end: "07:00", totalCom: 0, totalRem1: 0, totalRem2: 0 },
  // { start: "07:00", end: "09:00", totalCom: 0, totalRem1: 0, totalRem2: 0 },
  // { start: "09:00", end: "12:00", totalCom: 0, totalRem1: 0, totalRem2: 0 },
  // { start: "12:00", end: "15:00", totalCom: 0, totalRem1: 0, totalRem2: 0 },
  // { start: "15:00", end: "18:00", totalCom: 0, totalRem1: 0, totalRem2: 0 },
  // { start: "18:00", end: "21:00", totalCom: 0, totalRem1: 0, totalRem2: 0 },
  // { start: "21:00", end: "00:00", totalCom: 0, totalRem1: 0, totalRem2: 0 }

  // Whether to save all precious counts or not in LocalStorage
  const [allPreCountSaveToLS, setAllPreCountSaveToLS] = useState(false)

  // To hold last save date of local storage data.
  const [lastSavedDate, setLastSavedDate] = useState('0-0-0')

  // To make save button clickable/ non-clickable.
  const [saveBtn, setSaveBtn] = useState(true)

  // To hold Interval
  const [currentInterval, setCurrentInterval] = useState({ start: 'NA', end: 'NA' })

  const allIntervals = useAppSelector((state) => state.allIntervals.allIntervals)// To get all intervals from redux store.

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

  // To save Previous Counts and Intervals to IndexedDB
  const saveToIndexedDB = (db, storedData, savedToIDB, lastDate, lastMonth, lastYear) => {
    if (!savedToIDB) {
      const localStorageAllPreCount = JSON.parse(localStorage.getItem('allPreviousCount'))
      console.log('allPreviousCount', localStorageAllPreCount)
      const localStorageTotalCount = JSON.parse(localStorage.getItem('totalCount'))
      console.log('localStorageTotalCount', localStorageTotalCount)
      const savedIntToIDB = JSON.parse(localStorage.getItem('savedIntToIDB'))

      const objStore = 'Y' + lastYear

      // Open a readwrite transaction for 'countStore'
      const transaction = db.transaction([objStore], 'readwrite');
      const objectStore = transaction.objectStore(objStore);

      const preDate = 'D' + lastDate
      const preMonth = 'Month' + lastMonth
      const preMonthInterval = 'Month' + lastMonth + 'Int'

      console.log([...storedData, { [preDate]: [localStorageTotalCount, ...localStorageAllPreCount] }])
      const putCountRequest = objectStore.put({ month: preMonth, value: JSON.stringify([...storedData, { [preDate]: [localStorageTotalCount, ...localStorageAllPreCount] }]) });

      if (!savedIntToIDB) {
        const putIntervalsRequest = objectStore.put({ month: preMonthInterval, value: JSON.stringify(allIntervals) });

        // Handle success case
        putIntervalsRequest.onsuccess = function () {
          console.log('Intervals Data successfully updated or created for:', preDate);
        };

        // Handle error case
        putIntervalsRequest.onerror = function (event) {
          console.error('Error updating or creating Intervals data:', event.target.error);
        };

        // To know data has been saved or not in IDB
        localStorage.setItem('savedIntToIDB', JSON.stringify(true))
      }

      // Handle success case
      putCountRequest.onsuccess = function () {
        console.log('Count Data successfully updated or created for:', preDate);
        const lSDAllHistory = lastDate + '-' + lastMonth + '-' + lastYear
        dispatch(replaceLastSavedDateAllHis({ lSDAllHistory, saveToLS: true }))
        // localStorage.removeItem('previousCount');
        localStorage.removeItem('allPreviousCount');
        setAllPreviousCount(allIntervals.map((obj) => {
          return { ...obj, totalCom: 0, totalRum1: 0, totalRum2: 0 }
        }))
      };

      // Handle error case
      putCountRequest.onerror = function (event) {
        console.error('Error updating or creating Count data:', event.target.error);
      };

      // Optional: Add transaction oncomplete for a final confirmation
      transaction.oncomplete = function () {
        console.log('Transaction completed successfully.');
        localStorage.setItem('savedToIDB', JSON.stringify(true))
      };

      // Optional: Handle transaction-level errors (not just put...Request errors)
      transaction.onerror = function (event) {
        console.error('Transaction failed:', event.target.error);
      };
    } else {
      console.log('Not saving to IDB')
    }
  }

  // useEffect 1 - To set 'ocdCount' , 'previousCount' & 'allPreviousCount' from localStorage OR To reset the application.

  useEffect(() => {
    console.log('useEffect 1... to save allPreviousCount..');

    const localStorageAllPreCountcheck = JSON.parse(localStorage.getItem('allPreviousCount'))
    console.log('previous counts check', localStorageAllPreCountcheck)

    const localStoLastSavedDate = JSON.parse(localStorage.getItem('lastSavedDate'))// 0-0-0 //22-11-2024
    console.log(localStoLastSavedDate)

    const LocalStoSavedToIDB = JSON.parse(localStorage.getItem('savedToIDB'))

    LocalStoSavedToIDB == null ? localStorage.setItem('savedToIDB', JSON.stringify(true)) : console.log('found savedToIDB')

    if (localStoLastSavedDate) {
      const localStorageAllPreCountcheck2 = JSON.parse(localStorage.getItem('allPreviousCount'))
      console.log('previous counts check 2', localStorageAllPreCountcheck2)
      setLastSavedDate(localStoLastSavedDate)
      let lastDate = localStoLastSavedDate.split('-')
      let currentDate = new Date().getDate()// To get current Date
      let currentMonth = (new Date().getMonth() + 1)// To get current Month
      let currentYear = new Date().getFullYear()

      if (lastDate[0] == currentDate && lastDate[1] == currentMonth && lastDate[2] == currentYear) {
        const localStorageAllPreCountcheck3 = JSON.parse(localStorage.getItem('allPreviousCount'))
        console.log('previous counts check3', localStorageAllPreCountcheck3)

        let localStoTotalCount = JSON.parse(localStorage.getItem('totalCount'))
        if (localStoTotalCount) {
          console.log(localStoTotalCount)
          setTotalCount(localStoTotalCount)
        }

        let localStorageAllPreCount = JSON.parse(localStorage.getItem('allPreviousCount'))
        if (localStorageAllPreCount) {
          setAllPreviousCount(localStorageAllPreCount)
        }

        console.log('Continue adding todays history')
      } else {
        const localStorageAllPreCountcheck4 = JSON.parse(localStorage.getItem('allPreviousCount'))
        console.log('previous counts check4', localStorageAllPreCountcheck4)

        const savedToIDB = JSON.parse(localStorage.getItem('savedToIDB'))

        console.log('Retriving data from IndexedDb...')
        const dbVer = JSON.parse(localStorage.getItem('dbVer'))
        const newDBVer = (!savedToIDB) ? dbVer + 1 : dbVer ? dbVer : 1

        if (typeof window !== 'undefined') {
          const localStorageAllPreCountcheck5 = JSON.parse(localStorage.getItem('allPreviousCount'))
          console.log('previous counts check5', localStorageAllPreCountcheck5)

          const request = indexedDB.open('OCDAppDB', newDBVer);

          localStorage.setItem('dbVer', JSON.stringify(newDBVer))
          const objStore = 'Y' + lastDate[2]

          request.onupgradeneeded = function (event) {
            const db = event.target.result;

            // Create the 'countStore' object store if it doesn't already exist
            if (!db.objectStoreNames.contains(objStore)) {
              const objectStore = db.createObjectStore(objStore, { keyPath: 'month' });
              console.log('Created object store:', objectStore.name);
            }
          };

          request.onsuccess = function (event) {
            const localStorageAllPreCountcheck6 = JSON.parse(localStorage.getItem('allPreviousCount'))
            console.log('previous counts check6', localStorageAllPreCountcheck6)

            const db = event.target.result;

            if (db.objectStoreNames.contains(objStore)) {
              const transaction = db.transaction([objStore], 'readonly');
              const objectStore = transaction.objectStore(objStore);
              const getRequest = objectStore.get('Month' + lastDate[1]);

              getRequest.onsuccess = function () {
                if (getRequest.result) {
                  const storedData = JSON.parse(getRequest.result.value);

                  const localStorageAllPreCountcheck7 = JSON.parse(localStorage.getItem('allPreviousCount'))
                  console.log('previous counts check7', localStorageAllPreCountcheck7)

                  saveToIndexedDB(db, storedData, savedToIDB, lastDate[0], lastDate[1], lastDate[2]);
                  console.log('Retrieved from IndexedDB:', storedData);
                } else {
                  console.log('failed to retrive IndexedDB data')

                  const localStorageAllPreCountcheck7 = JSON.parse(localStorage.getItem('allPreviousCount'))
                  console.log('previous counts check7', localStorageAllPreCountcheck7)

                  saveToIndexedDB(db, [], savedToIDB, lastDate[0], lastDate[1], lastDate[2])
                }
              }
            } else {
              console.log(`${objStore} is not contain in IndexedDB data`)
            }
          }

          request.onerror = function (event) {
            console.error('Failed to open IndexedDB:', event.target.error);
          };
        }

        // localStorage.removeItem('allPreviousCount')

        // setAllPreviousCount(allIntervals.map((obj) => {
        //   return { ...obj, totalCom: 0, totalRum1: 0, totalRum2: 0 }
        // }))
      }
    }

    // To store allPreviousCount values according to intervals.
    let localStorageAllPreCount = JSON.parse(localStorage.getItem('allPreviousCount'))
    if (!localStorageAllPreCount) {
      setAllPreviousCount(allIntervals.map((obj) => {
        return { ...obj, totalCom: 0, totalRum1: 0, totalRum2: 0 }
      }))
    }
  }, [])

  // useEffect 2 - To set 'currentInterval' from allIntervals, according to current time.
  useEffect(() => {
    console.log('useEffect 2 / To set current Interval...')
    let currentTime = new Date().getHours()// To get current time
    if (allIntervals.length) {
      allIntervals.forEach(element => {
        let timeStartArray = element.start.split(':') // 00:00
        let timeEndArray = element.end.split(':')     // 07:00

        if (currentTime >= timeStartArray[0] && timeEndArray[0] === "00") {
          setCurrentInterval(element)
        }
        if (currentTime >= timeStartArray[0] && currentTime < timeEndArray[0]) {
          setCurrentInterval(element)
        }
      });
    }
  }, [allIntervals])

  // useEffect 3 - To retrive last saved counts according to Interval.
  useEffect(() => {
    if (allPreCountSaveToLS == false) {
      console.log('useEffect 3 / retriving from allpreviousCOunt to ocdCount useEffect...')
      console.log('allPreviousCount', allPreviousCount)

      if (allPreviousCount != [] && currentInterval != { start: 'NA', end: 'NA' }) {
        console.log('...from updating ocdCounter with CurrentInterval')

        allPreviousCount.map((count) => {
          console.log(count)
          console.log(currentInterval)
          console.log(count.start == currentInterval.start && count.end == currentInterval.end)
          if (count.start == currentInterval.start && count.end == currentInterval.end) {
            console.log('saving to ocdCount ...')
            console.log({ compulsions: count.totalCom, ruminations1: count.totalRum1, ruminations2: count.totalRum2 })
            setOcdCount({ compulsions: count.totalCom, ruminations1: count.totalRum1, ruminations2: count.totalRum2 })
          }
        })
      }
    }
  }, [allPreviousCount, currentInterval])

  // useEffect 4 - To remove 'intervalsforIDB' from LocalStorage when month or year changes.
  useEffect(() => {
    console.log('useEffect 5 / To remove intervalsforIDB from LocalStorage...')
    let localStoLastSavedDate = JSON.parse(localStorage.getItem('lastSavedDate'))
    console.log(localStoLastSavedDate)
    const currentMonth = (new Date().getMonth() + 1)// To get current Month
    const currentYear = new Date().getFullYear()

    console.log('currentMonth', currentMonth)
    console.log('currentYear', currentYear)

    if ((localStoLastSavedDate?.split('-')[1] != currentMonth) || (localStoLastSavedDate?.split('-')[2] != currentYear)) {
      console.log('removing intervalsforIDB')
      localStorage.removeItem('intervalsforIDB')
    }
    // dispatch(replaceLoaderValue(100))
  }, [])

  // const calculatingTotalCount = () => {
  //   console.log(totalCount)
  //   let totalCompulsions = 0
  //   let totalRuminations1 = 0
  //   let totalRuminations2 = 0
  //   console.log(allPreviousCount)

  //   // Use for...of loop for asynchronous operations
  //   for (const count of allPreviousCount) {
  //     console.log(count);
  //     totalCompulsions += +count.totalCom;  // Add values
  //     totalRuminations1 += +count.totalRum1;
  //     totalRuminations2 += +count.totalRum2;
  //   }

  //   console.log('totalCounting', totalCompulsions, totalRuminations1, totalRuminations2)

  //   while (totalRuminations2 > 59) {
  //     console.log('... executing while and total RUminaiton2 = ', totalRuminations2)
  //     const remaining = totalRuminations2 - 60
  //     totalRuminations1 += 1;
  //     totalRuminations2 = remaining;
  //   }

  //   return { compulsions: totalCompulsions, ruminations1: totalRuminations1, ruminations2: totalRuminations2 }
  // }

  // To update 'previousCount', 'saveBtn'.
  const save = () => {
    dispatch(replaceLoaderValue(30))
    const intervalsforIDBLocalSto = JSON.parse(localStorage.getItem('intervalsforIDB'))
    if (intervalsforIDBLocalSto) {

      dispatch(replaceLoaderValue(50))
      // To update 'allPreviousCount' and save last date, when previous count was saved.
      const currentDate = new Date().getDate()// To get current Date
      const currentMonth = (new Date().getMonth() + 1)// To get current Month
      const currentYear = new Date().getFullYear()

      setLastSavedDate(currentDate + '-' + currentMonth + '-' + currentYear)
      localStorage.setItem('lastSavedDate', JSON.stringify(currentDate + '-' + currentMonth + '-' + currentYear))

      // setTotalCount((pre)=>({ compulsions: pre.compulsions, ruminations1: pre.ruminations1, ruminations2: pre.ruminations2 }))

      // To check in which Interval we need to save in 'allPreviousCount'.
      let currentTimeHour = new Date().getHours().toString().padStart(2, '0');// To get current hour
      let currentTimeMin = new Date().getMinutes().toString().padStart(2, '0');// To get current minutes
      const time = (currentTimeHour + ':' + currentTimeMin)

      const NewAllPreviousCount = () => {
        for (let i = 0; i < allIntervals.length; i++) {
          let start = allIntervals[i].start
          let end = allIntervals[i].end
          let endSplit = end.split(':')
          endSplit[0] == '00' ? end = `24:${endSplit[1]}` : end
          if (time >= start && time < end) {
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

      setAllPreviousCount(NewAllPreviousCount())
      // setTotalCount(calculatingTotalCount())
      setAllPreCountSaveToLS(true)

      setSaveBtn(true)
      toast.success('Saved!');
    } else {
      toast.warn('Please set the intervals for this month first!')
      dispatch(replaceLoaderValue(40))
      router.push('/setIntervals')
    }
  };

  useEffect(() => {
    console.log('saving allPreviousCount to localStorage...')
    if (allPreCountSaveToLS == true) {
      console.log(allPreviousCount)
      // const totalCounts = calculatingTotalCount()
      // console.log(totalCounts)
      // localStorage.setItem('totalCount', JSON.stringify(totalCounts))
      localStorage.setItem('allPreviousCount', JSON.stringify(allPreviousCount))
      localStorage.setItem('savedToIDB', JSON.stringify(false))
    }
    setAllPreCountSaveToLS(false)
    dispatch(replaceLoaderValue(100))
  }, [allPreCountSaveToLS])

  useEffect(() => {
    console.log('...form total calculating . All Previous COunts: ', allPreviousCount.length);
    if (allPreviousCount.length) {
      console.log('... from calculating totalCount useEffect', totalCount)
      let totalCompulsions = 0
      let totalRuminations1 = 0
      let totalRuminations2 = 0
      console.log(allPreviousCount)

      // Use for...of loop for asynchronous operations
      for (const count of allPreviousCount) {
        console.log(count);
        totalCompulsions += +count.totalCom;  // Add values
        totalRuminations1 += +count.totalRum1;
        totalRuminations2 += +count.totalRum2;
      }

      console.log('totalCounting', totalCompulsions, totalRuminations1, totalRuminations2)

      while (totalRuminations2 > 59) {
        console.log('... executing while and total RUminaiton2 = ', totalRuminations2)
        const remaining = totalRuminations2 - 60
        totalRuminations1 += 1;
        totalRuminations2 = remaining;
      }

      const newTotalCount = { totalCom: totalCompulsions, totalRum1: totalRuminations1, totalRum2: totalRuminations2 }

      setTotalCount(newTotalCount)
      localStorage.setItem('totalCount', JSON.stringify(newTotalCount))
    }

  }, [allPreviousCount])


  useEffect(() => {
    console.log('totalCount : ', totalCount)
  }, [totalCount])

  // To handle input and update 'ocdCount' & 'saveBtn'.
  // const handleInput = (e) => {

  //   if (e.target.name == 'compulsions') {
  //     console.log('.. from compulsions Input')
  //     setOcdCount({ ...ocdCount, [e.target.name]: +e.target.value })
  //   }

  //   if (e.target.name == 'ruminations1') {
  //     console.log('... from ruminations1 Input')
  //     if (e.target.value < 0 || e.target.value > 24) {
  //       toast.error('Hours must be between 0 and 24.')
  //     } else {
  //       setOcdCount({ ...ocdCount, [e.target.name]: +e.target.value })
  //     }
  //   }

  //   if (e.target.name == 'ruminations2') {
  //     console.log('... from ruminations2 Input')
  //     if (e.target.value < 0 || e.target.value > 59) {
  //       toast.error('Minutes must be between 0 and 59.')
  //     } else {
  //       setOcdCount({ ...ocdCount, [e.target.name]: +e.target.value })
  //     }
  //   }
  //   setSaveBtn(false)
  // };

  const handleCompulsionChange = (e) => {
    console.log('...from handling compulsions', e.target.value)
    if(e.target.value>=0){
      const value = e.target.value !=''? Math.round(e.target.value) : e.target.value
      console.log(value)
      setOcdCount({ ...ocdCount, [e.target.name]: value })
      setSaveBtn(false)
    }else{
      toast.error('Please enter the correct value!')
    }
  };

  const handleRumination1Change = (e) => {
    console.log('rumination1', e.target.value)
    if (e.target.value >= 0 && e.target.value <= 24) {
      const trimmedValue = e.target.value != '' ? parseInt(e.target.value, 10) : e.target.value
      console.log(trimmedValue)
      setOcdCount({ ...ocdCount, [e.target.name]: trimmedValue })
      setSaveBtn(false)
    } else {
      toast.error('Please enter a value between 0 and 24!')
    }
  };

  const handleRumination2Change = (e) => {
    console.log('rumination2', e.target.value)
    if (e.target.value >= 0 && e.target.value <= 59) {
      const trimmedValue = e.target.value != '' ? parseInt(e.target.value, 10) : e.target.value
      console.log(trimmedValue)
      setOcdCount({ ...ocdCount, [e.target.name]: trimmedValue })
      setSaveBtn(false)
    } else {
      toast.error('Please enter a value between 0 and 59!')
    }
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
              <input name="compulsions" id="compulsions" className="p-2 m-1 w-16 dark:text-gray-700 border-2 border-blue-500 rounded" type="number" onChange={handleCompulsionChange} value={ocdCount.compulsions} placeholder='Compution Count' min='00' />
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
              <input name="ruminations1" id="ruminations1" className="p-2 m-1 w-14 dark:text-gray-700 border-2 border-blue-500 rounded" type="number" onChange={handleRumination1Change} value={ocdCount.ruminations1} placeholder='00' min="00" max="24" />
              <span> : </span>
              <input name="ruminations2" id="ruminations2" className="p-2 m-1 w-14 dark:text-gray-700 border-2 border-blue-500 rounded" type="number" onChange={handleRumination2Change} value={ocdCount.ruminations2} placeholder={ocdCount.ruminations2} min="00" max="59" />
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

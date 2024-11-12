'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const History = ({ params }) => {

  // To hold all previous counts
  const [allPreviousCount, setAllPreviousCount] = useState(null)

  const [monthHistory, setMonthHistory] = useState([])

  // To load all previous counts from local Storage.
  useEffect(() => {
    console.log(Number(params.var[0]) + 1 < new Date().getMonth() + 1)
    console.log(new Date().getMonth() + 1)
    console.log(Number(params.var[0]) + 1)


    let localStorageAllPreCountData = JSON.parse(localStorage.getItem('allPreviousCount'))

    if (localStorageAllPreCountData) {
      setAllPreviousCount(localStorageAllPreCountData)
    }

    if (typeof window !== 'undefined') {
      const request = indexedDB.open('OCDAppDB', 1);

      // request.onupgradeneeded = function (event) {
      //   const db = event.target.result;
      //   console.log('onupgradeneeded: Upgrading or initializing database');

      // Create the 'countStore' object store if it doesn't already exist
      // if (!db.objectStoreNames.contains('countStore')) {
      //   console.log('creating object countStore store')
      //   const objectStore = db.createObjectStore('countStore', { keyPath: 'month' });
      //   console.log('Created object store:', objectStore.name);
      // }
      // };

      request.onsuccess = function (event) {
        console.log('request.onsuccess')
        const db = event.target.result;

        const currentYear = new Date().getFullYear();
        const objStore = 'Y' + currentYear
        console.log('year is ', objStore)

        if (db.objectStoreNames.contains(objStore)) {
          console.log('onsuccess from first indexedDb function')
          const transaction = db.transaction([objStore], 'readonly');
          const objectStore = transaction.objectStore(objStore);

          let localStoLastSavedDate = localStorage.getItem('lastSavedDate')

          let lastDate = params.var[0]
          let currentDate = new Date().getDate()// To get current Date
          let currentMonth = (new Date().getMonth() + 1)// To get current Month
          // const month = 'Month' + (currentMonth + 1)

          console.log(lastDate)
          const getRequest = objectStore.get('Month' + lastDate);

          getRequest.onsuccess = function () {
            if (getRequest.result) {
              console.log('getRequest result')
              const storedData = JSON.parse(getRequest.result.value);
              // setSaveToIDB(true)
              // setMonthHistory(storedData);

              // saveToIndexedDB(storedData);
              // saveToIndexedDB(db, storedData, lastDate[0], lastDate[1]);
              console.log('Retrieved from IndexedDB:', storedData);
              setMonthHistory(storedData)
            } else {
              console.log('Failed to Retrive IndexedDB data')
            }
          }
        } else {
          console.log('Failed, [Y2024] is not contain in IndexedDB data')

        }

      }
    }
  }, [])

  useEffect(() => {
    if (monthHistory) {
      console.log(monthHistory)
      console.log(monthHistory.map((day) => { return day }))
    }
  }, [monthHistory])

  const formatTime = (hours, minutes) => {
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }

  const getMonthName = (monthNumber) => {
    // Array of month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if (monthNumber==0){
      return ''
    }

    // Adjust for zero-based index (0 = January, 11 = December)
    return monthNames[monthNumber - 1]+',';
  }

  return (
    <div className='m-3 min-h-[80vh]'>

      <div className='flex text-center justify-center items-center'>
        <button className='rounded-lg hover:text-slate-400 dark:hover:bg-slate-300 hover:bg-slate-100'>
          <Link href={`/history/${Number(params.var[0]) - 1}`} className='inline-block px-4 py-2 font-bold'>&larr;</Link>
        </button><h1 className='text-xl text-center p-4 inline-block w-60'>{getMonthName(params.var[0])} 2024</h1><button className='rounded-lg hover:text-slate-400 dark:hover:bg-slate-300 hover:bg-slate-100'>
          <Link href={(Number(params.var[0]) + 1 <= new Date().getMonth() + 1) ? `/history/${Number(params.var[0]) + 1}` : `/history/${params.var[0]}`} className='inline-block px-4 py-2 font-bold '>&rarr;</Link>
        </button>
      </div>
      {/* <p className='text-center pb-4 text-yellow-500 font-bold'>Note: All histories will be erased by 23:59 today.</p> */}

      {/* <div className='m-auto sm:w-3/5'>

      </div> */}
      <div className='overflow-auto'>

        <table className="m-auto sm:w-3/5 table-auto border-collapse border border-slate-500">
          <thead>
            <tr className='text-slate-200 whitespace-nowrap'>
              {/* <th className='border border-blue-400 bg-blue-500 p-2'>S.No.</th> */}
              <th className='border border-slate-400 bg-slate-500 p-2'>Date</th>
              <th className='border border-cyan-400 bg-cyan-500 p-2'>Total</th>
              <th className='border border-orange-400 bg-orange-500 p-2'>W-7</th>
              <th className='border border-orange-400 bg-orange-500 p-2'>7-9</th>
              <th className='border border-orange-400 bg-orange-500 p-2'>9-12</th>
              <th className='border border-orange-400 bg-orange-500 p-2'>12-15</th>
              <th className='border border-orange-400 bg-orange-500 p-2'>15-18</th>
              <th className='border border-orange-400 bg-orange-500 p-2'>18-21</th>
              <th className='border border-orange-400 bg-orange-500 p-2'>21-M</th>
              {/* <th className='border border-blue-400 bg-blue-500 p-2'>COM.</th> */}
              {/* <th className='border border-blue-400 bg-blue-500 p-2'>RUM.</th> */}
            </tr>
          </thead>

          <tbody className='bg-slate-100 dark:bg-transparent whitespace-nowrap'>
            {/* {allPreviousCount && allPreviousCount.length>0 ? allPreviousCount.map((ocd, index) => (
            <tr key={index}>
              <td className='border border-gray-300 dark:border-slate-600 p-2 text-green-500'>{index + 1}</td>
              <td className='border border-gray-300 dark:border-slate-600 p-2 text-orange-500'>{ocd.start} - {ocd.end}</td>
              <td className='border border-gray-300 dark:border-slate-600 p-2 text-blue-500'>{ocd.totalCom}</td>
              <td className='border border-gray-300 dark:border-slate-600 p-2 text-blue-500'>{ocd.totalRem1} : {ocd.totalRem2}</td>
            </tr>
          )) : */}
            {/* <tr>
              <td colSpan="4" className='text-center p-4 dark:text-slate-100 text-black'>No history available</td>
            </tr> */}
            {/* } */}

            {/* New Data */}
            {monthHistory && monthHistory.length > 0 ? monthHistory.map((day, index) => {
              console.log(day)
              const dayKey = Object.keys(day)[0]; // Get the key, e.g., "D25"
              const dayData = day[dayKey];        // Get the array associated with the key
              let totalCompulsions = 0;
              let totalRuminations1 = 0
              let totalRuminations2 = 0

              return <>
                <tr>
                  <td rowSpan='2' className='border border-gray-300 dark:border-slate-600 p-2 dark:text-slate-300 text-slate-500 text-center'>{dayKey.slice(1).toString().padStart(2, '0')} Oct</td>
                  {dayData.map((count, index) => {
                    console.log(totalCompulsions)
                    console.log(count)
                    totalCompulsions = totalCompulsions + Number(count.totalCom)
                  })}
                  <td className='border border-gray-300 dark:border-slate-600 p-2 text-blue-500'>COM: {totalCompulsions}</td>
                  {dayData.map((count, index) => {
                    totalCompulsions = totalCompulsions + 2;
                    return <>
                      <td className='border border-gray-300 dark:border-slate-600 p-2 text-blue-500'>{count.totalCom.toString().padStart(2, '0')}</td>
                      {/* <td className='border border-gray-300 dark:border-slate-600 p-2 text-blue-500'>00</td>
                    <td className='border border-gray-300 dark:border-slate-600 p-2 text-blue-500'>00</td>
                    <td className='border border-gray-300 dark:border-slate-600 p-2 text-blue-500'>00</td>
                    <td className='border border-gray-300 dark:border-slate-600 p-2 text-blue-500'>00</td>
                    <td className='border border-gray-300 dark:border-slate-600 p-2 text-blue-500'>00</td> */}
                    </>
                  })}
                </tr>
                <tr>
                  {dayData.map((count, index) => {
                    console.log(totalRuminations1)
                    console.log(totalRuminations2)
                    console.log(count)
                    totalRuminations1 = totalRuminations1 + Number(count.totalRem1)
                    totalRuminations2 = totalRuminations2 + Number(count.totalRem2)
                  })}
                  <td className='border border-gray-300 dark:border-slate-600 p-2 text-green-500'>RUM: {totalRuminations1.toString().padStart(2, '0')}:{totalRuminations2.toString().padStart(2, '0')}</td>
                  {dayData.map((count, index) => (
                    <>
                      <td className='border border-gray-300 dark:border-slate-600 p-2 text-green-500'>{formatTime(count.totalRem1, count.totalRem2)}</td>
                    </>
                  ))}
                  {/* <td className='border border-gray-300 dark:border-slate-600 p-2 text-green-500'>00:00</td>
                <td className='border border-gray-300 dark:border-slate-600 p-2 text-green-500'>00:00</td>
                <td className='border border-gray-300 dark:border-slate-600 p-2 text-green-500'>00:00</td>
                <td className='border border-gray-300 dark:border-slate-600 p-2 text-green-500'>00:00</td>
                <td className='border border-gray-300 dark:border-slate-600 p-2 text-green-500'>00:00</td>
                <td className='border border-gray-300 dark:border-slate-600 p-2 text-green-500'>00:00</td> */}
                </tr>
              </>

            }) :
              <tr className=''>
                <td colSpan="9" className='text-center p-4 dark:text-slate-100 text-black'>No history available</td>
              </tr>}

          </tbody>
        </table>
      </div>


      {/* <tr>
        <td className='border border-slate-600 p-2'>01</td>
        <td className='border border-slate-600 p-2'>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
        <td className='border border-slate-600 p-2'>Malcolm Lockyer</td>
        <td className='border border-slate-600 p-2'>1961</td>
      </tr> */}

      {/* {allPreviousCount && allPreviousCount.map((ocd, index) => {
        return <div key={index} className='flex justify-evenly gap-6'>
          <p>{index + 1}</p>
          <p>Time: {ocd.time}</p>
          <p className='flex flex-col md:flex-row items-center'>
            Com<span className='hidden'>pulsions </span>:
            <span className='block'>{ocd.preCompulsions}</span>
          </p>
          <p className='flex flex-col md:flex-row items-center'>
            Rum<span className='hidden'>inations </span>:
            <span className='block'>{`${ocd.preRuminations1} : ${ocd.preRuminations2}`}</span>
          </p>
        </div>
      })} */}

    </div>
  )
}

export default History

'use client'
import React, { useEffect, useState } from 'react'

const History = () => {

  // To hold all previous counts
  const [allPreviousCount, setAllPreviousCount] = useState(null)

  // To load all previous counts from local Storage.
  useEffect(() => {
    let localStorageAllPreCountData = JSON.parse(localStorage.getItem('allPreviousCount'))
    if (localStorageAllPreCountData) {
      setAllPreviousCount(localStorageAllPreCountData)
    }
  }, [])

  return (
    <div className='m-3 min-h-[80vh]'>

      <h1 className='text-xl text-center p-4'>Today&apos;s History</h1>
      <p className='text-center pb-4 text-yellow-500 font-bold'>Note: All histories will be erased by 23:59 today.</p>

      <table className="m-auto sm:w-3/5 table-auto border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className='border border-green-400 bg-green-500 p-2'>S.No.</th>
            <th className='border border-orange-400 bg-orange-500 p-2'>Time</th>
            <th className='border border-blue-400 bg-blue-500 p-2'>COM.</th>
            <th className='border border-blue-400 bg-blue-500 p-2'>RUM.</th>
          </tr>
        </thead>

        <tbody className='bg-slate-100 dark:bg-transparent'>
          {allPreviousCount && allPreviousCount.length>0 ? allPreviousCount.map((ocd, index) => (
            <tr key={index}>
              <td className='border border-slate-300 dark:border-slate-600 p-2 text-green-500'>{index + 1}</td>
              <td className='border border-slate-300 dark:border-slate-600 p-2 text-orange-500'>{ocd.start} - {ocd.end}</td>
              <td className='border border-slate-300 dark:border-slate-600 p-2 text-blue-500'>{ocd.totalCom}</td>
              <td className='border border-slate-300 dark:border-slate-600 p-2 text-blue-500'>{ocd.totalRem1} : {ocd.totalRem2}</td>
            </tr>
          )) :
            <tr>
              <td colSpan="4" className='text-center p-4 dark:text-slate-100 text-black'>No history available</td>
            </tr>
          }
        </tbody>
      </table>


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

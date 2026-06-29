'use client'
import { replaceLoaderValue } from '@/redux/features/allIntervals/allIntervalsSlice'
import { useAppDispatch } from '@/redux/hooks'
import React, { useEffect, useState } from 'react'

const History = () => {

    const dispatch = useAppDispatch()

    // To hold all previous counts
    const [allPreviousCount, setAllPreviousCount] = useState(null)

    const [todayDate, setTodayDate]=useState('N/A')

    // To convert month number to month name.
    const getMonthName = (monthNumber) => {
        console.log(monthNumber)
        // Array of month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Adjust for zero-based index (0 = January, 11 = December)
        return monthNames[monthNumber];
    }

    // To load all previous counts from local Storage and
    // To update todayDate with today's date
    useEffect(() => {
        let localStorageAllPreCountData = JSON.parse(localStorage.getItem('allPreviousCount'))
        if (localStorageAllPreCountData) {
            setAllPreviousCount(localStorageAllPreCountData)
        }
        const date = String(new Date().getDate())
        const month = getMonthName(new Date().getMonth())
        const year = String(new Date().getFullYear())
        setTodayDate(date +' '+ month +', '+ year)
        dispatch(replaceLoaderValue(100))
    }, [])

    return (
        <div className='m-3 min-h-[80vh]'>

            <h1 className='text-xl text-center p-4'>Today&apos;s History</h1>
            <p className='text-center pb-4 text-yellow-500 font-bold'>{todayDate}</p>

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
                    {allPreviousCount && allPreviousCount.length > 0 ? allPreviousCount.map((ocd, index) => (
                        <tr key={index}>
                            <td className='border border-slate-300 dark:border-slate-600 p-2 text-green-500 text-center'>{index + 1}</td>
                            <td className='border border-slate-300 dark:border-slate-600 p-2 text-orange-500 text-center'>{ocd.start} - {ocd.end}</td>
                            <td className='border border-slate-300 dark:border-slate-600 p-2 text-blue-500 text-center'>{ocd.totalCom.toString().padStart(2, '0')}</td>
                            <td className='border border-slate-300 dark:border-slate-600 p-2 text-blue-500 text-center'>{ocd.totalRem1.toString().padStart(2, '0')} : {ocd.totalRem2.toString().padStart(2, '0')}</td>
                        </tr>
                    )) :
                        <tr>
                            <td colSpan="4" className='text-center p-4 dark:text-slate-100 text-black'>No history available</td>
                        </tr>
                    }
                </tbody>
            </table>

        </div>
    )
}

export default History

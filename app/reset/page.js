'use client'
import React from 'react'

const Reset = () => {

    const softReset = () => {
        if (confirm('Are you sure ?')) {
            // localStorage.removeItem('ocdCount');
            localStorage.removeItem('previousCount');
            localStorage.removeItem('allPreviousCount');
            localStorage.removeItem('lastSavedDate');
            localStorage.setItem('savedToIDB', true)
            // console.log('Removed the allPreviousCount & lastSavedDate from localStorage');
            alert('Soft Reset Successful!')
            window.location.href = '/'; // Navigate and reload
        }
    }

    const hardReset = () => {
        if (confirm('Are you sure ?')) {
            localStorage.removeItem('previousCount');
            localStorage.removeItem('allPreviousCount');
            localStorage.removeItem('lastSavedDate');
            // localStorage.removeItem('allIntervals');
            // console.log('Removed the allPreviousCount & lastSavedDate from localStorage');
            alert('Hard Reset Successful!')
            window.location.href = '/'; // Navigate and reload
        }
    }

    return (
        <div className='mt-4 min-h-[80vh] flex flex-col justify-evenly item-center space-y-2'>
            <div className='flex flex-col justify-center items-center space-y-2 px-2'>
                <h1 className='text-xl'>Soft Reset</h1>
                <p className='dark:text-yellow-500 text-center'>Note: All today&apos;s data will be erased including Ocd Counter, All Today's History.</p>
                <button type="button" onClick={softReset} className="focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-900">Soft Reset</button>
            </div>
            <div className='flex flex-col justify-center items-center space-y-2 px-2'>
                <h1 className='text-xl'>Hard Reset</h1>
                <p>Do you want to Hard Reset the application ?</p>
                <p className='dark:text-red-500 text-center'>Note: All today&apos;s data will be erased including Ocd Counter, All Today's History and All Intervals.</p>
                <button type="button" onClick={hardReset} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Hard Reset</button>
            </div>
        </div>

    )
}

export default Reset

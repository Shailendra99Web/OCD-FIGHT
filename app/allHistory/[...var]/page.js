'use client'
import DrawerChildren from '@/components/DrawerChildren'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const AllHistory = ({ params }) => {

    // To hold all previous counts
    const [allPreviousCount, setAllPreviousCount] = useState(null)
    const [monthHistory, setMonthHistory] = useState([])
    const [month, setMonth] = useState(Number(params.var[0].split('-')[0]))
    const [year, setYear] = useState(Number(params.var[0].split('-')[1]))

    // To load all previous counts from local Storage.
    useEffect(() => {

        const dbVer = JSON.parse(localStorage.getItem('dbVer'))
        console.log(dbVer)
        console.log(params)
        console.log(month, year)

        if (typeof window !== 'undefined') {
            console.log('form getting history')
            const request = indexedDB.open('OCDAppDB', dbVer ? dbVer : 1);

            request.onsuccess = function (event) {
                console.log('request.onsuccess')
                const db = event.target.result;

                const objStore = 'Y' + year
                console.log('year is ', objStore)

                if (db.objectStoreNames.contains(objStore)) {
                    console.log('onsuccess from first indexedDb function')
                    const transaction = db.transaction([objStore], 'readonly');
                    const objectStore = transaction.objectStore(objStore);

                    const getRequest = objectStore.get('Month' + month);

                    getRequest.onsuccess = function () {
                        if (getRequest.result) {
                            console.log('getRequest result')
                            const storedData = JSON.parse(getRequest.result.value);
                            console.log('Retrieved from IndexedDB:', storedData);
                            setMonthHistory(storedData)
                        } else {
                            console.log('Failed to Retrive IndexedDB data')
                        }
                    }
                } else {
                    console.log(`Failed, ${objStore} is not contain in IndexedDB data`)

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
        console.log(monthNumber)
        // Array of month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        if (monthNumber == 0) {
            return ''
        }

        // Adjust for zero-based index (0 = January, 11 = December)
        return monthNames[monthNumber - 1] + ',';
    }

    const [objectStores, setObjectStores] = useState([])
    const [showDrawer, setShowDrawer] = useState('w-0')

    const getAllObjectStoresNew = (dbName) => {
        return new Promise((resolve, reject) => {
            // Open a connection to the database
            const request = indexedDB.open(dbName);

            request.onsuccess = (event) => {
                const db = event.target.result;
                // Get all object store names
                const storeNames = Array.from(db.objectStoreNames);
                db.close();
                resolve(storeNames);
            };

            request.onerror = (event) => {
                reject(`Failed to open database: ${event.target.error}`);
            };
        })
    }

    useEffect(() => {
        getAllObjectStoresNew('OCDAppDB').then((stores) => {
            console.log("Object Stores:", stores);
            setObjectStores(stores)
        }).catch((error) => {
            console.error(error);
        });
    }, [])

    const toggleDrawer = () => {
        console.log('toggling Drawer display pro.');
        (showDrawer == 'w-0') ? setShowDrawer('w-full md:w-1/3') : setShowDrawer('w-0')
    }

    return (
        <div className='m-3 min-h-[80vh]'>

            {/* <!-- drawer component --> */}
            <div className={`overflow-hidden ${showDrawer} fixed top-0 left-0 bottom-0 bg-gray-800/95 transition-all`}>
                <span className='m-3 px-2 absolute top-0 right-0 text-2xl rounded-md cursor-pointer hover:bg-gray-600' onClick={toggleDrawer}>&times;</span>
                <div className="sidebar p-3">
                    <h1 className='text-center pb-3'>YEARS</h1>
                    <ul>
                        {objectStores && objectStores?.map((objectStore, index) => (
                            <DrawerChildren key={index} objectStoreName={objectStore}></DrawerChildren>
                        ))}
                    </ul>
                </div>
            </div>

            <div className='flex text-center justify-center items-center mb-2'>
                <button className='rounded-lg hover:text-slate-400 dark:hover:bg-slate-300 hover:bg-slate-100'>
                    <Link href={`/allHistory/${(month==1)?month + '-' + year : (month - 1) + '-' + year}`} className='inline-block px-4 py-2 font-bold'>&larr;</Link>
                </button>

                <button className='p-4 rounded-lg hover:text-slate-400 dark:hover:bg-slate-300 hover:bg-slate-100' onClick={toggleDrawer}>
                    <h1 className='text-xl text-center inline-block w-60'>{getMonthName(month) + ' ' + year}</h1>
                </button>

                <button className='rounded-lg hover:text-slate-400 dark:hover:bg-slate-300 hover:bg-slate-100'>
                    <Link href={`/allHistory/${(month==12)?month + '-' + year : month+1 + '-' + year}`} className='inline-block px-4 py-2 font-bold '>&rarr;</Link>
                </button>
            </div>

            <div className='overflow-auto'>

                <table className="m-auto sm:w-3/5 table-auto border-collapse border border-slate-500">
                    <thead>
                        <tr className='text-slate-200 whitespace-nowrap'>
                            <th className='border border-slate-400 bg-slate-500 p-2'>Date</th>
                            <th className='border border-cyan-400 bg-cyan-500 p-2'>Total</th>
                            <th className='border border-orange-400 bg-orange-500 p-2'>W-7</th>
                            <th className='border border-orange-400 bg-orange-500 p-2'>7-9</th>
                            <th className='border border-orange-400 bg-orange-500 p-2'>9-12</th>
                            <th className='border border-orange-400 bg-orange-500 p-2'>12-15</th>
                            <th className='border border-orange-400 bg-orange-500 p-2'>15-18</th>
                            <th className='border border-orange-400 bg-orange-500 p-2'>18-21</th>
                            <th className='border border-orange-400 bg-orange-500 p-2'>21-M</th>
                        </tr>
                    </thead>

                    <tbody className='bg-slate-100 dark:bg-transparent whitespace-nowrap'>

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
                                </tr>
                            </>

                        }) :
                            <tr className=''>
                                <td colSpan="9" className='text-center p-4 dark:text-slate-100 text-black'>No history available</td>
                            </tr>}

                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default AllHistory

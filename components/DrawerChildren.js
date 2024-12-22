import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'

const DrawerChildren = ({ objectStoreName, cleanOpenedHistory }) => {

    const [allMonths, setAllMonths] = useState([])

    const retriveAllMonths = () => {
        const request = indexedDB.open('OCDAppDB');
        request.onsuccess = (event) => {
            console.log('Successfully opened IDB')

            const db = event.target.result;

            let transaction = db.transaction(objectStoreName, 'readonly'); // Open a transaction for the object store
            let objectStore = transaction.objectStore(objectStoreName); // Access the object store

            // Get all keys
            let keyRequest = objectStore.getAllKeys();

            keyRequest.onsuccess = function (event) {
                let keys = event.target.result; // This will contain an array of keys
                setAllMonths(keys)
                console.log('Keys:', keys);
            };

            keyRequest.onerror = function (event) {
                console.error('Error fetching keys:', event.target.error);
            };

            transaction.oncomplete = function () {
                console.log('Transaction completed successfully.');
            };

            // Optional: Handle transaction-level errors (not just putRequest errors)
            transaction.onerror = function (event) {
                console.error('Transaction failed:', event.target.error);
            };

            db.close();
        };

        request.onerror = (event) => {
            // reject(`Failed to open database: ${event.target.error}`);
            console.log('error while opening DB', event.target.error)
        };
    }

    const removeObjKey = (objStoName, mon) => {
        console.log('deleting key')

        const delYear = objStoName.slice(1) //Y2024
        const delMonth = mon.slice(5) //Month1
        cleanOpenedHistory(delYear, delMonth)

        const dbVer = JSON.parse(localStorage.getItem('dbVer'))
        console.log(dbVer)
        console.log(objStoName)
        console.log(mon)

        const request = indexedDB.open('OCDAppDB', dbVer+1);

        request.onsuccess = (event) => {
            localStorage.setItem('dbVer', dbVer+1)
            const db = event.target.result;

            // Start a transaction
            const transaction = db.transaction(objStoName, 'readwrite');
            const objectStore = transaction.objectStore(objStoName);

            // Delete the key
            const deleteRequest = objectStore.delete(mon);
            const intDeleteRequest = objectStore.delete(mon+'Int');

            deleteRequest.onsuccess = () => {
                console.log('Key successfully deleted.');
                // loadingHistory()
            };

            deleteRequest.onerror = (event) => {
                console.error('Error deleting key:', event.target.error);
            };

            intDeleteRequest.onsuccess = () => {
                console.log('Interval Key successfully deleted.');
            };

            intDeleteRequest.onerror = (event) => {
                console.error('Error deleting Interval key:', event.target.error);
            };
        };

        request.onerror = (event) => {
            console.error('Error opening database:', event.target.error);
        };

    }

    useEffect(() => {
        retriveAllMonths()
    }, [])

    return (
        <li className='border-b-2 p-2 hover:bg-gray-600'>
            <Link href={'#'} className=''>{objectStoreName}</Link>

            <ul className='subnav overflow-hidden opacity-0 max-h-0 mx-8 list-disc transition-all duration-300'>
                {allMonths.map((month, index) => {
                    if (month.slice(-1) != 't') {

                        return <li key={index} className='flex justify-between'>
                            <Link href={month.slice(5) + '-' + objectStoreName.slice(1)}>{month}</Link>
                            <button className='' onClick={(e) => { e.target.parentNode.remove(); removeObjKey(objectStoreName, month) }}>&#10008;</button>
                        </li>
                    } else {
                        console.log(month)
                    }

                })}
            </ul>
        </li>
    )
}

export default DrawerChildren

import { removeObjectStore, removeObjKey } from '@/utils/GlobalApi';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';

const DrawerChildren = ({ objectStoreName, cleanOpenedHistory, cleanOpenedHistoryYear }) => {

    const [allMonths, setAllMonths] = useState([])

    const retriveAllMonths = () => {
        const request = indexedDB.open('OCDAppDB');
        request.onsuccess = (event) => {
            console.log('Successfully opened IDB')

            const db = event.target.result;

            if (!db.objectStoreNames.contains(objectStoreName)) {
                console.error(`Object store "${objectStoreName}" not found. Stopping execution.`);
                return; // Exit the function if the object store does not exist
            }

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

    const removingObjKey = (objStoName, mon) => {
        const delYear = objStoName.slice(1) //Y2024
        const delMonth = mon.slice(5) //Month1
        removeObjKey(objStoName, mon)
        cleanOpenedHistory(delYear, delMonth)
    }

    useEffect(() => {
        retriveAllMonths()
    }, [])

    return (
        <li className='border-b-2 p-2 hover:bg-gray-600'>
            <div className='flex justify-between'>
                <Link href={'#'} className=''>{objectStoreName}</Link>
                <button className='' onClick={(e) => { console.log(e.currentTarget.parentNode.parentNode); e.currentTarget.parentNode.parentNode.remove(); cleanOpenedHistoryYear(objectStoreName.slice(1)); removeObjectStore(objectStoreName); }}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>

            <ul className='subnav overflow-hidden opacity-0 max-h-0 mx-8 list-disc transition-all duration-300'>
                {allMonths.map((month, index) => {
                    if (month.slice(-1) != 't') {

                        return <li key={index} className='flex justify-between'>
                            <Link href={month.slice(5) + '-' + objectStoreName.slice(1)}>{month}</Link>
                            <button className='inline-block' onClick={(e) => { console.log(e.currentTarget); e.currentTarget.parentNode.remove(); removingObjKey(objectStoreName, month) }}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
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

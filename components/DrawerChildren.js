import { replaceLoaderValue } from '@/redux/features/allIntervals/allIntervalsSlice';
import { removeObjectStore, removeObjKey } from '@/utils/GlobalApi';
import { faSnowflake, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const DrawerChildren = ({ objectStoreName, cleanOpenedHistory, cleanOpenedHistoryYear }) => {

    const dispatch = useDispatch()

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

    useEffect(() => {
        retriveAllMonths()
    }, [])

    const removingObjectStore = async (e) => {
        if (confirm(`This will remove all history of year ${objectStoreName.slice(1)}, Are you sure ?`)) {
            const parentElement = e.currentTarget.parentNode.parentNode;
            dispatch(replaceLoaderValue(40))
            try {
                await removeObjectStore(objectStoreName); // Wait for the promise to resolve
                cleanOpenedHistoryYear(objectStoreName.slice(1));
                parentElement.remove();
                dispatch(replaceLoaderValue(100))
                toast.success(`${objectStoreName.slice(1)} history has been removed`);
            } catch (error) {
                console.error(error); // Catch any errors and log them
                dispatch(replaceLoaderValue(100))
                toast.error(`An unexpected error occurred while removing history.`);
            }
        }
    };

    const removingObjKey = async (e, objStoName, mon) => {
        if (confirm(`This will remove history of ${mon.slice(5)} - ${objectStoreName.slice(1)}, Are you sure ?`)) {
            console.log(e.currentTarget);
            const parentElement = e.currentTarget.parentNode
            dispatch(replaceLoaderValue(40))

            try {
                await removeObjKey(objStoName, mon); // Wait for the promise to resolve
                parentElement.remove();
                const delYear = objStoName.slice(1) //Y2024
                const delMonth = mon.slice(5) //Month1
                cleanOpenedHistory(delYear, delMonth)
                dispatch(replaceLoaderValue(100))
                toast.success(`Month ${objStoName.slice(1)} has been removed`);
            } catch (error) {
                console.error(error); // Catch any errors and log them
                dispatch(replaceLoaderValue(100))
                toast.error(`An unexpected error occurred while removing history.`);
            }
        }
    }

    return (
        <li className='border-b-2 p-2 hover:bg-gray-600'>
            <div className='flex justify-between'>
                <Link href={'#'} className=''>{objectStoreName.slice(1)}</Link>
                <button className='' onClick={(e) => { removingObjectStore(e); }}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>

            <ul className='subnav overflow-hidden opacity-0 max-h-0 mx-8 list-disc transition-all duration-300'>
                {allMonths.map((month, index) => {
                    if (month.slice(-1) != 't') {

                        return <li key={index} className='flex justify-between'>
                            <Link href={month.slice(5) + '-' + objectStoreName.slice(1)}>{`Month ${month.slice(5)}`}</Link>
                            <button className='inline-block' onClick={(e) => { removingObjKey(e, objectStoreName, month) }}>
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

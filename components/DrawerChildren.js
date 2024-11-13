import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const DrawerChildren = ({ objectStoreName }) => {

    // const [objStore, setObjStore] = useState(objectStore)
    const [allMonths, setAllMonths] = useState([])

    useEffect(() => {
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
                localStorage.setItem('savedToIDB', true)
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
    }, [])



    return (
        <li className='border-b-2 p-2 hover:bg-gray-600'>
            <Link href={'#'} className=''>{objectStoreName}</Link>

            <ul className='subnav overflow-hidden opacity-0 max-h-0 mx-8 list-disc transition-all duration-300'>
                {allMonths.map((month, index) => (
                    <li key={index}>
                        <Link href={month.slice(5)+'-'+objectStoreName.slice(1)}>{month}</Link>
                    </li>
                ))}
            </ul>
        </li>
    )
}

export default DrawerChildren

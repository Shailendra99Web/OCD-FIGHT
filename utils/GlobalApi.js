import { toast } from "react-toastify"

const removeObjectStore = (storeName) => {

    console.log('deleting key')

    const dbVer = JSON.parse(localStorage.getItem('dbVer'))
    console.log(dbVer)
    console.log(storeName)

    const request = indexedDB.open('OCDAppDB', dbVer + 1);

    request.onupgradeneeded = (event) => {
        localStorage.setItem('dbVer', JSON.stringify(dbVer + 1))
        const db = event.target.result;

        // Check if the object store exists before trying to delete it
        if (db.objectStoreNames.contains(storeName)) {
            db.deleteObjectStore(storeName);
            console.log(`Object store "${storeName}" has been removed.`);
            toast.success(`The history of ${storeName.slice(1)} has been removed`);
        } else {
            console.warn(`Object store "${storeName}" does not exist in the database.`);
        }
    };

    request.onsuccess = () => {
        console.log(`Database upgrade complete.`);
    };

    request.onerror = (event) => {
        console.error(`Failed to remove object store: ${event.target.error}`);
    };
}

const removeObjKey = (objStoName, mon) => {
    console.log('deleting key')

    const dbVer = JSON.parse(localStorage.getItem('dbVer'))
    console.log(dbVer)
    console.log(objStoName)
    console.log(mon)

    const request = indexedDB.open('OCDAppDB', dbVer + 1);

    request.onsuccess = (event) => {
        localStorage.setItem('dbVer', JSON.stringify(dbVer + 1))
        const db = event.target.result;

        // Check if the object store exists
        if (!db.objectStoreNames.contains(objStoName)) {
            console.error(`Object store "${objStoName}" not found. Stopping execution.`);
            return; // Exit the function if the object store does not exist
        }

        // Start a transaction
        const transaction = db.transaction(objStoName, 'readwrite');

        const objectStore = transaction.objectStore(objStoName);

        // Delete the key
        const getRequest = objectStore.get(mon);
        const intDeleteRequest = objectStore.delete(mon + 'Int');

        getRequest.onsuccess = () => {
            if (getRequest.result) {

                const deleteRequest = objectStore.delete(mon);

                deleteRequest.onsuccess = () => {
                    console.log('Key successfully deleted.');
                    toast.success(`The history of month ${mon.slice(5)} has been removed`)
                }
                deleteRequest.onerror = () => {
                    console.error('Error deleting key:', event.target.error);
                    toast.warn(`Error while deleting history of month ${mon.slice(5)}`)
                }
            }

        };

        getRequest.onerror = (event) => {
            console.error('Error deleting key:', event.target.error);
            toast.warn(`Error while deleting history of month ${mon.slice(5)}`)
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

export { removeObjectStore, removeObjKey }
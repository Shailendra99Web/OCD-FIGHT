import { toast } from "react-toastify"

const removeObjectStore = (storeName) => {
    return new Promise((resolve, reject) => {
        console.log('deleting key');

        const dbVer = JSON.parse(localStorage.getItem('dbVer'));
        const request = indexedDB.open('OCDAppDB', dbVer + 1);

        request.onupgradeneeded = (event) => {
            localStorage.setItem('dbVer', JSON.stringify(dbVer + 1));
            const db = event.target.result;

            try {
                db.deleteObjectStore(storeName);
                console.log(`Object store "${storeName}" has been removed.`);
                resolve(true); // Resolve the promise if deletion is successful
                
            } catch (error) {
                console.log('sending reject error..')
                reject(error); // Reject the promise if there is an error during the deletion
            }
        };

        request.onsuccess = () => {
            console.log('Database upgrade complete.');
        };

        request.onerror = (event) => {
            console.error(`Failed to remove object store: ${event.target.error}`);
            reject(event.target.error); // Reject the promise if an error occurs
        };
    });
};

const removeObjectStoreOld = (storeName) => {

    console.log('deleting key')

    const dbVer = JSON.parse(localStorage.getItem('dbVer'))
    const request = indexedDB.open('OCDAppDB', dbVer + 1);

    request.onupgradeneeded = (event) => {
        localStorage.setItem('dbVer', JSON.stringify(dbVer + 1))
        const db = event.target.result;

        // Check if the object store exists before trying to delete it
        if (db.objectStoreNames.contains(storeName)) {
            db.deleteObjectStore(storeName);
            console.log(`Object store "${storeName}" has been removed.`);
        } else {
            console.warn(`Object store "${storeName}" does not exist in the database.`);
        }
    };

    request.onsuccess = () => {
        console.log(`Database upgrade complete.`);
        return true
    };

    request.onerror = (event) => {
        console.error(`Failed to remove object store: ${event.target.error}`);
        return false
    };
}

const removeObjKey = (objStoName, mon) => {
    return new Promise((resolve, reject) => {
        console.log('deleting key');

        const dbVer = JSON.parse(localStorage.getItem('dbVer'));
        const request = indexedDB.open('OCDAppDB', dbVer + 1);

        request.onsuccess = (event) => {
            localStorage.setItem('dbVer', JSON.stringify(dbVer + 1));
            const db = event.target.result;

            // Check if the object store exists
            if (!db.objectStoreNames.contains(objStoName)) {
                console.error(`Object store "${objStoName}" not found. Stopping execution.`);
                reject(new Error(`Object store "${objStoName}" does not exist.`));
                return; // Exit the function if the object store does not exist
            }

            // Start a transaction
            const transaction = db.transaction(objStoName, 'readwrite');
            const objectStore = transaction.objectStore(objStoName);

            // Delete the keys
            const deleteRequest = objectStore.delete(mon);
            const intDeleteRequest = objectStore.delete(mon + 'Int');

            deleteRequest.onsuccess = () => {
                console.log('Key successfully deleted.');
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

            // Resolve when the transaction completes successfully
            transaction.oncomplete = () => {
                resolve(true);
            };

            // Reject if there's an error with the transaction
            transaction.onerror = (event) => {
                reject (new Error(`Transaction failed: ${event.target.error}`));
            };
        };

        request.onerror = (event) => {
            console.error('Error opening database:', event.target.error);
            reject (new Error(`Error opening database: ${event.target.error}`));
        };
    });
};

const removeObjKeyOld = (objStoName, mon) => {
    console.log('deleting key')

    const dbVer = JSON.parse(localStorage.getItem('dbVer'))
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
        const deleteRequest = objectStore.delete(mon);
        const intDeleteRequest = objectStore.delete(mon + 'Int');

        deleteRequest.onsuccess = () => {
            console.log('Key successfully deleted.');
            toast.success(`The history of month ${mon.slice(5)} has been removed`)
        }
        deleteRequest.onerror = () => {
            console.error('Error deleting key:', event.target.error);
            toast.warn(`Error while deleting history of month ${mon.slice(5)}`)
        }

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
};


export { removeObjectStore, removeObjKey }
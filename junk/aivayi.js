
// [
  //   {
  //     D1: [
  //         { start: '00:00', end: '07:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
  //         { start: '07:00', end: '18:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
  //         { start: '18:00', end: '00:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
  //     ]
  //     // ...
  //   }
  // ]

const Month10 =
    [
        {
            D1: [
                { start: '00:00', end: '07:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '07:00', end: '18:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '18:00', end: '00:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
            ],
            D2: [
                { start: '00:00', end: '07:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '07:00', end: '18:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '18:00', end: '00:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
            ],
            D3: [
                { start: '00:00', end: '07:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '07:00', end: '18:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '18:00', end: '00:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
            ],
            // ...
        }
    ]

const Month11 =
    [
        {
            D1: [
                { start: '00:00', end: '07:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '07:00', end: '18:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '18:00', end: '00:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
            ],
            D2: [
                { start: '00:00', end: '07:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '07:00', end: '18:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '18:00', end: '00:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
            ],
            D3: [
                { start: '00:00', end: '07:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '07:00', end: '18:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
                { start: '18:00', end: '00:00', totalCom: '05', totalRum1: '00', totalRum2: '15' },
            ],
            // ...
        }
    ]



// To get the Data from IndexedDB
if (typeof window !== 'undefined') {
    const request = indexedDB.open('OCDAppDB', 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['countStore'], 'readonly');
        const objectStore = transaction.objectStore('countStore');
        const getRequest = objectStore.get(String(currentMonth + 1));

        getRequest.onsuccess = function () {
            if (getRequest.result) {
                const storedData = JSON.parse(getRequest.result.value);
                setAllPreviousCount(storedData);
                console.log('Retrieved from IndexedDB:', storedData);
            }
        }
    }
}


// To store data in IndexedDB
if (typeof window !== "undefined") {
    console.log('saving to IndexedDB')
    const request = indexedDB.open("OCDAppDB", 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore("countStore", { keyPath: "key" });
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["countStore"], "readwrite");
        const objectStore = transaction.objectStore("countStore");
        const month = 'Month' + String(new Date().getMonth() - 1);
        const day = 'Month' + String(new Date().getDate() - 1);
        console.log(month)
        console.log(day)
        objectStore.put({ key: month, value: JSON.stringify([{ [day]: allPreviousCount }]) });
        console.log("Data saved to IndexedDB");
    };

    request.onerror = function (event) {
        console.error("Error opening IndexedDB", event);
    };
}
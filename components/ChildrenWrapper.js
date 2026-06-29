'use client'
import { replace, replaceLastSavedDateAllHis } from '@/redux/features/allIntervals/allIntervalsSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { ToastContainer } from 'react-toastify'
import LoadingBar from 'react-top-loading-bar'

const ChildrenWrapper = ({ children }) => {
    const loader = useAppSelector((state) => state.allIntervals.loader)

    const [isInitialized, setIsInitialized] = useState(false); // To render other components or not
    const dispatch = useAppDispatch()
    const [savetoLS, setSavetoLS] = useState(false)

    // For theme.
    const [darkMode, setDarkMode] = useState('');
    const [showSun, setShowSun] = useState('')
    const [showMoon, setShowMoon] = useState('hidden')

    useEffect(() => {
        console.log('taking theme from local storage')
        let localStoTheme = JSON.parse(localStorage.getItem('theme'))
        if (localStoTheme) {
            setDarkMode(localStoTheme);
            if (localStoTheme == 'dark') {
                setShowSun('')
                setShowMoon('hidden')
            } else {
                setShowSun('hidden')
                setShowMoon('')
            }
        }
    }, [])

    const toggleDarkMode = () => {
        setSavetoLS(true)
        setDarkMode((prev) => (prev === 'dark' ? '' : 'dark'));
        setShowSun((prev) => (prev == '' ? 'hidden' : ''))
        setShowMoon((prev) => (prev == '' ? 'hidden' : ''))
    };

    useEffect(() => {
        if (savetoLS) {
            console.log('setting theme in local storage')
            localStorage.setItem('theme', JSON.stringify(darkMode))
        }
    }, [darkMode])


    useEffect(() => {
        const initialize = async () => {
            await new Promise((resolve) => {
                let holdIntervals = JSON.parse(localStorage.getItem('allIntervals'))
                if (holdIntervals) {
                    console.log(holdIntervals)
                    dispatch(replace({ holdIntervals, saveToLS: true }))
                }
                const lSDAllHistory = JSON.parse(localStorage.getItem('lastSavedDateforAllHistory'))
                if (lSDAllHistory) {
                    console.log('saving lastSavedDateforAllHistory..')
                    dispatch(replaceLastSavedDateAllHis({ lSDAllHistory, saveToLS: false }))
                }
                resolve()
            });
            setIsInitialized(true);
        };

        initialize();
    }, []);

    if (!isInitialized) {
        return <div>Loading...</div>
    }

    // Pass toggleDarkMode to children (Navbar)
    return <div className={`${darkMode} bg-gradient-to-r from-sky-500 to-indigo-500 dark:bg-gray-800 dark:from-gray-800 dark:to-gray-800 dark:text-slate-300 transition-all duration-500 ease-in-out`}>
        <LoadingBar color={'#1e90ff'} height={3} progress={loader} />
        <Navbar setDarkMode={toggleDarkMode} showSun={showSun} showMoon={showMoon} />
        {children}
        <Footer />
        <ToastContainer position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode == 'dark' ? 'dark' : 'light'}
        />
    </div>
}

export default ChildrenWrapper

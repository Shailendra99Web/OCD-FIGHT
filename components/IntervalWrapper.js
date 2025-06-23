'use client'
import { replace } from '@/redux/features/allIntervals/allIntervalsSlice'
import { useAppDispatch } from '@/redux/hooks'
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const IntervalWrapper = ({ children }) => {
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
        <Navbar setDarkMode={toggleDarkMode} showSun={showSun} showMoon={showMoon} />
        {children}
        <Footer />
    </div>
}

export default IntervalWrapper

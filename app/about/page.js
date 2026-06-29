'use client'
import Link from 'next/link'
import { useAppDispatch } from '@/redux/hooks'
import React, { useEffect } from 'react'
import { replaceLoaderValue } from '@/redux/features/allIntervals/allIntervalsSlice'

const About = () => {

  const dispatch = useAppDispatch()

  useEffect(()=>{
    dispatch(replaceLoaderValue(100))
  }, [])

  return (
    <div className='px-4 m-4 min-h-[80vh]'>
      <h1 className='text-xl text-center'>About</h1>
      <div className=''>
        <p>Hello There,</p>
        <br></br>
        <p>Me Shailendra from India. It&apos;s a simple OCD Counter application to help OCD sufferers to fight against OCD.</p>
        <p>OCD sufferers can count their daily compulsions & ruminations easily through this app.</p>
        <br></br>
        <div>
          <p>Use of this application :</p>
          <ol className='list-disc px-3'>
            <li>Count compulsions & ruminations.</li>
            <li>But for now, we can only store one day history  (Today&apos;s).</li>
            <li>Set Intervals, by which Counter and History will be organised.</li>
          </ol>
        </div>
        <br></br>
        <p>Special Thanks to <Link href='https://youtube.com/@ocdhelp?si=9WEzLRviQY6nvd_j' className='hover:underline'>Miss Ali Greymond</Link>, As this application&lsquo;s working method is Completely Inspired by her - &lsquo;Greymond Method&lsquo;.</p>
      </div>
    </div>
  )
}

export default About

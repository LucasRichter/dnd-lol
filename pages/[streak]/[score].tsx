import React from 'react'
import { useRouter } from "next/router"
import Link from 'next/link'
import Head from 'next/head'

const FinalScore = () => {
    const router = useRouter()
    const { streak, score } = router.query
    return (
        <div className='text-white gap-y-10 text-center w-screen h-screen flex flex-col justify-center items-center'>
            <Head>
                <title>Derrota!</title>
            </Head>
            <h1 className='text-3xl font-semibold italic'>Final game</h1>
            <div className='text-lg'>
                <p>
                    Max Streak: {streak}
                </p>
                <p>
                    Final Score: {score}
                </p>
            </div>
            <Link href='/'>
                <a>
                    <button className="inline-flex items-center px-6 py-2 text-2xl text-green-100 bg-green-600 rounded hover:bg-green-700">
                        <span>Go back</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 ml-2 mt-0.5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </a>
            </Link>
        
        </div>
    )
}

export default FinalScore

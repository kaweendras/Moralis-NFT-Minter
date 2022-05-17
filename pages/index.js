
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMoralis } from 'react-moralis'

export default function Home() {
  const {authenticate, isAuthenticated} =useMoralis()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated])

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Head>
        <title>Lanka Minter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={authenticate} className='bg-yellow-300 px-8 py-5 rounded-xl text-lg animate-pulse'> Login Using Metamask </button>
    </div>
  )
}


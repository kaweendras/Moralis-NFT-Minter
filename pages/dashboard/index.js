import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'

function Dashboard() {
    const {isAuthenticated, logout} = useMoralis()
    const router = useRouter()
    const [name, setname] = useState('')
    const [description, setdescription] = useState('')
    const [file, setfile] = useState(null)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated])

    const onSubmit = async (e) => {
        e.preventDefault()
    }
  return (
    <div className="flex w-screen h-screen items-center justify-center">
        <form onSubmit={onSubmit}> 
            <div className='mt-3'>
               <input type="text" className='border-[1px] p-2 text-lg border-black w-full' 
               placeholder="Name"
               value={name}
               onChange={e => setname(e.target.value)}
               />
            </div> 
            <div className='mt-3'>
               <input type="text" className='border-[1px] p-2 text-lg border-black w-full' 
               placeholder="description"
               value={description}
               onChange={e => setdescription(e.target.value)} 
               />
            </div> 
            <div className='mt-3'>
               <input type="file" className='border-[1px] p-2 text-lg border-black w-full' 
               placeholder="Image/file" 
               value={file}
               onChange={e => setfile(e.target.files[0])}
               />
            </div> 
            <button type='submit' className='mt-5 w-full p-5 bg-green-700 text-white text-lg rounded-xl animate-pulse'> Mint </button>
            <button onClick={logout} className='mt-5 w-full p-5 bg-red-700 text-white text-lg rounded-xl '>Log Out</button>
        </form>
        </div>
  )
}

export default Dashboard
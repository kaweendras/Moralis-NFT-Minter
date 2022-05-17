import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import Moralis from 'moralis' 
import Web3 from 'web3'
import { contractABI, contractAddress } from '../../contract'
const buffer = require('buffer').Buffer;

const web3 = new Web3(Web3.givenProvider)

function Dashboard() {
    const {isAuthenticated, logout, user} = useMoralis()
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
        try {
            // save images to ipfs
            const file1 = new Moralis.File(file.name, file)
            await file1.saveIPFS()
            const file1Url = file1.ipfs()

            //generate metadata and save to ipfs
            const metadata = {
                name: name,
                description: description,
                image: file1Url
                }
            const file2 = new Moralis.File(`${name}metadata.json`,{
                base64: buffer.from(JSON.stringify(metadata)).toString('base64')
            })
            await file2.saveIPFS()
            const metadataUrl = file2.ipfs()
            //interact with smart contract
            const contract = new web3.eth.Contract(contractABI, contractAddress)
            const response = await contract.methods
                .mint(metadataUrl)
                .send({from: user.get("ethAddress")})
            const tokenId = response.events.Transfer.returnValues.tokenId

            console.log('TokenId: ', tokenId)
            console.log('Contract Address',contractAddress)

            alert(`NFT Minted. Contract address = ${contractAddress} and Token ID = ${tokenId}`)

        } catch (err) {
            console.error(err)
            alert('Error Miniting NFT')
        }
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
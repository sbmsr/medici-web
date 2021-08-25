import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'

const initWeb3 = async (
  setWeb3: Dispatch<SetStateAction<Web3>>
): Promise<void> => {
  if (typeof window !== 'undefined') {
    const web3Modal = new Web3Modal({
      network: 'mainnet', // optional
      cacheProvider: true,
      providerOptions: {}, // required
    })
    const provider = await web3Modal.connect()
    setWeb3(new Web3(provider))
  }
}

export const Home = (): JSX.Element => {
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined)

  useEffect(() => {
    if (!web3) {
      initWeb3(setWeb3)
    }
  }, [])

  return <h1>Using Web3 Version: {web3?.version}</h1>
}

export default Home

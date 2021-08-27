import { useEffect, useState } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { attemptPurchase, initWeb3 } from '../lib/web3'

export const Home = (): JSX.Element => {
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | undefined>(undefined)
  const [web3Provider, setWeb3Provider] = useState<Web3 | undefined>(undefined)

  useEffect(() => {
    if (!web3Provider) {
      initWeb3(setWeb3Provider, setWeb3Modal)
    }
  }, [])

  if (!web3Provider) return <h1> loading </h1>

  return (
    <main>
      <h1 className="title">Web3Modal Example</h1>
      {web3Modal && (
        <button
          className="button"
          type="button"
          onClick={async () => await attemptPurchase(web3Modal, web3Provider)}
        >
          Send Funds
        </button>
      )}
    </main>
  )
}

export default Home

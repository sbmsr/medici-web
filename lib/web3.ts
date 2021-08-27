import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import Web3Modal from 'web3modal'
import { mediciABI } from './constants'

export interface MediciAPI {
  attemptPurchase: (
    address: string,
    price: string
  ) => Promise<TransactionReceipt>
}

export const initWeb3 = async (
  setApi: React.Dispatch<React.SetStateAction<MediciAPI>>
): Promise<MediciAPI> => {
  if (typeof window === 'undefined') return

  const web3Modal = new Web3Modal({
    providerOptions: {}, // required
  })

  const modalProvider = await web3Modal.connect()
  const web3Provider = new Web3(modalProvider)
  const fromAddress = (await web3Provider.eth.getAccounts())[0]
  if (!fromAddress) {
    alert(`Unable to retrieve your address`)
    return
  }

  setApi({
    attemptPurchase: async (address: string): Promise<TransactionReceipt> => {
      const Medici = new web3Provider.eth.Contract(mediciABI, address)
      const price = await Medici.methods.price().call()
      try {
        return await Medici.methods.attemptPurchase().send({
          from: fromAddress,
          to: address,
          value: price,
        })
      } catch (e: any) {
        alert(`Attempt Purchase Failed`)
      }
    },
  })
}

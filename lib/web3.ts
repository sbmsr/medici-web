import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import Web3Modal from 'web3modal'
import { mediciABI } from './constants'

export interface MediciAPI {
  attemptPurchase: (galleryAddress: string) => Promise<TransactionReceipt>
  detectHasPaid: (galleryAddress: string) => Promise<boolean>
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
  const fromAddresses = await web3Provider.eth.getAccounts()
  if (fromAddresses === []) {
    alert(`Unable to retrieve your address`)
    return
  }

  setApi({
    attemptPurchase: async (
      galleryAddress: string
    ): Promise<TransactionReceipt> => {
      const Medici = new web3Provider.eth.Contract(mediciABI, galleryAddress)
      const price = await Medici.methods.price().call()
      try {
        return await Medici.methods.attemptPurchase().send({
          from: fromAddresses[0], // TODO: Let user select the desired address
          to: galleryAddress,
          value: price,
        })
      } catch (e: any) {
        alert(`Purchase Failed: ${e}`)
      }
    },
    // TODO: Should do this server side.
    detectHasPaid: async (galleryAddress: string): Promise<boolean> => {
      const Medici = new web3Provider.eth.Contract(mediciABI, galleryAddress)
      const blockNumber = await Medici.methods.blockNumber().call()
      const events = await Medici.getPastEvents('paymentSuccessful', {
        fromBlock: blockNumber,
      })

      const receipts = events.filter((event) =>
        Object.values(event.returnValues).some((el) =>
          fromAddresses.includes(el)
        )
      )

      if (receipts.length === 0) return false

      receipts.sort((r1, r2) => r1.blockNumber - r2.blockNumber)

      const oldestReceipt = receipts[0]

      const isSecure =
        (await web3Provider.eth.getBlockNumber()) - oldestReceipt.blockNumber >=
        12 // https://ethereum.stackexchange.com/a/3009/79524

      return isSecure
    },
  })
}

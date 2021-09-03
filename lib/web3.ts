import Web3 from 'web3'
import { TransactionReceipt } from 'web3-eth'
import Web3Modal from 'web3modal'
import { mediciABI } from './constants'

export interface MediciAPI {
  attemptPurchase: (galleryAddress: string) => Promise<TransactionReceipt>
  detectHasPaid: (galleryAddress: string) => Promise<boolean>
  getPriceWei: (galleryAddress: string) => Promise<string>
  getPriceString: (galleryAddress: string) => Promise<string>
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

  //////////////
  // API Methods
  //////////////

  const getPriceWei = async (galleryAddress: string): Promise<string> => {
    const Medici = new web3Provider.eth.Contract(mediciABI, galleryAddress)
    return await Medici.methods.price().call()
    return
  }

  const getPriceString = async (galleryAddress: string): Promise<string> => {
    const Medici = new web3Provider.eth.Contract(mediciABI, galleryAddress)
    const price = await Medici.methods.price().call()
    return web3Provider.utils.fromWei(price, 'ether')
  }

  const attemptPurchase = async (
    galleryAddress: string
  ): Promise<TransactionReceipt> => {
    const Medici = new web3Provider.eth.Contract(mediciABI, galleryAddress)
    try {
      return await Medici.methods.attemptPurchase().send({
        from: fromAddresses[0], // TODO: Let user select the desired address
        to: galleryAddress,
        value: await getPriceWei(galleryAddress),
      })
    } catch (e: any) {
      alert(`Purchase Failed: ${e}`)
    }
  }

  const detectHasPaid = async (galleryAddress: string): Promise<boolean> => {
    // TODO: Should do this server side.
    const Medici = new web3Provider.eth.Contract(mediciABI, galleryAddress)
    const blockNumber = await Medici.methods.blockNumber().call()
    const events = await Medici.getPastEvents('paymentSuccessful', {
      fromBlock: blockNumber,
    })

    const receipts = events.filter((event) =>
      Object.values(event.returnValues).some((el) => fromAddresses.includes(el))
    )

    if (receipts.length === 0) return false

    receipts.sort((r1, r2) => r1.blockNumber - r2.blockNumber)

    const oldestReceipt = receipts[0]

    const isSecure =
      (await web3Provider.eth.getBlockNumber()) - oldestReceipt.blockNumber >=
      12 // https://ethereum.stackexchange.com/a/3009/79524

    return isSecure
  }

  setApi({
    attemptPurchase: attemptPurchase,
    detectHasPaid: detectHasPaid,
    getPriceWei: getPriceWei,
    getPriceString: getPriceString,
  })
}

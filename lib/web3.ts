import { ContractTransaction, ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Medici } from '../../backend/typechain/Medici'
import { mediciABI } from './constants'

export interface MediciAPI {
  getPriceWei: (
    galleryAddress: string,
    productId: string
  ) => Promise<ethers.BigNumber>
  getPriceString: (galleryAddress: string, productId: string) => Promise<string>
  attemptPurchase: (
    galleryAddress: string,
    productIds: string[]
  ) => Promise<ContractTransaction>
  detectHasPaidSecurely: (
    galleryAddress: string,
    productId: string
  ) => Promise<boolean>
  detectHasPaid: (galleryAddress: string, productId: string) => Promise<boolean>
}

export const initWeb3 = async (
  setApi: React.Dispatch<React.SetStateAction<MediciAPI>>
): Promise<MediciAPI> => {
  if (typeof window === 'undefined') return

  const web3Modal = new Web3Modal({
    providerOptions: {}, // required
  })

  const modalProvider = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(modalProvider)
  const signer = provider.getSigner()
  const fromAddress = await signer.getAddress()

  const getMediciContract = async (galleryAddress): Promise<Medici> => {
    return new ethers.Contract(galleryAddress, mediciABI, provider).connect(
      signer
    ) as Medici
  }

  //////////////
  // API Methods
  //////////////

  const getPriceWei = async (
    galleryAddress: string,
    productId: string
  ): Promise<ethers.BigNumber> => {
    const Medici = await getMediciContract(galleryAddress)
    return (await Medici.inventory(productId)).price
  }

  const getPriceString = async (
    galleryAddress: string,
    productId: string
  ): Promise<string> => {
    const Medici = await getMediciContract(galleryAddress)
    const price = (await Medici.inventory(productId)).price
    return ethers.utils.formatEther(price)
  }

  const attemptPurchase = async (
    galleryAddress: string,
    productIds: string[]
  ): Promise<ContractTransaction> => {
    const Medici = await getMediciContract(galleryAddress)
    const prices = await Promise.all(
      productIds.map(
        async (productId) => await getPriceWei(galleryAddress, productId)
      )
    )

    const sum = prices.reduce((x, y) => (y ? x.add(y) : x))

    return await Medici.attemptPurchase(productIds, {
      from: fromAddress,
      value: sum,
    })
  }

  const detectHasPaidSecurely = async (
    galleryAddress: string,
    productId: string
  ): Promise<boolean> => {
    const purchaseEvents = await getRelevantPurchaseEvents(
      galleryAddress,
      productId
    )

    if (purchaseEvents.length == 0) return false

    const oldestPurchase = purchaseEvents[0]

    // https://ethereum.stackexchange.com/a/3009/79524
    const isSecure =
      (await provider.getBlockNumber()) - oldestPurchase.block >= 12

    return isSecure
  }

  const detectHasPaid = async (
    galleryAddress: string,
    productId: string
  ): Promise<boolean> => {
    const purchaseEvents = await getRelevantPurchaseEvents(
      galleryAddress,
      productId
    )

    return purchaseEvents.length > 0
  }

  const getRelevantPurchaseEvents = async (
    galleryAddress: string,
    productId: string
  ): Promise<
    {
      block: number
      event: string
      buyer: string
      products: string[]
    }[]
  > => {
    // TODO: Should do this server side.
    const Medici = await getMediciContract(galleryAddress)
    const filter = Medici.filters.paymentSuccessful(fromAddress)
    const fromBlock = (await Medici.blockNumber()).toNumber()

    const logs = await Medici.queryFilter(filter, fromBlock)
    const iface = new ethers.utils.Interface(mediciABI)

    const formattedLogs: {
      block: number
      event: string
      buyer: string
      products: string[]
    }[] = logs.map((log) => {
      const { args, name } = iface.parseLog(log)
      return {
        block: log.blockNumber,
        event: name,
        buyer: args.buyer,
        products: args.products,
      }
    })

    const logsWithProductId = formattedLogs
      .filter((log) => log.products.includes(productId))
      .sort((l1, l2) => l1.block - l2.block)

    return logsWithProductId
  }

  setApi({
    attemptPurchase: attemptPurchase,
    detectHasPaidSecurely: detectHasPaidSecurely,
    detectHasPaid: detectHasPaid,
    getPriceWei: getPriceWei,
    getPriceString: getPriceString,
  })
}
